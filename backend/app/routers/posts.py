from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.brand import Brand
from app.models.post import Post
from app.schemas.post import PostCreate, PostResponse
from app.services.analytics_service import calculate_post_engagement_rate
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/posts", tags=["Posts"])

@router.get("", response_model=List[PostResponse])
def list_posts(brand_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Post)
    if brand_id:
        query = query.filter(Post.brand_id == brand_id)
    posts = query.order_by(Post.created_at.desc()).all()

    results = []
    for p in posts:
        pr = PostResponse.model_validate(p)
        pr.engagement_rate = calculate_post_engagement_rate(p)
        results.append(pr)
    return results

@router.post("", response_model=PostResponse)
def create_post(post_in: PostCreate, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == post_in.brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    post = Post(**post_in.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)

    # Retain the post details and audience feedback into Hindsight
    retain_res = hindsight_service.retain_post(
        brand_slug=brand.slug,
        post_data=post_in.model_dump()
    )
    if retain_res.get("success"):
        post.hindsight_retained = True
        db.commit()
        db.refresh(post)

    pr = PostResponse.model_validate(post)
    pr.engagement_rate = calculate_post_engagement_rate(post)
    return pr
