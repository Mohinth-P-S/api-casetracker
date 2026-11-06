from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class IncidentEvent(BaseModel):
    date: str
    case_id: str
    title: str
    severity: str
    status: str
    summary: str

class CustomerProfile(BaseModel):
    id: str
    name: str
    industry: str
    api_name: str
    api_version: str
    auth_type: str
    auth_summary: str
    environment: str
    webhook_url: str
    base_url: str
    config_summary: Dict[str, Any]
    incident_timeline: List[IncidentEvent]

class IssueAnalyzeRequest(BaseModel):
    customer_id: str = Field(..., description="Customer unique ID (e.g. cust_apex_retail)")
    api_name: str = Field(..., description="API or system name")
    api_version: str = Field(..., description="Customer specific API version")
    symptoms: str = Field(..., description="Observed symptoms or failure behavior")
    error_message: str = Field(..., description="Exact or partial error code / response")
    steps_tried: str = Field(default="", description="Troubleshooting steps already attempted")
    endpoint: Optional[str] = Field(default="", description="Target API endpoint")
    http_status: Optional[int] = Field(default=None, description="HTTP status code")

class PastCaseMatch(BaseModel):
    case_id: str
    source_id: str
    title: str
    customer_id: str
    customer_name: str
    api_name: str
    api_version: str
    symptoms: str
    error_pattern: str
    root_cause: str
    verified_fix: str
    verified_by: str
    verified_at: str
    why_it_applies: str
    relevance_score: float

class IssueAnalyzeResponse(BaseModel):
    status: str  # "match_found" | "needs_investigation"
    needs_investigation: bool
    query_summary: str
    customer_id: str
    customer_name: str
    match: Optional[PastCaseMatch] = None
    suggested_action: str
    customer_context: Dict[str, Any]
    memory_provider: str  # "hindsight" | "demo_memory"
    memory_provider_label: str
    memory_scope: str
    explanation: str
    created_at: str

class ResolutionSubmitRequest(BaseModel):
    customer_id: str
    api_name: str
    api_version: str
    symptoms: str
    error_message: str
    steps_tried: str
    root_cause: str
    verified_fix: str
    verified_by: str
    case_id: Optional[str] = None
    title: Optional[str] = None
    notes: Optional[str] = None

class ResolutionSubmitResponse(BaseModel):
    success: bool
    case_id: str
    customer_id: str
    memory_scope: str
    memory_provider: str
    memory_provider_label: str
    message: str
    timestamp: str

class FrequentProblem(BaseModel):
    id: str
    title: str
    category: str
    occurrences: int
    affected_customers: List[str]
    common_symptoms: str
    common_root_cause: str
    recommended_fix: str
    severity: str  # Critical, High, Medium, Low

class VerifiedFix(BaseModel):
    case_id: str
    customer_id: str
    customer_name: str
    api_name: str
    api_version: str
    title: str
    symptoms: str
    error_message: str
    root_cause: str
    verified_fix: str
    verified_by: str
    verified_at: str
    outcome: str
    environment: str

class DashboardStats(BaseModel):
    total_verified_fixes: int
    memory_recall_hit_rate: str
    active_customer_scopes: int
    avg_investigation_time_saved: str
    recent_cases: List[Dict[str, Any]]
    monthly_trend: List[Dict[str, Any]]
    system_status: Dict[str, Any]
