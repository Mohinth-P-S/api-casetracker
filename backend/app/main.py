import os
import logging
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
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

# Static file serving: Check backend/app/static first, then fallback to frontend/dist
static_dir = Path(__file__).resolve().parent / "static"
if not (static_dir / "index.html").exists():
    static_dir = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

if static_dir.exists() and (static_dir / "index.html").exists():
    logger.info(f"Serving static assets from {static_dir}")
    assets_dir = static_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/")
    def serve_root():
        return FileResponse(str(static_dir / "index.html"))

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        if full_path.startswith("api"):
            return JSONResponse(status_code=404, content={"detail": f"API endpoint /{full_path} not found"})
        target_file = static_dir / full_path
        if target_file.is_file():
            return FileResponse(str(target_file))
        return FileResponse(str(static_dir / "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
