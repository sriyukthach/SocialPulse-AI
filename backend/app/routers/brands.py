from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.brand import Brand
from app.models.post import Post
from app.schemas.brand import BrandCreate, BrandResponse
from app.schemas.post import BrandDashboardStats, PostResponse
from app.services.analytics_service import compute_brand_stats, calculate_post_engagement_rate
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/brands", tags=["Brands"])

from pydantic import BaseModel

class ChannelAnalyzeRequest(BaseModel):
    channel_url_or_handle: str

def parse_channel_handle(input_str: str) -> str:
    cleaned = input_str.strip().rstrip('/')
    if 'youtube.com/' in cleaned:
        parts = cleaned.split('youtube.com/')
        cleaned = parts[-1]
    if cleaned.startswith('c/') or cleaned.startswith('user/') or cleaned.startswith('channel/'):
        cleaned = cleaned.split('/')[-1]
    if cleaned.startswith('@'):
        cleaned = cleaned[1:]
    return cleaned.lower() or "mkbhd"

@router.get("", response_model=List[BrandResponse])
def list_brands(db: Session = Depends(get_db)):
    return db.query(Brand).all()

@router.post("", response_model=BrandResponse)
def create_brand(brand_in: BrandCreate, db: Session = Depends(get_db)):
    existing = db.query(Brand).filter(Brand.slug == brand_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Brand slug already exists")
    
    brand = Brand(**brand_in.model_dump())
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand

from app.config import settings
from app.services.youtube_service import youtube_service

@router.post("/analyze_channel", response_model=BrandDashboardStats)
def analyze_channel(req: ChannelAnalyzeRequest, db: Session = Depends(get_db)):
    if not req.channel_url_or_handle or not req.channel_url_or_handle.strip():
        raise HTTPException(status_code=400, detail="Please enter a valid YouTube channel URL or handle.")

    if not settings.YOUTUBE_API_KEY or not settings.YOUTUBE_API_KEY.strip():
        raise HTTPException(
            status_code=400,
            detail="YouTube API key (YOUTUBE_API_KEY) is missing in backend/.env. Please configure your Google YouTube Data API v3 key in backend/.env to analyze live YouTube channels."
        )

    try:
        ch_info = youtube_service.fetch_channel_details(req.channel_url_or_handle, settings.YOUTUBE_API_KEY)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to communicate with YouTube Data API: {str(e)}")

    handle = ch_info["slug"]
    brand = db.query(Brand).filter(Brand.slug == handle).first()
    
    if not brand:
        desc = ch_info["description"][:250] if ch_info["description"] else f"Public subscribers and viewers of {ch_info['title']} ({ch_info['custom_url']})"
        brand = Brand(
            name=f"{ch_info['title']} ({ch_info['custom_url']})",
            slug=handle,
            industry="YouTube Channel",
            audience_description=desc,
            content_goal=f"Public video strategy for {ch_info['title']} ({ch_info['view_count']:,} channel views, {ch_info['video_count']:,} videos)"
        )
        db.add(brand)
        db.commit()
        db.refresh(brand)

    # Fetch actual public video uploads from YouTube Data API
    try:
        yt_videos = youtube_service.fetch_recent_videos(ch_info["uploads_playlist_id"], settings.YOUTUBE_API_KEY, max_results=10)
    except Exception as err:
        yt_videos = []

    for v in yt_videos:
        existing_post = db.query(Post).filter(Post.brand_id == brand.id, Post.topic == v["title"]).first()
        if not existing_post:
            new_post = Post(
                brand_id=brand.id,
                topic=v["title"],
                format=v["format"],
                caption=v["description"][:300] if v["description"] else "No public description provided.",
                likes=v["like_count"] or 0,
                comments_count=v["comment_count"] or 0,
                shares_count=v["view_count"], # Views mapped to shares_count
                audience_feedback=v["audience_feedback"],
                posted_date=v["published_at"],
                hindsight_retained=True
            )
            db.add(new_post)
            db.commit()

            # Retain actual observation into Hindsight
            obs_text = f"Video '{v['title']}' ({v['format']}) achieved {v['view_count']:,} views, {v['like_count'] or 0:,} likes, and {v['comment_count'] or 0:,} comments."
            if v["audience_feedback"]:
                obs_text += f" Viewer comments: {v['audience_feedback']}"
            
            try:
                hindsight_service.retain_memory(
                    brand_slug=brand.slug,
                    insight_text=obs_text,
                    context="YouTube Data API Retrieval"
                )
            except Exception:
                pass

    posts = db.query(Post).filter(Post.brand_id == brand.id).order_by(Post.created_at.desc()).all()
    stats = compute_brand_stats(posts)

    post_responses = []
    for p in posts:
        pr = PostResponse.model_validate(p)
        pr.engagement_rate = calculate_post_engagement_rate(p)
        post_responses.append(pr)

    memories = hindsight_service.recall_memories(brand_slug=brand.slug, query="video views comments performance", max_tokens=1000)

    return BrandDashboardStats(
        brand=BrandResponse.model_validate(brand),
        total_posts=stats["total_posts"],
        total_likes=stats["total_likes"],
        total_comments=stats["total_comments"],
        total_shares=stats["total_shares"],
        average_engagement_rate=stats["average_engagement_rate"],
        top_performing_format=stats["top_performing_format"],
        recent_posts=post_responses[:10],
        recent_memories_count=len(memories)
    )

@router.get("/{brand_id}", response_model=BrandResponse)
def get_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@router.get("/{brand_id}/dashboard", response_model=BrandDashboardStats)
def get_brand_dashboard(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    posts = db.query(Post).filter(Post.brand_id == brand_id).order_by(Post.created_at.desc()).all()
    stats = compute_brand_stats(posts)

    # Attach calculated engagement rates
    post_responses = []
    for p in posts:
        pr = PostResponse.model_validate(p)
        pr.engagement_rate = calculate_post_engagement_rate(p)
        post_responses.append(pr)

    # Fetch count of memories from Hindsight
    memories = hindsight_service.recall_memories(brand_slug=brand.slug, query="audience engagement", max_tokens=1000)

    return BrandDashboardStats(
        brand=BrandResponse.model_validate(brand),
        total_posts=stats["total_posts"],
        total_likes=stats["total_likes"],
        total_comments=stats["total_comments"],
        total_shares=stats["total_shares"],
        average_engagement_rate=stats["average_engagement_rate"],
        top_performing_format=stats["top_performing_format"],
        recent_posts=post_responses[:10],
        recent_memories_count=len(memories)
    )

