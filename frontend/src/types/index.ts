export interface Brand {
  id: number;
  name: string;
  slug: string;
  industry: string;
  audience_description: string;
  content_goal: string;
  created_at: string;
}

export interface Post {
  id: number;
  brand_id: number;
  topic: string;
  format: string;
  caption: string;
  likes: number;
  comments_count: number;
  shares_count: number;
  audience_feedback?: string;
  posted_date?: string;
  hindsight_retained: boolean;
  engagement_rate?: number;
  created_at: string;
}

export interface BrandDashboardStats {
  brand: Brand;
  total_posts: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  average_engagement_rate: number;
  top_performing_format: string;
  recent_posts: Post[];
  recent_memories_count: number;
}

export interface RecalledMemoryItem {
  text: string;
  relevance_score?: number;
  type?: string;
  context?: string;
}

export interface EngagementPattern {
  title: string;
  pattern_type: 'positive' | 'negative' | 'neutral' | string;
  observation: string;
  evidence_points: string[];
  learned_insight: string;
}

export interface FormatEfficacy {
  format_name: string;
  performance_rating: 'High' | 'Moderate' | 'Low' | string;
  avg_engagement_rate: number;
  strengths: string[];
  weaknesses: string[];
  audience_reaction_summary: string;
}

export interface RecurringFeedbackTheme {
  theme: string;
  frequency: 'frequent' | 'emerging' | 'occasional' | string;
  sample_quotes: string[];
  audience_pain_point: string;
  hindsight_memory_citation: string;
}

export interface SentimentEvolution {
  overall_sentiment: string;
  sentiment_shift_summary: string;
  key_drivers: string[];
}

export interface ComparativeInsight {
  comparison_title: string;
  analysis: string;
  metrics_comparison: string;
  agent_takeaway: string;
}

export interface ContentRecommendation {
  title: string;
  category: 'Topics to Explore' | 'Formats to Consider' | 'Audience Questions to Answer' | 'What to Avoid' | 'Next Video Idea' | string;
  recommendation: string;
  why: string;
  evidence: string;
}

export interface EngagementAnalysisResponse {
  brand_id: number;
  brand_name: string;
  brand_industry: string;
  analyzed_at: string;
  executive_summary: string;
  engagement_patterns: EngagementPattern[];
  format_performance: FormatEfficacy[];
  recurring_questions: RecurringFeedbackTheme[];
  sentiment_evolution: SentimentEvolution;
  comparative_insights: ComparativeInsight[];
  recommendations?: ContentRecommendation[];
  recalled_memories: RecalledMemoryItem[];
  model_used: string;
  memory_bank_id: string;
}
