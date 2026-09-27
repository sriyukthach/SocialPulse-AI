from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.brand import BrandResponse

class PostBase(BaseModel):
    topic: str = Field(..., example="Morning Skincare Routine for Oily Skin")
    format: str = Field(..., example="Carousel") # Carousel, Video Reel, Static Image, Story/Thread
    caption: str = Field(..., example="Swipe through our step-by-step lightweight morning routine designed to balance sebum without stripping moisture! ✨ #SkincareTips")
    likes: int = Field(0, example=450)
    comments_count: int = Field(0, example=85)
    shares_count: int = Field(0, example=120)
    audience_feedback: Optional[str] = Field(None, example="Top comments: 'Which cleanser is best for acne?', 'Can you do an affordable version under $20?'")
    posted_date: Optional[str] = Field(None, example="2026-09-20")

class PostCreate(PostBase):
    brand_id: int

class PostResponse(PostBase):
    id: int
    brand_id: int
    hindsight_retained: bool
    created_at: datetime
    engagement_rate: Optional[float] = None

    class Config:
        from_attributes = True

class BrandDashboardStats(BaseModel):
    brand: BrandResponse
    total_posts: int
    total_likes: int
    total_comments: int
    total_shares: int
    average_engagement_rate: float
    top_performing_format: str
    recent_posts: List[PostResponse]
    recent_memories_count: int

BrandDashboardStats.model_rebuild()
