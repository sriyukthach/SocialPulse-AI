from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models.brand import Brand
from app.schemas.analysis import RecalledMemoryItem
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/memories", tags=["Memories"])

class RetainInsightRequest(BaseModel):
    brand_id: int
    insight_text: str
    context: Optional[str] = "Manual audience feedback entry"

class ReflectRequest(BaseModel):
    brand_id: int
    query: str

@router.get("/{brand_id}", response_model=List[RecalledMemoryItem])
def get_brand_memories(
    brand_id: int,
    query: str = Query("audience preferences feedback formats engagement topics", description="Search query for memory recall"),
    db: Session = Depends(get_db)
):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    raw_memories = hindsight_service.recall_memories(
        brand_slug=brand.slug,
        query=query,
        max_tokens=4096
    )

    return [
        RecalledMemoryItem(
            text=m.get("text", ""),
            relevance_score=m.get("relevance_score"),
            type=m.get("type", "world"),
            context=m.get("context")
        )
        for m in raw_memories
    ]

@router.post("/retain")
def retain_manual_insight(req: RetainInsightRequest, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == req.brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    res = hindsight_service.client.retain(
        bank_id=brand.slug,
        content=req.insight_text,
        context=req.context
    )
    return {"success": True, "bank_id": brand.slug, "response": str(res)}

@router.post("/reflect")
def reflect_on_memories(req: ReflectRequest, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == req.brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    reflection = hindsight_service.reflect(
        brand_slug=brand.slug,
        query=req.query
    )
    return {"bank_id": brand.slug, "reflection": reflection or "No reflection synthesized."}
