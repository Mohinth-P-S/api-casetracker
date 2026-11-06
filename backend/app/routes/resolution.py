import datetime
from fastapi import APIRouter, HTTPException, Path
from typing import Optional
from app.models import ResolutionSubmitRequest, ResolutionSubmitResponse
from app.hindsight_service import hindsight_service

router = APIRouter(prefix="/api/issues", tags=["Issues & Analysis"])

@router.post("/{issue_id}/resolution", response_model=ResolutionSubmitResponse)
def submit_resolution_with_id(
    issue_id: str = Path(..., description="Target issue ID or case identifier"),
    req: ResolutionSubmitRequest = ...
):
    """
    Save a human-confirmed root cause and resolution to Hindsight memory.
    The memory becomes persistent in the customer's isolated memory bank.
    """
    # ensure case_id aligns with issue_id if not explicitly provided
    if not req.case_id:
        req.case_id = issue_id

    case_id, provider_code, provider_label = hindsight_service.retain_resolution(req)
    bank_id = hindsight_service.get_customer_bank_id(req.customer_id)

    return ResolutionSubmitResponse(
        success=True,
        case_id=case_id,
        customer_id=req.customer_id,
        memory_scope=bank_id,
        memory_provider=provider_code,
        memory_provider_label=provider_label,
        message=f"Case {case_id} human-verified resolution successfully retained into Hindsight memory bank [{bank_id}].",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z"
    )

@router.post("/resolution", response_model=ResolutionSubmitResponse)
def submit_resolution_general(req: ResolutionSubmitRequest):
    """
    Alternative route for submitting resolution without an issue_id in the URL path.
    """
    case_id, provider_code, provider_label = hindsight_service.retain_resolution(req)
    bank_id = hindsight_service.get_customer_bank_id(req.customer_id)

    return ResolutionSubmitResponse(
        success=True,
        case_id=case_id,
        customer_id=req.customer_id,
        memory_scope=bank_id,
        memory_provider=provider_code,
        memory_provider_label=provider_label,
        message=f"Case {case_id} human-verified resolution successfully retained into Hindsight memory bank [{bank_id}].",
        timestamp=datetime.datetime.utcnow().isoformat() + "Z"
    )
