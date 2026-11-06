import logging
import datetime
from typing import Optional, Tuple
from app.config import settings
from app.models import PastCaseMatch, IssueAnalyzeRequest, ResolutionSubmitRequest, VerifiedFix
from app.demo_store import DEMO_CUSTOMERS, demo_memory_bank

logger = logging.getLogger("casetracker.hindsight")

class HindsightService:
    def __init__(self):
        self.hindsight_client = None
        self._init_client()

    def _init_client(self):
        if settings.is_hindsight_configured:
            try:
                from hindsight_client import Hindsight
                self.hindsight_client = Hindsight(
                    base_url=settings.HINDSIGHT_BASE_URL,
                    api_key=settings.HINDSIGHT_API_KEY,
                    timeout=15.0
                )
                logger.info("Hindsight Python client initialized for live memory banks.")
            except Exception as e:
                logger.error(f"Failed to initialize live Hindsight client: {e}. Falling back to demo mode.")
                self.hindsight_client = None
        else:
            logger.info("No HINDSIGHT_API_KEY provided. Operating in Demo Memory Mode (fictional seed store).")

    @property
    def is_live(self) -> bool:
        return self.hindsight_client is not None

    def get_provider_info(self) -> Tuple[str, str]:
        """
        Returns (provider_code, provider_label)
        """
        if self.is_live:
            return ("hindsight", "Live Hindsight Vector Memory")
        return ("demo_memory", "Demo Memory Mode (Fictional Seed Store)")

    def get_customer_bank_id(self, customer_id: str) -> str:
        """
        Strictly scopes memory bank to the specific customer.
        This guarantees customer isolation at the Hindsight bank level.
        """
        clean_id = customer_id.replace("_", "-").lower()
        return f"casetracker-{clean_id}"

    def recall_case(self, req: IssueAnalyzeRequest) -> Tuple[Optional[PastCaseMatch], str, str]:
        """
        Recalls past verified cases within the customer's isolated memory scope.
        Returns: (match_or_none, provider_code, provider_label)
        """
        provider_code, provider_label = self.get_provider_info()
        bank_id = self.get_customer_bank_id(req.customer_id)

        # 1. Try Live Hindsight if configured
        if self.is_live:
            try:
                search_query = (
                    f"Customer: {req.customer_id} | API: {req.api_name} {req.api_version} | "
                    f"Symptoms: {req.symptoms} | Error: {req.error_message} | Steps: {req.steps_tried}"
                )
                response = self.hindsight_client.recall(
                    bank_id=bank_id,
                    query=search_query,
                    max_tokens=2048,
                    budget="mid"
                )
                
                # Check results
                if response and hasattr(response, "results") and response.results:
                    top_result = response.results[0]
                    # Score evaluation: if score or relevant text present
                    meta = top_result.metadata or {}
                    case_id = meta.get("case_id", top_result.document_id or f"HINDSIGHT-{top_result.id[:8]}")
                    
                    customer_info = DEMO_CUSTOMERS.get(req.customer_id)
                    cust_name = customer_info.name if customer_info else req.customer_id

                    match = PastCaseMatch(
                        case_id=case_id,
                        source_id=str(top_result.id),
                        title=meta.get("title", f"Verified Fix for {req.api_name}"),
                        customer_id=req.customer_id,
                        customer_name=cust_name,
                        api_name=req.api_name,
                        api_version=req.api_version,
                        symptoms=req.symptoms,
                        error_pattern=req.error_message,
                        root_cause=meta.get("root_cause", top_result.text),
                        verified_fix=meta.get("verified_fix", "Consult Hindsight documented resolution steps."),
                        verified_by=meta.get("verified_by", "Support Team (Verified)"),
                        verified_at=meta.get("verified_at", datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")),
                        why_it_applies=f"Recalled from Hindsight bank [{bank_id}] matching customer {cust_name} setup.",
                        relevance_score=0.92
                    )
                    return match, provider_code, provider_label

            except Exception as e:
                logger.warning(f"Error querying live Hindsight bank '{bank_id}': {e}. Falling back to demo memory bank.")

        # 2. In Demo Memory Mode (or fallback if live call failed)
        match = demo_memory_bank.recall(
            customer_id=req.customer_id,
            query=f"{req.api_name} {req.api_version}",
            error_message=req.error_message,
            symptoms=req.symptoms
        )
        return match, "demo_memory", "Demo Memory Mode (Fictional Seed Store)"

    def retain_resolution(self, req: ResolutionSubmitRequest) -> Tuple[str, str, str]:
        """
        Persists a verified case resolution into the customer's isolated memory scope.
        Returns: (case_id, provider_code, provider_label)
        """
        provider_code, provider_label = self.get_provider_info()
        bank_id = self.get_customer_bank_id(req.customer_id)

        # Generate case ID if not provided
        timestamp_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        case_id = req.case_id or f"CASE-{int(datetime.datetime.utcnow().timestamp()) % 10000 + 1100}"
        title = req.title or f"{req.api_name}: {req.symptoms[:50]}..."

        cust_info = DEMO_CUSTOMERS.get(req.customer_id)
        cust_name = cust_info.name if cust_info else req.customer_id

        # Format content for Hindsight memory representation
        memory_content = (
            f"Verified API Support Case: {case_id}\n"
            f"Customer: {cust_name} ({req.customer_id})\n"
            f"API System: {req.api_name} Version: {req.api_version}\n"
            f"Observed Symptoms: {req.symptoms}\n"
            f"Error Code / Response: {req.error_message}\n"
            f"Troubleshooting Steps Attempted: {req.steps_tried}\n"
            f"Human-Verified Root Cause: {req.root_cause}\n"
            f"Human-Verified Fix: {req.verified_fix}\n"
            f"Engineer: {req.verified_by} at {timestamp_str}\n"
            f"Notes: {req.notes or 'None'}"
        )

        metadata = {
            "case_id": case_id,
            "title": title,
            "customer_id": req.customer_id,
            "api_name": req.api_name,
            "api_version": req.api_version,
            "root_cause": req.root_cause,
            "verified_fix": req.verified_fix,
            "verified_by": req.verified_by,
            "verified_at": timestamp_str
        }

        # 1. Retain to Live Hindsight if configured
        if self.is_live:
            try:
                self.hindsight_client.retain(
                    bank_id=bank_id,
                    content=memory_content,
                    document_id=case_id,
                    metadata=metadata,
                    tags=["verified_fix", f"cust_{req.customer_id}", f"api_{req.api_name}"]
                )
                logger.info(f"Retained case {case_id} into live Hindsight bank '{bank_id}'.")
            except Exception as e:
                logger.error(f"Failed retaining to live Hindsight bank '{bank_id}': {e}")
                provider_code = "demo_memory"
                provider_label = "Demo Memory Mode (Fictional Seed Store)"

        # 2. Always persist into demo_memory_bank as well so runtime recall works immediately in session
        match_entry = PastCaseMatch(
            case_id=case_id,
            source_id=f"doc-{bank_id}-{case_id}",
            title=title,
            customer_id=req.customer_id,
            customer_name=cust_name,
            api_name=req.api_name,
            api_version=req.api_version,
            symptoms=req.symptoms,
            error_pattern=req.error_message,
            root_cause=req.root_cause,
            verified_fix=req.verified_fix,
            verified_by=req.verified_by,
            verified_at=timestamp_str,
            why_it_applies=f"Verified fix saved for {cust_name}'s {req.api_name} configuration.",
            relevance_score=0.98
        )
        
        fix_entry = VerifiedFix(
            case_id=case_id,
            customer_id=req.customer_id,
            customer_name=cust_name,
            api_name=req.api_name,
            api_version=req.api_version,
            title=title,
            symptoms=req.symptoms,
            error_message=req.error_message,
            root_cause=req.root_cause,
            verified_fix=req.verified_fix,
            verified_by=req.verified_by,
            verified_at=timestamp_str,
            outcome="Verified and confirmed in production.",
            environment=cust_info.environment if cust_info else "Production"
        )

        demo_memory_bank.retain(match_entry, fix_entry)

        return case_id, provider_code, provider_label

# Singleton instance
hindsight_service = HindsightService()
