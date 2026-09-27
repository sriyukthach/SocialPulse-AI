from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class BrandBase(BaseModel):
    name: str = Field(..., example="GlowNest Skincare")
    slug: str = Field(..., example="glownest")
    industry: str = Field(..., example="Skincare & Beauty")
    audience_description: str = Field(..., example="Young adults (18-30) focused on clean, affordable skincare and acne-prone routines.")
    content_goal: str = Field(..., example="Increase authentic community engagement and drive educational saves/shares.")

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
