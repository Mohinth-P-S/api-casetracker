import datetime
from fastapi import APIRouter, HTTPException
from app.models import IssueAnalyzeRequest, IssueAnalyzeResponse
from app.hindsight_service import hindsight_service
from app.demo_store import DEMO_CUSTOMERS

router = APIRouter(prefix="/api/issues", tags=["Issues & Analysis"])

@router.post("/analyze", response_model=IssueAnalyzeResponse)
def analyze_issue(req: IssueAnalyzeRequest):
    """
    Search Hindsight for relevant cases strictly within the customer's isolated memory scope.
    If a past verified case applies, returns the suggestion for engineer review.
    If no reliable match exists, returns 'needs_investigation' without hallucinating a fix.
    """
    # Verify customer exists in customer registry
    cust_info = DEMO_CUSTOMERS.get(req.customer_id)
    cust_name = cust_info.name if cust_info else req.customer_id

    # Isolated memory scope
    bank_id = hindsight_service.get_customer_bank_id(req.customer_id)

    # Perform scoped memory recall
    match, provider_code, provider_label = hindsight_service.recall_case(req)

    now_iso = datetime.datetime.utcnow().isoformat() + "Z"

    if match:
        return IssueAnalyzeResponse(
            status="match_found",
            needs_investigation=False,
            query_summary=f"Recalled verified precedent from memory bank [{bank_id}] for {req.api_name} {req.api_version}",
            customer_id=req.customer_id,
            customer_name=cust_name,
            match=match,
            suggested_action="Review verified fix proposal below before applying changes to client configuration.",
            customer_context={
                "customer_name": cust_name,
                "api_name": req.api_name,
                "api_version": req.api_version,
                "auth_type": cust_info.auth_type if cust_info else "Custom Auth",
                "environment": cust_info.environment if cust_info else "Production",
                "memory_bank": bank_id
            },
            memory_provider=provider_code,
            memory_provider_label=provider_label,
            memory_scope=bank_id,
            explanation=f"Memory matched Case {match.case_id} ({match.title}) with relevance {match.relevance_score}. Fix verified by {match.verified_by}.",
            created_at=now_iso
        )
    else:
        return IssueAnalyzeResponse(
            status="needs_investigation",
            needs_investigation=True,
            query_summary=f"No verified precedent found in customer memory bank [{bank_id}] for this failure mode.",
            customer_id=req.customer_id,
            customer_name=cust_name,
            match=None,
            suggested_action="Assign to support engineer for manual diagnostic runbook execution. Do not apply unverified remedies.",
            customer_context={
                "customer_name": cust_name,
                "api_name": req.api_name,
                "api_version": req.api_version,
                "auth_type": cust_info.auth_type if cust_info else "Custom Auth",
                "environment": cust_info.environment if cust_info else "Production",
                "memory_bank": bank_id
            },
            memory_provider=provider_code,
            memory_provider_label=provider_label,
            memory_scope=bank_id,
            explanation="Hindsight memory bank contained no reliable verified resolutions matching these exact symptoms and configuration. A human-verified diagnosis and fix is required.",
            created_at=now_iso
        )
