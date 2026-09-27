from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    topic = Column(String(200), nullable=False)
    format = Column(String(50), nullable=False) # Carousel, Video Reel, Static Image, Story/Thread
    caption = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    audience_feedback = Column(Text, nullable=True) # Comments, audience questions, sentiment
    posted_date = Column(String(50), nullable=True) # e.g. "2026-09-20"
    hindsight_retained = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    brand = relationship("Brand", back_populates="posts")

class AnalysisLog(Base):
    __tablename__ = "analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    analysis_json = Column(Text, nullable=False)
    recalled_memories_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    brand = relationship("Brand", back_populates="analyses")
