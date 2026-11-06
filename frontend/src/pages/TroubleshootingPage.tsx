import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ShieldCheck, 
  Terminal, 
  RotateCcw, 
  Save, 
  Copy, 
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  UserCheck
} from 'lucide-react';
import { api } from '../api';
import { 
  CustomerProfile, 
  IssueAnalyzeRequest, 
  IssueAnalyzeResponse, 
  ResolutionSubmitRequest 
} from '../types';

interface TroubleshootingPageProps {
  initialFlow?: 'flow1a' | 'flow1b' | 'flow2' | null;
  onClearFlow?: () => void;
}

export const TroubleshootingPage: React.FC<TroubleshootingPageProps> = ({ 
  initialFlow, 
  onClearFlow 
}) => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust_apex_retail');
  const [apiName, setApiName] = useState<string>('Orders & Webhooks Sync API');
  const [apiVersion, setApiVersion] = useState<string>('v2.4');
  const [symptoms, setSymptoms] = useState<string>(
    '401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.'
  );
  const [errorMessage, setErrorMessage] = useState<string>(
    'invalid_token: Token signature validation failed: kid does not match active JWKS key'
  );
  const [stepsTried, setStepsTried] = useState<string>(
    'Verified client secret in developer portal, tested token endpoint manually via curl (200 OK), rebooted client app.'
  );

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<IssueAnalyzeResponse | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Form state for human-verified resolution retention
  const [rootCauseInput, setRootCauseInput] = useState<string>('');
  const [verifiedFixInput, setVerifiedFixInput] = useState<string>('');
  const [verifiedByInput, setVerifiedByInput] = useState<string>('Senior Integration Engineer');
  const [savingResolution, setSavingResolution] = useState<boolean>(false);
  const [resolutionSavedSuccess, setResolutionSavedSuccess] = useState<string | null>(null);

  // Fetch customers on mount
  useEffect(() => {
    api.getCustomers().then((data) => {
      setCustomers(data);
    }).catch(console.error);
  }, []);

  // Handle flow presets
  useEffect(() => {
    if (initialFlow === 'flow1a') {
      loadPresetApex();
    } else if (initialFlow === 'flow1b') {
      loadPresetBeacon();
    } else if (initialFlow === 'flow2') {
      loadPresetCatalyst();
    }
  }, [initialFlow]);

  const loadPresetApex = () => {
    setSelectedCustomerId('cust_apex_retail');
    setApiName('Orders & Webhooks Sync API');
    setApiVersion('v2.4');
    setSymptoms(
      '401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.'
    );
    setErrorMessage(
      'invalid_token: Token signature validation failed: kid does not match active JWKS key'
    );
    setStepsTried(
      'Verified client secret in developer portal, tested token endpoint manually via curl (200 OK), rebooted client app.'
    );
    setResult(null);
    setResolutionSavedSuccess(null);
  };

  const loadPresetBeacon = () => {
    setSelectedCustomerId('cust_beacon_fin');
    setApiName('Orders & Webhooks Sync API');
    setApiVersion('v1.9 (Enterprise Legacy)');
    // EXACT SAME SYMPTOM, DIFFERENT ERROR & ARCHITECTURE
    setSymptoms(
      '401 Unauthorized returned during webhook registration endpoint (POST /webhooks/subscribe). Client requests fail handshake despite valid client credentials.'
    );
    setErrorMessage(
      'invalid_token: Certificate handshake rejected: peer certificate chain incomplete or untrusted'
    );
    setStepsTried(
      'Regenerated client API secret, verified client public IP in firewall whitelist, restarted proxy.'
    );
    setResult(null);
    setResolutionSavedSuccess(null);
  };

  const loadPresetCatalyst = () => {
    setSelectedCustomerId('cust_catalyst_health');
    setApiName('Clinical Records & Telehealth API');
    setApiVersion('v3.0');
    setSymptoms(
      '504 Gateway Timeout during batch transaction export (POST /api/v2/export/batch).'
    );
    setErrorMessage(
      'gateway_timeout: Downstream worker timed out after 30000ms'
    );
    setStepsTried(
      'Checked worker thread count, increased request timeout from 30s to 60s, restarted client batch daemon.'
    );
    setRootCauseInput(
      'Database read replica lag exceeded 180s due to unindexed compound query on export_status + organization_id, triggering upstream gateway timeout.'
    );
    setVerifiedFixInput(
      'Added compound B-tree index on (organization_id, export_status, created_at) and set query MAX_EXECUTION_TIME = 15000.'
    );
    setResult(null);
    setResolutionSavedSuccess(null);
  };

  const currentCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAnalyzing(true);
    setAnalyzeError(null);
    setResolutionSavedSuccess(null);

    try {
      const payload: IssueAnalyzeRequest = {
        customer_id: selectedCustomerId,
        api_name: apiName,
        api_version: apiVersion,
        symptoms,
        error_message: errorMessage,
        steps_tried: stepsTried
      };
      const resp = await api.analyzeIssue(payload);
      setResult(resp);
    } catch (err: any) {
      setAnalyzeError(err.message || 'Failed to search Hindsight memory bank');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveResolution = async () => {
    if (!rootCauseInput || !verifiedFixInput) {
      alert('Please provide both the human-verified Root Cause and Verified Fix.');
      return;
    }

    setSavingResolution(true);
    try {
      const payload: ResolutionSubmitRequest = {
        customer_id: selectedCustomerId,
        api_name: apiName,
        api_version: apiVersion,
        symptoms,
        error_message: errorMessage,
        steps_tried: stepsTried,
        root_cause: rootCauseInput,
        verified_fix: verifiedFixInput,
        verified_by: verifiedByInput,
        case_id: 'CASE-1105',
        title: `${apiName}: ${symptoms.slice(0, 50)}...`
      };

      const resp = await api.submitResolution('CASE-1105', payload);
      setResolutionSavedSuccess(resp.message);
    } catch (err: any) {
      alert(err.message || 'Failed to retain resolution');
    } finally {
      setSavingResolution(false);
    }
  };

  const handleCopyFix = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto px-6 py-8">
      {/* Broadsheet Headline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#E3DBD0] gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#07241A] tracking-tight">
            Diagnostic & Memory Investigation
          </h1>
          <p className="text-sm text-[#5E7D6D] mt-1 font-sans">
            Search customer-scoped Hindsight memory banks to recall verified precedents or record human confirmations.
          </p>
        </div>

        {/* Isolation pill */}
        <div className="flex items-center space-x-2 text-xs font-mono text-[#1E3A2F] bg-[#EAE3D9] px-3 py-1.5 rounded-[4px] border border-[#5E7D6D]/30 self-start md:self-auto">
          <Lock className="w-3.5 h-3.5 text-[#1E3A2F]" />
          <span>SCOPE: casetracker-{selectedCustomerId.replace('_', '-')}</span>
        </div>
      </div>

      {/* Preset Buttons for Hackathon Demonstrator */}
      <div className="p-4 bg-[#F4EFEA] border border-[#E3DBD0] rounded-[4px] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-[#07241A] font-bold tracking-wider">
            1-Click Hackathon Demo Scenarios:
          </span>
          <span className="text-[11px] font-mono text-[#7A8880]">
            Click any scenario to populate the triage desk
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={loadPresetApex}
            className={`px-3 py-2 text-xs font-mono rounded-[4px] border transition-all ${
              selectedCustomerId === 'cust_apex_retail' && symptoms.includes('kid')
                ? 'bg-[#1E3A2F] text-[#FAF8F5] border-[#1E3A2F] font-semibold'
                : 'bg-[#FFFFFF] text-[#1F2421] border-[#E3DBD0] hover:bg-[#EAE3D9]'
            }`}
          >
            Flow 1A: Apex Retail (401 OAuth Key ID Mismatch)
          </button>

          <button
            type="button"
            onClick={loadPresetBeacon}
            className={`px-3 py-2 text-xs font-mono rounded-[4px] border transition-all ${
              selectedCustomerId === 'cust_beacon_fin'
                ? 'bg-[#1E3A2F] text-[#FAF8F5] border-[#1E3A2F] font-semibold'
                : 'bg-[#FFFFFF] text-[#1F2421] border-[#E3DBD0] hover:bg-[#EAE3D9]'
            }`}
          >
            Flow 1B: Beacon Financial (Same 401 Symptom &rarr; mTLS CA Fix)
          </button>

          <button
            type="button"
            onClick={loadPresetCatalyst}
            className={`px-3 py-2 text-xs font-mono rounded-[4px] border transition-all ${
              selectedCustomerId === 'cust_catalyst_health'
                ? 'bg-[#C85A32] text-[#FAF8F5] border-[#C85A32] font-semibold'
                : 'bg-[#FFFFFF] text-[#1F2421] border-[#E3DBD0] hover:bg-[#FDF1EA]'
            }`}
          >
            Flow 2 &amp; 3: Catalyst Health (504 Timeout &rarr; Needs Investigation &rarr; Retain &amp; Recall)
          </button>
        </div>
      </div>

      {/* Main 2-Column Broadsheet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Issue Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-6 space-y-5">
          <div className="border-b border-[#EAE3D9] pb-3 flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-[#07241A]">
              Issue Telemetry & Symptoms
            </h2>
            <span className="text-xs font-mono text-[#5E7D6D]">INPUT SPEC</span>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Customer selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                Customer Scope (Memory Bank) *
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  const c = customers.find(x => x.id === e.target.value);
                  if (c) {
                    setApiName(c.api_name);
                    setApiVersion(c.api_version);
                  }
                  setResult(null);
                }}
                className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.auth_type})
                  </option>
                ))}
              </select>
              {currentCustomer && (
                <div className="text-[11px] font-mono text-[#5E7D6D] bg-[#F4EFEA] p-2 rounded-[2px] border border-[#EAE3D9]">
                  Auth: <span className="font-semibold text-[#1E3A2F]">{currentCustomer.auth_type}</span> • Env: {currentCustomer.environment}
                </div>
              )}
            </div>

            {/* API Name & Version */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                  System / API Name *
                </label>
                <input
                  type="text"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  className="w-full text-xs font-sans bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                  Version *
                </label>
                <input
                  type="text"
                  value={apiVersion}
                  onChange={(e) => setApiVersion(e.target.value)}
                  className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
                  required
                />
              </div>
            </div>

            {/* Observed Symptoms */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                Observed Symptoms / Behavior *
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
                className="w-full text-xs font-sans bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
                required
              />
            </div>

            {/* Error Message / Response */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                Exact Error Code / Telemetry *
              </label>
              <textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                rows={2}
                className="w-full text-xs font-mono bg-[#F4EFEA] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#C85A32] focus:outline-none focus:border-[#1E3A2F]"
                required
              />
            </div>

            {/* Troubleshooting Steps Tried */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                Steps Already Tried by Support
              </label>
              <textarea
                value={stepsTried}
                onChange={(e) => setStepsTried(e.target.value)}
                rows={2}
                className="w-full text-xs font-sans bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
                placeholder="e.g. Cleared client cache, reissued token..."
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-3 bg-[#1E3A2F] hover:bg-[#152A22] text-[#FAF8F5] text-xs font-mono uppercase font-bold rounded-[4px] transition-all duration-150 flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <Search className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Searching Customer Memory Bank...' : 'Search Hindsight Memory'}</span>
            </button>
          </form>

          {analyzeError && (
            <div className="p-3 bg-[#FFDAD6] border border-[#BA1A1A] text-[#93000A] text-xs font-mono rounded-[4px]">
              {analyzeError}
            </div>
          )}
        </div>

        {/* Right Column: Diagnostic & Memory Recall Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !analyzing && (
            <div className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-10 text-center space-y-3">
              <Terminal className="w-10 h-10 text-[#5E7D6D] mx-auto opacity-40" />
              <h3 className="text-lg font-serif font-semibold text-[#07241A]">
                No Memory Recall Initiated
              </h3>
              <p className="text-xs text-[#5E7D6D] max-w-md mx-auto leading-relaxed">
                Enter incident symptoms on the left or click one of the hackathon demo presets above to search customer-isolated persistent memory.
              </p>
            </div>
          )}

          {analyzing && (
            <div className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-12 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-[#1E3A2F] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-1">
                <h4 className="text-sm font-serif font-semibold text-[#07241A]">
                  Querying Customer Memory Bank
                </h4>
                <p className="text-xs font-mono text-[#5E7D6D]">
                  bank_id: casetracker-{selectedCustomerId.replace('_', '-')}
                </p>
              </div>
            </div>
          )}

          {result && !analyzing && (
            <div className="space-y-6">
              {/* Memory Scope Header Banner */}
              <div className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[#7A8880]">BANK SCOPE:</span>
                  <span className="font-bold text-[#1E3A2F]">{result.memory_scope}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#7A8880]">PROVIDER:</span>
                  <span className="font-semibold text-[#1F2421] bg-[#F4EFEA] px-2 py-0.5 rounded-[2px] border border-[#E3DBD0]">
                    {result.memory_provider_label}
                  </span>
                </div>
              </div>

              {/* STATE 1: MATCH FOUND (VERIFIED PRECEDENT) */}
              {result.status === 'match_found' && result.match && (
                <div className="bg-[#FFFFFF] border-2 border-[#1E3A2F] rounded-[4px] p-6 space-y-6 shadow-xs">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#E3DBD0]">
                    <div className="flex items-center space-x-2 text-[#1E3A2F]">
                      <CheckCircle2 className="w-5 h-5 text-[#1E3A2F]" />
                      <span className="font-serif font-bold text-lg text-[#07241A]">
                        Verified Precedent Recalled
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="bg-[#C6E8D4] text-[#07241A] px-2 py-0.5 rounded-[2px] font-bold">
                        MATCH SCORE {Math.round(result.match.relevance_score * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Case Identifiers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-[#F4EFEA] border border-[#E3DBD0] rounded-[4px] text-xs font-mono">
                    <div>
                      <span className="text-[#7A8880] block text-[10px]">CASE ID</span>
                      <span className="font-bold text-[#1E3A2F]">{result.match.case_id}</span>
                    </div>
                    <div>
                      <span className="text-[#7A8880] block text-[10px]">SOURCE ID</span>
                      <span className="font-bold text-[#1F2421] truncate block" title={result.match.source_id}>
                        {result.match.source_id}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#7A8880] block text-[10px]">VERIFIED BY</span>
                      <span className="font-medium text-[#1F2421]">{result.match.verified_by}</span>
                    </div>
                    <div>
                      <span className="text-[#7A8880] block text-[10px]">VERIFIED AT</span>
                      <span className="font-medium text-[#1F2421]">{result.match.verified_at}</span>
                    </div>
                  </div>

                  {/* Title & Forensic Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-serif font-bold text-[#07241A]">
                      {result.match.title}
                    </h3>

                    {/* Root Cause */}
                    <div className="space-y-1">
                      <span className="text-xs font-mono uppercase text-[#7A8880] font-semibold">
                        Confirmed Root Cause:
                      </span>
                      <p className="text-xs text-[#1F2421] bg-[#FAF8F5] p-3 rounded-[4px] border border-[#E3DBD0] leading-relaxed">
                        {result.match.root_cause}
                      </p>
                    </div>

                    {/* Human-Verified Fix Recommendation */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-[#1E3A2F] font-bold">
                          Human-Verified Fix Proposal (For Engineer Review):
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyFix(result.match!.verified_fix)}
                          className="flex items-center space-x-1 text-xs font-mono text-[#5E7D6D] hover:text-[#1E3A2F]"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copied ? 'Copied!' : 'Copy Fix'}</span>
                        </button>
                      </div>
                      <div className="p-4 bg-[#ECF1EE] border border-[#5E7D6D]/40 rounded-[4px] text-xs font-mono text-[#07241A] font-semibold leading-relaxed">
                        {result.match.verified_fix}
                      </div>
                    </div>

                    {/* Why this applies */}
                    <div className="space-y-1">
                      <span className="text-xs font-mono uppercase text-[#5E7D6D] font-semibold">
                        Architectural Precedent Rationale:
                      </span>
                      <p className="text-xs text-[#5E7D6D] italic">
                        {result.match.why_it_applies}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EAE3D9] flex items-center justify-between text-xs text-[#5E7D6D]">
                    <span>Suggested for engineer review before applying client config changes.</span>
                    <span className="font-mono text-[#1E3A2F] font-semibold">CONFIRMED RESOLUTION</span>
                  </div>
                </div>
              )}

              {/* STATE 2: NEEDS INVESTIGATION (NO NOVEL INVENTION) */}
              {result.status === 'needs_investigation' && (
                <div className="bg-[#FFFFFF] border-2 border-[#C85A32] rounded-[4px] p-6 space-y-6 shadow-xs">
                  {/* Warning Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#E3DBD0]">
                    <div className="flex items-center space-x-2 text-[#C85A32]">
                      <AlertTriangle className="w-5 h-5 text-[#C85A32]" />
                      <span className="font-serif font-bold text-lg text-[#C85A32]">
                        Needs Investigation
                      </span>
                    </div>
                    <span className="bg-[#FDF1EA] text-[#C85A32] px-2 py-0.5 rounded-[2px] font-mono text-xs font-bold border border-[#F3CCB8]">
                      NO VERIFIED PRECEDENT IN MEMORY
                    </span>
                  </div>

                  {/* Anti-Hallucination Disclaimer */}
                  <div className="p-4 bg-[#FDF1EA] border border-[#F3CCB8] rounded-[4px] text-xs text-[#641C00] leading-relaxed space-y-2">
                    <p className="font-semibold">
                      Zero Hallucination Protocol Enforced:
                    </p>
                    <p>
                      Hindsight memory bank <code className="bg-[#FFFFFF] px-1 py-0.5 rounded text-[#07241A]">{result.memory_scope}</code> contained no reliable resolution matching this failure mode and customer configuration.
                      In accordance with engineering standards, the system will not invent a diagnosis or speculative fix.
                    </p>
                  </div>

                  {/* Human Investigation & Resolution Retention Form */}
                  <div className="space-y-4 pt-2 border-t border-[#EAE3D9]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-serif font-bold text-[#07241A]">
                        Human Investigation Sign-Off & Memory Retention
                      </h4>
                      <span className="text-[11px] font-mono text-[#5E7D6D]">
                        Retains to Hindsight Bank
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                        Human-Verified Root Cause *
                      </label>
                      <textarea
                        value={rootCauseInput}
                        onChange={(e) => setRootCauseInput(e.target.value)}
                        placeholder="State the confirmed underlying defect discovered during manual triage..."
                        rows={2}
                        className="w-full text-xs font-sans bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                        Human-Verified Fix / Remediation *
                      </label>
                      <textarea
                        value={verifiedFixInput}
                        onChange={(e) => setVerifiedFixInput(e.target.value)}
                        placeholder="State the exact verified configuration or code remedy..."
                        rows={2}
                        className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                          Verifying Engineer Name
                        </label>
                        <input
                          type="text"
                          value={verifiedByInput}
                          onChange={(e) => setVerifiedByInput(e.target.value)}
                          className="w-full text-xs font-sans bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase text-[#4A554E] font-medium">
                          Assign Case Identifier
                        </label>
                        <input
                          type="text"
                          value="CASE-1105"
                          disabled
                          className="w-full text-xs font-mono bg-[#F4EFEA] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#5E7D6D] cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveResolution}
                      disabled={savingResolution}
                      className="w-full py-3 bg-[#C85A32] hover:bg-[#AB481D] text-[#FAF8F5] text-xs font-mono uppercase font-bold rounded-[4px] transition-all duration-150 flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {savingResolution
                          ? 'Retaining into Hindsight Bank...'
                          : 'Confirm & Retain in Customer Hindsight Bank'}
                      </span>
                    </button>

                    {resolutionSavedSuccess && (
                      <div className="p-4 bg-[#C6E8D4] border border-[#1E3A2F] text-[#07241A] rounded-[4px] text-xs font-mono space-y-3">
                        <div className="flex items-center space-x-2 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-[#1E3A2F]" />
                          <span>{resolutionSavedSuccess}</span>
                        </div>
                        <p className="text-[#1E3A2F]">
                          Memory retained! Click below to re-analyze this exact failure and observe Hindsight recall the newly learned resolution.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAnalyze()}
                          className="px-4 py-2 bg-[#1E3A2F] text-[#FAF8F5] rounded-[4px] font-bold text-xs hover:bg-[#152A22] transition-colors"
                        >
                          Re-Analyze Now to Test Learned Memory
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
