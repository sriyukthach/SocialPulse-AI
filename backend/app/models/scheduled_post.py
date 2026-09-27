import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


VALID_PLATFORMS = {"Instagram", "Twitter/X", "LinkedIn", "Facebook"}
VALID_STATUSES = {"Scheduled", "Published", "Failed", "Cancelled"}


class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)

    # Content
    content = Column(Text, nullable=False)                    # Original content
    optimized_content = Column(Text, nullable=True)           # AI-optimized version (if requested)
    ai_optimized = Column(Integer, default=0)                 # 0 = No, 1 = Yes (SQLite has no bool)

    # Scheduling
    platforms = Column(Text, nullable=False)                  # JSON list, e.g. '["Instagram","Twitter/X"]'
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(String(20), default="Scheduled")          # Scheduled | Published | Failed | Cancelled

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    brand = relationship("Brand", back_populates="scheduled_posts")

    def get_platforms(self) -> list:
        try:
            return json.loads(self.platforms)
        except Exception:
            return []
