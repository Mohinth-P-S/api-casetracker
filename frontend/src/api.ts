import type {
  CustomerProfile,
  IssueAnalyzeRequest,
  IssueAnalyzeResponse,
  ResolutionSubmitRequest,
  ResolutionSubmitResponse,
  FrequentProblem,
  VerifiedFix,
  DashboardStats
} from './types';

const API_BASE = '/api';

export const api = {
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  async getCustomers(): Promise<CustomerProfile[]> {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },

  async getCustomer(id: string): Promise<CustomerProfile> {
    const res = await fetch(`${API_BASE}/customers/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch customer ${id}`);
    return res.json();
  },

  async analyzeIssue(payload: IssueAnalyzeRequest): Promise<IssueAnalyzeResponse> {
    const res = await fetch(`${API_BASE}/issues/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze issue');
    }
    return res.json();
  },

  async submitResolution(issueId: string, payload: ResolutionSubmitRequest): Promise<ResolutionSubmitResponse> {
    const res = await fetch(`${API_BASE}/issues/${issueId}/resolution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to save resolution');
    }
    return res.json();
  },

  async getProblems(category?: string): Promise<FrequentProblem[]> {
    const url = category && category !== 'All' 
      ? `${API_BASE}/problems?category=${encodeURIComponent(category)}`
      : `${API_BASE}/problems`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch frequent problems');
    return res.json();
  },

  async getProblem(id: string): Promise<FrequentProblem> {
    const res = await fetch(`${API_BASE}/problems/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch problem ${id}`);
    return res.json();
  },

  async getVerifiedFixes(query?: string, customerId?: string): Promise<VerifiedFix[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (customerId && customerId !== 'All') params.append('customer_id', customerId);
    const url = `${API_BASE}/verified-fixes?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch verified fixes');
    return res.json();
  },

  async getDashboard(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard telemetry');
    return res.json();
  }
};
