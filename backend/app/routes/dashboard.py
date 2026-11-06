from fastapi import APIRouter
from app.models import DashboardStats
from app.demo_store import DEMO_CUSTOMERS, demo_memory_bank
from app.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardStats)
def get_dashboard_summary():
    """
    Returns high-level figures, trend telemetry, and recent cases for the dashboard.
    """
    provider_code, provider_label = hindsight_service.get_provider_info()
    verified_fixes = demo_memory_bank.verified_catalog

    recent_cases = []
    for f in verified_fixes[:5]:
        recent_cases.append({
            "case_id": f.case_id,
            "title": f.title,
            "customer_name": f.customer_name,
            "api_name": f.api_name,
            "verified_by": f.verified_by,
            "verified_at": f.verified_at,
            "status": "Verified Fix"
        })

    monthly_trend = [
        {"month": "May", "cases_analyzed": 19, "memory_recalls": 11, "avg_resolution_mins": 38},
        {"month": "Jun", "cases_analyzed": 24, "memory_recalls": 16, "avg_resolution_mins": 29},
        {"month": "Jul", "cases_analyzed": 31, "memory_recalls": 23, "avg_resolution_mins": 22},
        {"month": "Aug", "cases_analyzed": 28, "memory_recalls": 22, "avg_resolution_mins": 18},
        {"month": "Sep", "cases_analyzed": 37, "memory_recalls": 31, "avg_resolution_mins": 14},
        {"month": "Oct", "cases_analyzed": 44, "memory_recalls": 39, "avg_resolution_mins": 11},
    ]

    return DashboardStats(
        total_verified_fixes=len(verified_fixes),
        memory_recall_hit_rate="88.6%",
        active_customer_scopes=len(DEMO_CUSTOMERS),
        avg_investigation_time_saved="4.2 hours / case",
        recent_cases=recent_cases,
        monthly_trend=monthly_trend,
        system_status={
            "status": "Operational",
            "memory_provider": provider_code,
            "memory_provider_label": provider_label,
            "hindsight_connected": hindsight_service.is_live,
            "isolated_banks_count": len(DEMO_CUSTOMERS)
        }
    )
