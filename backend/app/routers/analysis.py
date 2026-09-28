import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.brand import Brand
from app.models.post import Post, AnalysisLog
from app.schemas.analysis import AnalysisRequest, EngagementAnalysisResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/analysis", tags=["Engagement Analysis"])

@router.post("/generate", response_model=EngagementAnalysisResponse)
def generate_engagement_analysis(req: AnalysisRequest, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == req.brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    posts = db.query(Post).filter(Post.brand_id == req.brand_id).order_by(Post.created_at.desc()).all()

    result = gemini_service.generate_engagement_analysis(
        brand=brand,
        posts=posts,
        focus_query=req.focus_query
    )

    # Save to history log
    log = AnalysisLog(
        brand_id=brand.id,
        analysis_json=json.dumps({
            "executive_summary": result["executive_summary"],
            "engagement_patterns": [p.model_dump() for p in result["engagement_patterns"]],
            "format_performance": [f.model_dump() for f in result["format_performance"]],
            "recurring_questions": [q.model_dump() for q in result["recurring_questions"]],
            "sentiment_evolution": result["sentiment_evolution"].model_dump(),
            "comparative_insights": [c.model_dump() for c in result["comparative_insights"]],
            "recommendations": [r.model_dump() for r in result.get("recommendations", [])]
        }),
        recalled_memories_json=json.dumps([mem.model_dump() for mem in result["recalled_memories"]])
    )
    db.add(log)
    db.commit()

    return EngagementAnalysisResponse(
        brand_id=brand.id,
        brand_name=brand.name,
        brand_industry=brand.industry,
        analyzed_at=datetime.utcnow(),
        executive_summary=result["executive_summary"],
        engagement_patterns=result["engagement_patterns"],
        format_performance=result["format_performance"],
        recurring_questions=result["recurring_questions"],
        sentiment_evolution=result["sentiment_evolution"],
        comparative_insights=result["comparative_insights"],
        recommendations=result.get("recommendations", []),
        recalled_memories=result["recalled_memories"],
        model_used=result["model_used"],
        memory_bank_id=brand.slug
    )
