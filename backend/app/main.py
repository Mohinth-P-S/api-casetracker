import os
import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.routes import analyze, resolution, customers, problems, verified_fixes, dashboard
from app.hindsight_service import hindsight_service

# Configure logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("casetracker")

app = FastAPI(
    title="API CaseTracker Service",
    description="Customer-scoped API integration memory using Hindsight persistent memory layer.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(analyze.router)
app.include_router(resolution.router)
app.include_router(customers.router)
app.include_router(problems.router)
app.include_router(verified_fixes.router)
app.include_router(dashboard.router)

@app.get("/api")
def api_root():
    provider_code, provider_label = hindsight_service.get_provider_info()
    return {
        "service": "API CaseTracker",
        "description": "Support that remembers every API fix.",
        "docs_url": "/docs",
        "hindsight_connected": hindsight_service.is_live,
        "memory_provider": provider_code,
        "memory_provider_label": provider_label,
        "isolation": "Strict per-customer memory bank scoping"
    }

@app.get("/api/health")
def health():
    provider_code, provider_label = hindsight_service.get_provider_info()
    return {
        "status": "healthy",
        "hindsight_connected": hindsight_service.is_live,
        "hindsight_base_url": settings.HINDSIGHT_BASE_URL,
        "memory_provider": provider_code,
        "memory_provider_label": provider_label,
        "demo_mode": not hindsight_service.is_live
    }

# Mount static frontend build if present
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    logger.info(f"Serving production frontend from {frontend_dist}")
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        # Do not intercept API routes
        if full_path.startswith("api"):
            return {"detail": "Not Found"}
        target_file = frontend_dist / full_path
        if target_file.is_file():
            return FileResponse(str(target_file))
        return FileResponse(str(frontend_dist / "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
