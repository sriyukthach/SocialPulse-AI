from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class BrandBase(BaseModel):
    name: str = Field(..., example="Marques Brownlee (@mkbhd)")
    slug: str = Field(..., example="mkbhd")
    industry: str = Field(..., example="YouTube Tech & Media")
    audience_description: str = Field(..., example="Tech enthusiasts, power users, and gadget buyers seeking deep-dive hardware reviews.")
    content_goal: str = Field(..., example="Deliver high-production video breakdowns and honest benchmark comparisons.")

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
