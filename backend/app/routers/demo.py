from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.brand import Brand
from app.models.post import Post
from app.services.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/demo", tags=["Demo"])

@router.post("/seed")
def seed_demo_data(db: Session = Depends(get_db)):
    """
    Seeds both GlowNest Skincare and Zara Clothes brands with historical posts
    and retains their memories into distinct Hindsight persistent memory banks.
    """
    # 1. GlowNest Skincare
    glownest = db.query(Brand).filter(Brand.slug == "glownest").first()
    if not glownest:
        glownest = Brand(
            name="GlowNest Skincare",
            slug="glownest",
            industry="Skincare & Beauty",
            audience_description="Young adults (18-30) dealing with oily, acne-prone skin looking for affordable, science-backed routines.",
            content_goal="Maximize audience engagement, build trust through educational saves/shares, and avoid generic sales posts."
        )
        db.add(glownest)
        db.commit()
        db.refresh(glownest)

    # Check posts for GlowNest
    if db.query(Post).filter(Post.brand_id == glownest.id).count() == 0:
        glownest_posts = [
            {
                "topic": "5-Step Morning Skincare Routine for Oily & Acne-Prone Skin",
                "format": "Carousel",
                "caption": "Midday shine ruining your day? ✨ Here is our lightweight 5-step morning routine that balances oil without stripping your natural barrier! Save this for your morning routine. #OilySkinHacks #SkincareCommunity",
                "likes": 620,
                "comments_count": 105,
                "shares_count": 185,
                "audience_feedback": "Audience frequently commented: 'Can you recommend budget-friendly oily skin cleansers under $15?', 'Does oily skin still need hyaluronic acid?', 'Saved this!'",
                "posted_date": "2026-09-18"
            },
            {
                "topic": "Flash Sale - 20% Off All GlowNest Moisturizers This Weekend",
                "format": "Static Image",
                "caption": "Limited time offer! Get 20% off our entire hydration lineup using code GLOW20 at checkout. Don't miss out! 🛍️",
                "likes": 95,
                "comments_count": 12,
                "shares_count": 4,
                "audience_feedback": "Low engagement. Audience feedback notes: 'Feels like standard promo ads', 'Prefer routine tips and educational content rather than direct discounts'.",
                "posted_date": "2026-09-21"
            },
            {
                "topic": "Are You Making This Common Cleanser Mistake?",
                "format": "Video Reel",
                "caption": "Rinsing with hot water? Washing for only 10 seconds? Here are 3 cleanser mistakes making your oily skin worse! 🫧 #SkincareEducation",
                "likes": 840,
                "comments_count": 142,
                "shares_count": 310,
                "audience_feedback": "Viral response. Comments: 'Mind blown! Double cleansing fixed my blackheads', 'Please do a reel on Niacinamide layering next!'.",
                "posted_date": "2026-09-24"
            }
        ]
        for p_data in glownest_posts:
            post = Post(brand_id=glownest.id, **p_data)
            db.add(post)
            db.commit()
            db.refresh(post)
            try:
                hindsight_service.retain_post(glownest.slug, p_data)
                post.hindsight_retained = True
                db.commit()
            except Exception:
                pass

    # 2. Zara Clothes / Fashion Brand
    zara = db.query(Brand).filter(Brand.slug == "zara").first()
    if not zara:
        zara = Brand(
            name="Zara Clothes",
            slug="zara",
            industry="Fashion & Apparel",
            audience_description="Trend-conscious young adults (18-35) looking for minimalist streetwear, seasonal capsule wardrobes, and versatile styling inspo.",
            content_goal="Drive high save-rates and shares through dynamic outfit transition reels and aesthetic capsule lookbooks."
        )
        db.add(zara)
        db.commit()
        db.refresh(zara)

    # Check posts for Zara
    if db.query(Post).filter(Post.brand_id == zara.id).count() == 0:
        zara_posts = [
            {
                "topic": "Autumn Minimalist Capsule Wardrobe: 5 Essentials, 10 Outfits",
                "format": "Carousel",
                "caption": "Elevate your daily fits without overbuying ✨ Here is our 5-piece minimalist autumn capsule guide. Which look are you wearing this week? #ZaraFashion #OutfitInspo",
                "likes": 1150,
                "comments_count": 195,
                "shares_count": 480,
                "audience_feedback": "High engagement. Top comments: 'Where are the wide-leg tailored trousers from?', 'Need product codes for slides 2 and 4!'.",
                "posted_date": "2026-09-19"
            },
            {
                "topic": "3 Ways to Style an Oversized Trench Coat This Season",
                "format": "Video Reel",
                "caption": "From coffee run casual to sleek evening chic 🔥 3 effortless silhouettes to rock your trench coat all autumn long! #StyleTransitions",
                "likes": 1420,
                "comments_count": 260,
                "shares_count": 610,
                "audience_feedback": "Viral response. Comments: 'Obsessed with outfit #2! What shoes did you pair with this?', 'Please do styling tips for petite heights next!'.",
                "posted_date": "2026-09-22"
            },
            {
                "topic": "Mid-Season Sale: Up to 40% Off Selected Racks",
                "format": "Static Image",
                "caption": "Mid-season sale is now live online and in stores. Shop limited stock before it's gone! 🏷️",
                "likes": 210,
                "comments_count": 28,
                "shares_count": 14,
                "audience_feedback": "Low engagement. Comments: 'Store sizes ran out instantly', 'Prefer video styling lookbooks over static discount flyers'.",
                "posted_date": "2026-09-25"
            }
        ]
        for p_data in zara_posts:
            post = Post(brand_id=zara.id, **p_data)
            db.add(post)
            db.commit()
            db.refresh(post)
            try:
                hindsight_service.retain_post(zara.slug, p_data)
                post.hindsight_retained = True
                db.commit()
            except Exception:
                pass

    return {
        "success": True,
        "message": "GlowNest Skincare and Zara Clothes seeded & retained in Hindsight!",
        "brands": [
            {"id": glownest.id, "name": glownest.name, "slug": glownest.slug},
            {"id": zara.id, "name": zara.name, "slug": zara.slug}
        ]
    }
