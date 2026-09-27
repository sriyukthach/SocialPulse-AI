from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False) # Hindsight memory bank ID
    industry = Column(String(100), nullable=False)
    audience_description = Column(Text, nullable=False)
    content_goal = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    posts = relationship("Post", back_populates="brand", cascade="all, delete-orphan")
    analyses = relationship("AnalysisLog", back_populates="brand", cascade="all, delete-orphan")
    scheduled_posts = relationship("ScheduledPost", back_populates="brand", cascade="all, delete-orphan")
