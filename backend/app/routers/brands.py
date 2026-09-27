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
