import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  Server, 
  Globe, 
  Clock, 
  Lock, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { api } from '../api';
import { CustomerProfile } from '../types';

export const CustomerProfilesPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust_apex_retail');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getCustomers().then((data) => {
      setCustomers(data);
      if (data.length > 0) {
        setSelectedCustomerId(data[0].id);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto px-6 py-8">
      {/* Broadsheet Headline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#E3DBD0] gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#07241A] tracking-tight">
            Customer API Profiles & Memory Scopes
          </h1>
          <p className="text-sm text-[#5E7D6D] mt-1 font-sans">
            Every customer integration maintains an isolated Hindsight memory bank respecting their unique authentication, ciphers, and API versions.
          </p>
        </div>

        <span className="text-xs font-mono uppercase px-3 py-1.5 rounded-[4px] bg-[#EAE3D9] text-[#1E3A2F] border border-[#5E7D6D]/30 self-start md:self-auto font-semibold">
          DEMO DATA • STRICT MEMORY ISOLATION
        </span>
      </div>

      {/* Main Layout: Customer Selector Cards (Left 4 cols) + Profile Inspector (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer List Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border-b border-[#E3DBD0] pb-2 flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#7A8880] font-semibold">
              Select Customer ({customers.length})
            </span>
            <span className="text-xs font-mono text-[#5E7D6D]">SCOPE ISOLATED</span>
          </div>

          <div className="space-y-3">
            {customers.map((c) => {
              const isSelected = selectedCustomerId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-4 rounded-[4px] border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F4EFEA] border-[#1E3A2F] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#E3DBD0] hover:border-[#5E7D6D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[2px] bg-[#EAE3D9] text-[#1E3A2F] font-bold">
                      {c.auth_type}
                    </span>
                    <span className="text-[11px] font-mono text-[#7A8880]">
                      {c.api_version}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[#07241A] mb-1">
                    {c.name}
                  </h3>

                  <p className="text-xs text-[#5E7D6D] mb-3 line-clamp-1">
                    {c.industry}
                  </p>

                  <div className="pt-2 border-t border-[#EAE3D9] flex items-center justify-between text-[11px] font-mono text-[#1E3A2F]">
                    <span>Bank: casetracker-{c.id.replace('_', '-')}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Customer Scope Isolation Notice */}
          <div className="p-4 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-serif font-bold text-[#07241A]">
              <Lock className="w-3.5 h-3.5 text-[#1E3A2F]" />
              <span>Multi-Tenant Memory Security</span>
            </div>
            <p className="text-xs text-[#5E7D6D] leading-relaxed">
              Memories, authentication tokens, and private hostnames from one customer bank are physically partitioned in Hindsight and will never surface in another customer's recall.
            </p>
          </div>
        </div>

        {/* Right Column: Profile & Incident Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-6 space-y-8">
          {selectedCustomer ? (
            <>
              {/* Profile Header */}
              <div className="pb-6 border-b border-[#E3DBD0] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-serif font-bold text-[#07241A]">
                      {selectedCustomer.name}
                    </h2>
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-[2px] bg-[#C6E8D4] text-[#07241A] font-bold">
                      ACTIVE SCOPE
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#5E7D6D]">
                    ID: {selectedCustomer.id}
                  </span>
                </div>

                <p className="text-sm text-[#4A554E]">
                  {selectedCustomer.industry} • {selectedCustomer.environment}
                </p>

                {/* Key specs badge line */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px]">
                    <span className="text-[#7A8880] block text-[10px]">API SYSTEM</span>
                    <span className="font-semibold text-[#1F2421]">{selectedCustomer.api_name}</span>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px]">
                    <span className="text-[#7A8880] block text-[10px]">VERSION</span>
                    <span className="font-semibold text-[#1F2421]">{selectedCustomer.api_version}</span>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px]">
                    <span className="text-[#7A8880] block text-[10px]">AUTH PROTOCOL</span>
                    <span className="font-semibold text-[#1E3A2F]">{selectedCustomer.auth_type}</span>
                  </div>
                </div>
              </div>

              {/* Endpoints & Auth Summary */}
              <div className="space-y-4">
                <h3 className="text-base font-serif font-semibold text-[#07241A]">
                  Authentication & Gateway Infrastructure
                </h3>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] space-y-1">
                    <span className="text-[#7A8880] text-[10px] uppercase">Auth Summary</span>
                    <p className="text-[#1F2421] font-sans font-medium text-xs leading-relaxed">
                      {selectedCustomer.auth_summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px]">
                      <span className="text-[#7A8880] text-[10px] uppercase block">Base API URL</span>
                      <code className="text-[#1E3A2F]">{selectedCustomer.base_url}</code>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px]">
                      <span className="text-[#7A8880] text-[10px] uppercase block">Webhook Ingress URL</span>
                      <code className="text-[#1E3A2F]">{selectedCustomer.webhook_url}</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration Summary Table */}
              <div className="space-y-4">
                <h3 className="text-base font-serif font-semibold text-[#07241A]">
                  Configuration Parameters (JSON Specification)
                </h3>

                <div className="bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] p-4 font-mono text-xs overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#E3DBD0] text-[#7A8880] uppercase text-[10px]">
                        <th className="pb-2">Parameter Key</th>
                        <th className="pb-2">Configured Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE3D9]">
                      {Object.entries(selectedCustomer.config_summary).map(([k, v]) => (
                        <tr key={k}>
                          <td className="py-2 text-[#4A554E] font-semibold">{k}</td>
                          <td className="py-2 text-[#1E3A2F]">
                            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Incident History & Memory Timeline */}
              <div className="space-y-4">
                <h3 className="text-base font-serif font-semibold text-[#07241A]">
                  Customer Incident & Resolution Timeline
                </h3>

                <div className="space-y-3">
                  {selectedCustomer.incident_timeline.map((evt, i) => (
                    <div 
                      key={evt.case_id + i} 
                      className="p-4 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#1E3A2F]">
                            {evt.case_id}
                          </span>
                          <span className="font-semibold text-[#07241A]">
                            {evt.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded-[2px] bg-[#C6E8D4] text-[#07241A] font-semibold">
                            {evt.status}
                          </span>
                          <span className="text-[#7A8880]">{evt.date}</span>
                        </div>
                      </div>
                      <p className="text-[#4A554E] leading-relaxed">
                        {evt.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-[#7A8880]">
              Select a customer profile from the left to view integration configuration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
