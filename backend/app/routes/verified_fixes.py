from typing import List, Optional
from fastapi import APIRouter, Query
from app.models import VerifiedFix
from app.demo_store import demo_memory_bank

router = APIRouter(prefix="/api/verified-fixes", tags=["Verified Fixes"])

@router.get("", response_model=List[VerifiedFix])
def list_verified_fixes(
    q: Optional[str] = Query(None, description="Search term across symptoms, title, root cause, or fix"),
    customer_id: Optional[str] = Query(None, description="Filter by customer ID")
):
    """
    Searchable, filterable catalog of human-verified fixes and post-mortem outcomes.
    """
    results = demo_memory_bank.verified_catalog

    if customer_id and customer_id.lower() != "all":
        results = [f for f in results if f.customer_id == customer_id]

    if q:
        q_clean = q.lower().strip()
        filtered = []
        for f in results:
            text = f"{f.case_id} {f.title} {f.customer_name} {f.api_name} {f.symptoms} {f.root_cause} {f.verified_fix} {f.outcome}".lower()
            if q_clean in text:
                filtered.append(f)
        return filtered

    return results
