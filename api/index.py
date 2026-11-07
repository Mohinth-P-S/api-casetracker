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
            qs = parse_qs(raw_qs, keep_blank_values=True)
            
            # Check for path parameter from Vercel rewrite
            if "path" in qs:
                raw_subpath = qs["path"][0] if qs["path"] else ""
                subpath = raw_subpath.lstrip("/")

                # Reconstruct full path
                if not subpath or subpath == "index.html":
                    scope["path"] = "/"
                elif subpath == "api" or subpath == "api/":
                    scope["path"] = "/api"
                else:
                    scope["path"] = f"/{subpath}"

                # Clean up query string so FastAPI routers don't see injected 'path' param
                del qs["path"]
                scope["query_string"] = urlencode(qs, doseq=True).encode("utf-8")
                
            elif scope.get("path") in ["/api/index.py", "/api/index", "/api/"]:
                scope["path"] = "/"

        await self.app(scope, receive, send)

# Export the wrapped application
app = VercelPathMiddleware(fastapi_app)
