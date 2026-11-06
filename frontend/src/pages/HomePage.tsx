import React from 'react';
import { 
  ArrowRight, 
  Database, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode2, 
  Repeat,
  Lock,
  Search,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  onOpenWorkspace: () => void;
  onSelectFlow: (flowId: 'flow1a' | 'flow1b' | 'flow2') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenWorkspace, onSelectFlow }) => {
  return (
    <div className="space-y-12 max-w-[1440px] mx-auto px-6 py-10">
      {/* Hero section */}
      <section className="bg-[#F4EFEA] border border-[#E3DBD0] rounded-[4px] p-8 md:p-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-[#EAE3D9] border border-[#5E7D6D]/40 text-xs font-mono font-medium text-[#1E3A2F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2F]"></span>
            <span>ENTERPRISE INTEGRATION FORENSICS & MEMORY</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#07241A] tracking-tight leading-tight">
            Support that remembers every API fix.
          </h1>

          <p className="text-lg text-[#4A554E] leading-relaxed font-sans">
            Different enterprise customers run different API versions, mTLS truststores, and token rotation schedules.
            When integration failures repeat, engineers waste hours rediscovering root causes.
            <strong className="text-[#1E3A2F] font-semibold"> API CaseTracker</strong> uses Hindsight persistent memory to recall
            verified fixes scoped strictly to each customer's architectural reality.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenWorkspace}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-[#1E3A2F] hover:bg-[#152A22] text-[#FAF8F5] rounded-[4px] font-medium text-base shadow-xs transition-all duration-150 transform hover:-translate-y-0.5"
            >
              <span>Open Troubleshooting Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#AECEBE]" />
            </button>

            <a
              href="#demo-scenarios"
              className="px-5 py-3.5 bg-transparent hover:bg-[#EAE3D9] text-[#1E3A2F] border border-[#E3DBD0] rounded-[4px] font-medium text-sm transition-colors"
            >
              Explore 3 Core Demo Flows
            </a>
          </div>
        </div>

        {/* Tactical broadsheet watermark */}
        <div className="hidden lg:block absolute right-8 top-8 opacity-10 text-right font-mono text-xs text-[#07241A] pointer-events-none select-none">
          <pre>{`
  +------------------------------------------------+
  | HINDSIGHT ISOLATED MEMORY PIPELINE             |
  | customer_id: [ cust_apex_retail ]             |
  | memory_bank: casetracker-cust-apex-retail      |
  | recall(bank_id, query) -> RecallResult         |
  | retain(bank_id, verified_fix) -> RetainResponse|
  +------------------------------------------------+
          `}</pre>
        </div>
      </section>

      {/* Broad Broadsheet Architecture Diagram */}
      <section className="space-y-4">
        <div className="border-b border-[#E3DBD0] pb-2 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-semibold text-[#07241A]">
            How Hindsight Customer Memory Works
          </h2>
          <span className="text-xs font-mono text-[#5E7D6D] uppercase">Architecture Schematic</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#5E7D6D] px-2 py-0.5 bg-[#F4EFEA] rounded-[2px]">STEP 01</span>
              <FileCode2 className="w-5 h-5 text-[#1E3A2F]" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-[#07241A]">Symptom & Context Ingestion</h3>
            <p className="text-sm text-[#4A554E] leading-relaxed">
              Support engineer submits customer ID, API version, failure trace, and troubleshooting steps already attempted.
            </p>
            <div className="pt-2 text-xs font-mono text-[#7A8880] border-t border-[#EAE3D9]">
              POST /api/issues/analyze
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#1E3A2F] px-2 py-0.5 bg-[#C6E8D4] rounded-[2px]">STEP 02</span>
              <Lock className="w-5 h-5 text-[#1E3A2F]" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-[#07241A]">Scoped Hindsight Recall</h3>
            <p className="text-sm text-[#4A554E] leading-relaxed">
              Query is strictly dispatched to <code className="text-[#1E3A2F] bg-[#F4EFEA] px-1 py-0.5 rounded">casetracker-{'{customer_id}'}</code>. Memories from other customers are strictly isolated and never leak.
            </p>
            <div className="pt-2 text-xs font-mono text-[#7A8880] border-t border-[#EAE3D9]">
              client.recall(bank_id=customer_bank)
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-[#C85A32] px-2 py-0.5 bg-[#FDF1EA] rounded-[2px]">STEP 03</span>
              <CheckCircle2 className="w-5 h-5 text-[#C85A32]" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-[#07241A]">Zero Hallucination or Retain</h3>
            <p className="text-sm text-[#4A554E] leading-relaxed">
              If an exact verified match exists, it is suggested for review. If novel, the system flags <em>Needs Investigation</em> and waits for a human engineer to confirm and retain the resolution.
            </p>
            <div className="pt-2 text-xs font-mono text-[#7A8880] border-t border-[#EAE3D9]">
              client.retain(bank_id, resolution)
            </div>
          </div>
        </div>
      </section>

      {/* Demo Walkthrough Scenarios */}
      <section id="demo-scenarios" className="space-y-4">
        <div className="border-b border-[#E3DBD0] pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-[#07241A]">
              Interactive Hackathon Demo Flows
            </h2>
            <p className="text-sm text-[#5E7D6D]">
              Click any scenario below to immediately load and test the memory behavior in the workspace
            </p>
          </div>
          <span className="text-xs font-mono text-[#1E3A2F] bg-[#EAE3D9] px-2.5 py-1 rounded-[2px] font-semibold">
            DEMO DATA SEEDED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flow 1A */}
          <div 
            onClick={() => onSelectFlow('flow1a')}
            className="group cursor-pointer bg-[#FFFFFF] hover:bg-[#F4EFEA] border border-[#E3DBD0] hover:border-[#1E3A2F] rounded-[4px] p-6 transition-all duration-150 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-[2px] bg-[#EAE3D9] text-[#1E3A2F] font-semibold">
                FLOW 1A • KNOWN FIX
              </span>
              <span className="text-xs font-mono text-[#5E7D6D]">OAuth 2.0 PKCE</span>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold text-[#07241A] group-hover:text-[#1E3A2F]">
                Apex Retail Group
              </h4>
              <p className="text-xs font-mono text-[#C85A32] mt-1">
                401 Unauthorized on Webhook Registration
              </p>
            </div>

            <p className="text-xs text-[#4A554E] leading-relaxed">
              Recalls <strong className="text-[#1E3A2F]">CASE-1082</strong>: Flushes Redis OAuth token cache after developer portal key rotation.
            </p>

            <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs font-medium text-[#1E3A2F]">
              <span>Load Flow 1A in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Flow 1B */}
          <div 
            onClick={() => onSelectFlow('flow1b')}
            className="group cursor-pointer bg-[#FFFFFF] hover:bg-[#F4EFEA] border border-[#E3DBD0] hover:border-[#1E3A2F] rounded-[4px] p-6 transition-all duration-150 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-[2px] bg-[#C6E8D4] text-[#07241A] font-semibold">
                FLOW 1B • MEMORY ISOLATION
              </span>
              <span className="text-xs font-mono text-[#5E7D6D]">Mutual TLS (mTLS)</span>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold text-[#07241A] group-hover:text-[#1E3A2F]">
                Beacon Financial Systems
              </h4>
              <p className="text-xs font-mono text-[#C85A32] mt-1">
                401 Unauthorized on Webhook Registration
              </p>
            </div>

            <p className="text-xs text-[#4A554E] leading-relaxed">
              <strong>Exact same symptom as Flow 1A</strong>, but customer isolation recalls <strong className="text-[#1E3A2F]">CASE-1094</strong>: Expired Intermediate CA in mTLS truststore.
            </p>

            <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs font-medium text-[#1E3A2F]">
              <span>Load Flow 1B in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Flow 2 & 3 */}
          <div 
            onClick={() => onSelectFlow('flow2')}
            className="group cursor-pointer bg-[#FFFFFF] hover:bg-[#F4EFEA] border border-[#E3DBD0] hover:border-[#C85A32] rounded-[4px] p-6 transition-all duration-150 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-[2px] bg-[#FDF1EA] text-[#C85A32] font-semibold">
                FLOW 2 & 3 • LEARNING LOOP
              </span>
              <span className="text-xs font-mono text-[#5E7D6D]">OIDC + JWE</span>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold text-[#07241A] group-hover:text-[#C85A32]">
                Catalyst Health Cloud
              </h4>
              <p className="text-xs font-mono text-[#C85A32] mt-1">
                504 Gateway Timeout on Batch Export
              </p>
            </div>

            <p className="text-xs text-[#4A554E] leading-relaxed">
              Triggers <strong className="text-[#C85A32]">Needs Investigation</strong> (no invention). Confirm human resolution, retain into memory bank, and watch it recall on subsequent query!
            </p>

            <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs font-medium text-[#C85A32]">
              <span>Load Flow 2/3 in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Metrics Broadsheet Bar */}
      <section className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-serif font-bold text-[#07241A]">88.6%</div>
          <div className="text-xs font-mono text-[#5E7D6D] uppercase mt-1">Memory Recall Rate</div>
        </div>
        <div className="border-l border-[#EAE3D9]">
          <div className="text-3xl font-serif font-bold text-[#07241A]">4.2 hrs</div>
          <div className="text-xs font-mono text-[#5E7D6D] uppercase mt-1">Avg Saved Per Incident</div>
        </div>
        <div className="border-l border-[#EAE3D9]">
          <div className="text-3xl font-serif font-bold text-[#07241A]">100%</div>
          <div className="text-xs font-mono text-[#5E7D6D] uppercase mt-1">Customer Scope Isolation</div>
        </div>
        <div className="border-l border-[#EAE3D9]">
          <div className="text-3xl font-serif font-bold text-[#C85A32]">0%</div>
          <div className="text-xs font-mono text-[#5E7D6D] uppercase mt-1">Hallucinated Diagnoses</div>
        </div>
      </section>
    </div>
  );
};
