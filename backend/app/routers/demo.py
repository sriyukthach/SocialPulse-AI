from fastapi import APIRouter

router = APIRouter(prefix="/api/demo", tags=["Demo"])

@router.post("/seed")
def seed_demo_data():
    """
    Auto-seeding is disabled in production to ensure a clean empty-state user experience
    driven strictly by user-entered YouTube Channel URLs.
    """
    return {
        "success": True,
        "message": "Demo auto-seeding is disabled for clean YouTube URL input flow.",
        "brands": []
    }
