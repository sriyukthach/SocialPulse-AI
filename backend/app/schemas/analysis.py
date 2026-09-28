from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

class RecalledMemoryItem(BaseModel):
    text: str
    relevance_score: Optional[float] = None
    type: Optional[str] = "world"
    context: Optional[str] = None

class EngagementPattern(BaseModel):
    title: str = Field(..., example="Educational Routine Carousels Drive 4.5x Higher Saves")
    pattern_type: str = Field("positive", example="positive") # positive, negative, neutral
    observation: str = Field(..., example="Carousels detailing multi-step routines generated the highest save rate.")
    evidence_points: List[str] = Field(default_factory=list)
    learned_insight: str = Field(..., example="The audience values practical, actionable steps over promotional announcements.")

class FormatEfficacy(BaseModel):
    format_name: str = Field(..., example="Carousel")
    performance_rating: str = Field(..., example="High") # High, Moderate, Low
    avg_engagement_rate: float = Field(..., example=13.85)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    audience_reaction_summary: str = Field(..., example="Generates heavy bookmarking and specific ingredient questions.")

class RecurringFeedbackTheme(BaseModel):
    theme: str = Field(..., example="Affordable Routine Alternatives")
    frequency: str = Field("frequent", example="frequent") # frequent, emerging, occasional
    sample_quotes: List[str] = Field(default_factory=list)
    audience_pain_point: str = Field(..., example="Users want budget-friendly options under $15-$20.")
    hindsight_memory_citation: str = Field(..., example="Hindsight Memory: Recurring audience questions regarding low-cost alternatives.")

class SentimentEvolution(BaseModel):
    overall_sentiment: str = Field(..., example="Predominantly Positive & Curious")
    sentiment_shift_summary: str = Field(..., example="Audience sentiment transitioned from skeptical on direct sales to highly engaged on education.")
    key_drivers: List[str] = Field(default_factory=list)

class ComparativeInsight(BaseModel):
    comparison_title: str = Field(..., example="Educational Guides vs. Direct Promo Posts")
    analysis: str = Field(..., example="Educational posts outperform promotional discounts by 6.5x in total engagement.")
    metrics_comparison: str = Field(..., example="620 likes & 185 shares (Carousel) vs. 95 likes & 4 shares (Static Image)")
    agent_takeaway: str = Field(..., example="Audience reacts negatively to direct sales flyers but actively engages with step-by-step guides.")

class ContentRecommendation(BaseModel):
    title: str = Field(..., example="Create battery drain test comparisons")
    category: str = Field("Topics to Explore", example="Topics to Explore") # Topics to Explore, Formats to Consider, Audience Questions to Answer, What to Avoid, Next Video Idea
    recommendation: str = Field(..., example="Produce side-by-side battery drain tests across competing models.")
    why: str = Field(..., example="Viewers repeatedly ask about battery degradation in comment threads.")
    evidence: str = Field(..., example="3 out of 10 analyzed uploads covering thermal/battery topics outperformed channel avg ER by 40%.")

class EngagementAnalysisResponse(BaseModel):
    brand_id: int
    brand_name: str
    brand_industry: str
    analyzed_at: datetime
    executive_summary: str
    engagement_patterns: List[EngagementPattern]
    format_performance: List[FormatEfficacy]
    recurring_questions: List[RecurringFeedbackTheme]
    sentiment_evolution: SentimentEvolution
    comparative_insights: List[ComparativeInsight]
    recommendations: List[ContentRecommendation] = Field(default_factory=list)
    recalled_memories: List[RecalledMemoryItem]
    model_used: str
    memory_bank_id: str

class AnalysisRequest(BaseModel):
    brand_id: int
    focus_query: Optional[str] = Field(None, example="Evaluate audience sentiment on recent posts")
