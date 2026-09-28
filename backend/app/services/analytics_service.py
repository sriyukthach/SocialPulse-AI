from typing import List, Dict, Any
from app.models.post import Post

def calculate_post_engagement_rate(post: Post) -> float:
    # YouTube Engagement Rate formula: ((Likes + Comments) / Views) * 100
    views = post.shares_count if post.shares_count and post.shares_count > 0 else 0
    if views <= 0:
        return 0.0
    er = ((post.likes + post.comments_count) / float(views)) * 100.0
    return round(er, 2)

def compute_brand_stats(posts: List[Post]) -> Dict[str, Any]:
    if not posts:
        return {
            "total_posts": 0,
            "total_likes": 0,
            "total_comments": 0,
            "total_shares": 0,
            "average_engagement_rate": 0.0,
            "top_performing_format": "N/A"
        }

    total_likes = sum(p.likes for p in posts)
    total_comments = sum(p.comments_count for p in posts)
    total_shares = sum(p.shares_count for p in posts)

    format_scores: Dict[str, List[float]] = {}
    total_er = 0.0

    for p in posts:
        er = calculate_post_engagement_rate(p)
        total_er += er
        if p.format not in format_scores:
            format_scores[p.format] = []
        format_scores[p.format].append(er)

    avg_er = round(total_er / len(posts), 2)

    top_format = "Carousel"
    if format_scores:
        top_format = max(format_scores.keys(), key=lambda f: sum(format_scores[f]) / len(format_scores[f]))

    return {
        "total_posts": len(posts),
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "average_engagement_rate": avg_er,
        "top_performing_format": top_format
    }
