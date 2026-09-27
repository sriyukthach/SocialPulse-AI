from typing import List, Dict, Any
from app.models.post import Post

def calculate_post_engagement_rate(post: Post) -> float:
    # Benchmark engagement index: (Likes + Comments*2 + Shares*3) / 100
    score = post.likes + (post.comments_count * 2) + (post.shares_count * 3)
    return round(score / 100.0, 2)

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
