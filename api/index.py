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
    Ensures static assets (/assets/..., favicon, icons) are served statically,
    and API calls (/api/...) are routed to their respective API router endpoints.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            raw_qs = scope.get("query_string", b"").decode("utf-8")
            qs = parse_qs(raw_qs)
            
            if "path" in qs and qs["path"]:
                raw_subpath = qs["path"][0]
                subpath = raw_subpath.lstrip("/")

                # 1. Static files: assets, svg, js, css, png, ico
                if (subpath.startswith("assets/") or 
                    subpath.endswith(".svg") or 
                    subpath.endswith(".js") or 
                    subpath.endswith(".css") or 
                    subpath.endswith(".png") or 
                    subpath.endswith(".ico")):
                    scope["path"] = f"/{subpath}"
                # 2. API endpoints: prefix with /api if not already prefixed
                elif (subpath.startswith("api/") or 
                      subpath in ["health", "customers", "problems", "dashboard", "verified-fixes", "issues"] or
                      subpath.startswith("issues/") or
                      subpath.startswith("customers/") or
                      subpath.startswith("problems/") or
                      subpath.startswith("verified-fixes")):
                    clean_api = subpath[4:] if subpath.startswith("api/") else subpath
                    scope["path"] = f"/api/{clean_api}"
                else:
                    # Frontend SPA route (e.g. /dashboard, /troubleshooting)
                    scope["path"] = f"/{subpath}"

                del qs["path"]
                scope["query_string"] = urlencode(qs, doseq=True).encode("utf-8")
            elif scope.get("path") in ["/api/index.py", "/api"]:
                scope["path"] = "/api"

        await self.app(scope, receive, send)

# Export the wrapped application
app = VercelPathMiddleware(fastapi_app)
