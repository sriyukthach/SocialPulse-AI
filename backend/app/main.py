import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import brands, posts, memories, analysis, demo
from app.routers.demo import seed_demo_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("socialpulse")

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SocialPulse AI Backend",
    description="Memory-Powered Social Media Engagement Intelligence Agent with Hindsight Persistent Memory",
    version="2.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(brands.router)
app.include_router(posts.router)
app.include_router(memories.router)
app.include_router(analysis.router)
app.include_router(demo.router)

@app.on_event("startup")
def on_startup():
    logger.info("SocialPulse AI backend starting up...")
    db = SessionLocal()
    try:
        # Seed initial demo brands if not present
        seed_demo_data(db)
        logger.info("Demo dataset verified on startup.")
    except Exception as e:
        logger.warning(f"Startup seeding notice: {e}")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "project": "SocialPulse AI",
        "description": "Memory-Powered Social Media Engagement Intelligence Agent (Hindsight + Gemini)",
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "hindsight_configured": bool(settings.HINDSIGHT_API_KEY),
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "database": "sqlite_connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
