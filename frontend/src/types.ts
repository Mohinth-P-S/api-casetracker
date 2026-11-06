export interface IncidentEvent {
  date: string;
  case_id: string;
  title: string;
  severity: string;
  status: string;
  summary: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  industry: string;
  api_name: string;
  api_version: string;
  auth_type: string;
  auth_summary: string;
  environment: string;
  webhook_url: string;
  base_url: string;
  config_summary: Record<string, any>;
  incident_timeline: IncidentEvent[];
}

export interface PastCaseMatch {
  case_id: string;
  source_id: string;
  title: string;
  customer_id: string;
  customer_name: string;
  api_name: string;
  api_version: string;
  symptoms: string;
  error_pattern: string;
  root_cause: string;
  verified_fix: string;
  verified_by: string;
  verified_at: string;
  why_it_applies: string;
  relevance_score: number;
}

export interface IssueAnalyzeRequest {
  customer_id: string;
  api_name: string;
  api_version: string;
  symptoms: string;
  error_message: string;
  steps_tried?: string;
  endpoint?: string;
  http_status?: number;
}

export interface IssueAnalyzeResponse {
  status: 'match_found' | 'needs_investigation';
  needs_investigation: boolean;
  query_summary: string;
  customer_id: string;
  customer_name: string;
  match: PastCaseMatch | null;
  suggested_action: string;
  customer_context: Record<string, any>;
  memory_provider: 'hindsight' | 'demo_memory';
  memory_provider_label: string;
  memory_scope: string;
  explanation: string;
  created_at: string;
}

export interface ResolutionSubmitRequest {
  customer_id: string;
  api_name: string;
  api_version: string;
  symptoms: string;
  error_message: string;
  steps_tried: string;
  root_cause: string;
  verified_fix: string;
  verified_by: string;
  case_id?: string;
  title?: string;
  notes?: string;
}

export interface ResolutionSubmitResponse {
  success: boolean;
  case_id: string;
  customer_id: string;
  memory_scope: string;
  memory_provider: string;
  memory_provider_label: string;
  message: string;
  timestamp: string;
}

export interface FrequentProblem {
  id: string;
  title: string;
  category: string;
  occurrences: number;
  affected_customers: string[];
  common_symptoms: string;
  common_root_cause: string;
  recommended_fix: string;
  severity: string;
}

export interface VerifiedFix {
  case_id: string;
  customer_id: string;
  customer_name: string;
  api_name: string;
  api_version: string;
  title: string;
  symptoms: string;
  error_message: string;
  root_cause: string;
  verified_fix: string;
  verified_by: string;
  verified_at: string;
  outcome: string;
  environment: string;
}

export interface DashboardStats {
  total_verified_fixes: number;
  memory_recall_hit_rate: string;
  active_customer_scopes: number;
  avg_investigation_time_saved: string;
  recent_cases: {
    case_id: string;
    title: string;
    customer_name: string;
    api_name: string;
    verified_by: string;
    verified_at: string;
    status: string;
  }[];
  monthly_trend: {
    month: string;
    cases_analyzed: number;
    memory_recalls: number;
    avg_resolution_mins: number;
  }[];
  system_status: {
    status: string;
    memory_provider: string;
    memory_provider_label: string;
    hindsight_connected: boolean;
    isolated_banks_count: number;
  };
}
