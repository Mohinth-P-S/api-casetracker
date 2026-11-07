import os
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlencode

os.environ["VERCEL"] = "1"

root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir / "backend"))

from app.main import app as fastapi_app

class VercelPathMiddleware:
    """
    Translates Vercel's rewrite query parameter `path` back into FastAPI's `scope['path']`.
    Ensures:
      - Static assets (/assets/..., favicon.svg, icons.svg) -> /assets/...
      - API routes (/api/...) -> /api/...
      - SPA routes (/, /dashboard, /troubleshooting) -> /...
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            raw_qs = scope.get("query_string", b"").decode("utf-8")
            qs = parse_qs(raw_qs)
            
            # Check for path parameter from Vercel rewrite
            if "path" in qs and qs["path"]:
                raw_subpath = qs["path"][0]
                subpath = raw_subpath.lstrip("/")

                # Reconstruct full path
                if not subpath:
                    scope["path"] = "/"
                elif subpath.startswith("assets/") or subpath.startswith("api/"):
                    scope["path"] = f"/{subpath}"
                elif subpath in ["favicon.svg", "icons.svg", "index.html"]:
                    scope["path"] = f"/{subpath}"
                elif (subpath.startswith("health") or 
                      subpath.startswith("customers") or 
                      subpath.startswith("problems") or 
                      subpath.startswith("dashboard") or 
                      subpath.startswith("verified-fixes") or 
                      subpath.startswith("issues")):
                    scope["path"] = f"/api/{subpath}"
                else:
                    scope["path"] = f"/{subpath}"

                # Clean up query string so FastAPI routers don't see injected 'path' param
                del qs["path"]
                scope["query_string"] = urlencode(qs, doseq=True).encode("utf-8")
                
            elif scope.get("path") in ["/api/index.py", "/api/index", "/api/"]:
                scope["path"] = "/api"

        await self.app(scope, receive, send)

# Export the wrapped application
app = VercelPathMiddleware(fastapi_app)
