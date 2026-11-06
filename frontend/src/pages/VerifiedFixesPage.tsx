import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Filter, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  X,
  FileCheck
} from 'lucide-react';
import { api } from '../api';
import { VerifiedFix } from '../types';

export const VerifiedFixesPage: React.FC = () => {
  const [fixes, setFixes] = useState<VerifiedFix[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customerFilter, setCustomerFilter] = useState<string>('All');
  const [selectedFix, setSelectedFix] = useState<VerifiedFix | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchFixes = async () => {
    setLoading(true);
    try {
      const data = await api.getVerifiedFixes(searchQuery, customerFilter);
      setFixes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixes();
  }, [customerFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFixes();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto px-6 py-8">
      {/* Broadsheet Headline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#E3DBD0] gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#07241A] tracking-tight">
            Verified Fixes & Post-Mortem Catalog
          </h1>
          <p className="text-sm text-[#5E7D6D] mt-1 font-sans">
            Searchable, permanent archive of human-confirmed API resolutions retained across Hindsight memory banks.
          </p>
        </div>

        <span className="text-xs font-mono uppercase px-3 py-1.5 rounded-[4px] bg-[#C6E8D4] text-[#07241A] border border-[#1E3A2F]/30 self-start md:self-auto font-semibold">
          HUMAN-VERIFIED RESOLUTIONS ONLY
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7A8880] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across case IDs, symptoms, root causes, or verified fixes..."
              className="w-full text-xs font-sans pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#1E3A2F] text-[#FAF8F5] text-xs font-mono rounded-[4px] hover:bg-[#152A22] transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2 text-xs font-mono w-full sm:w-auto">
          <span className="text-[#7A8880] whitespace-nowrap">CUSTOMER:</span>
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="text-xs font-mono bg-[#FAF8F5] border border-[#E3DBD0] rounded-[4px] px-3 py-2 text-[#1F2421] focus:outline-none focus:border-[#1E3A2F]"
          >
            <option value="All">All Customer Scopes</option>
            <option value="cust_apex_retail">Apex Retail Group</option>
            <option value="cust_beacon_fin">Beacon Financial Systems</option>
            <option value="cust_catalyst_health">Catalyst Health Cloud</option>
          </select>
        </div>
      </div>

      {/* Fixes Broadsheet Table */}
      <div className="bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#E3DBD0] bg-[#FAF8F5] text-[#7A8880] font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Customer Scope</th>
                <th className="py-3 px-4">Title / Symptom</th>
                <th className="py-3 px-4">Confirmed Root Cause</th>
                <th className="py-3 px-4">Human-Verified Fix</th>
                <th className="py-3 px-4">Verified By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-mono text-[#5E7D6D]">
                    Loading verified fixes from memory catalog...
                  </td>
                </tr>
              ) : fixes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#7A8880]">
                    No verified fixes found matching this search criteria.
                  </td>
                </tr>
              ) : (
                fixes.map((fix) => (
                  <tr key={fix.case_id} className="hover:bg-[#F4EFEA] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1E3A2F] whitespace-nowrap">
                      {fix.case_id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1F2421] whitespace-nowrap">
                      <div>{fix.customer_name}</div>
                      <div className="text-[10px] font-mono text-[#5E7D6D]">{fix.api_name} {fix.api_version}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1F2421] max-w-xs">
                      <div className="font-semibold text-xs line-clamp-1">{fix.title}</div>
                      <div className="text-[11px] text-[#7A8880] line-clamp-1">{fix.symptoms}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A554E] max-w-xs">
                      <div className="line-clamp-2 text-xs leading-relaxed">{fix.root_cause}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#07241A] font-mono text-[11px] max-w-sm">
                      <div className="line-clamp-2 bg-[#FAF8F5] p-1.5 rounded-[2px] border border-[#E3DBD0] font-semibold">
                        {fix.verified_fix}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#5E7D6D] whitespace-nowrap">
                      <div>{fix.verified_by}</div>
                      <div className="text-[10px] font-mono text-[#7A8880]">{fix.verified_at}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(fix.verified_fix, fix.case_id)}
                          className="p-1.5 rounded-[2px] hover:bg-[#EAE3D9] text-[#5E7D6D] hover:text-[#1E3A2F]"
                          title="Copy Fix"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedFix(fix)}
                          className="px-2.5 py-1 rounded-[2px] bg-[#1E3A2F] text-[#FAF8F5] font-mono text-[11px] hover:bg-[#152A22]"
                        >
                          Post-Mortem
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Modal Drawer */}
      {selectedFix && (
        <div className="fixed inset-0 z-50 bg-[#07241A]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border-2 border-[#1E3A2F] rounded-[4px] max-w-2xl w-full p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3DBD0]">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-[#1E3A2F]" />
                <h3 className="text-xl font-serif font-bold text-[#07241A]">
                  Forensic Post-Mortem: {selectedFix.case_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFix(null)}
                className="p-1 rounded-[2px] hover:bg-[#F4EFEA] text-[#7A8880]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7A8880] block">CUSTOMER SCOPE</span>
                <span className="text-sm font-semibold text-[#1F2421]">{selectedFix.customer_name}</span>
                <span className="font-mono text-[#5E7D6D] block">Target: {selectedFix.api_name} ({selectedFix.api_version}) • {selectedFix.environment}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#7A8880] block font-semibold">INCIDENT TITLE</span>
                <div className="text-sm font-serif font-bold text-[#07241A]">{selectedFix.title}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#7A8880] block font-semibold">SYMPTOMS & ERROR TRACE</span>
                <p className="bg-[#FAF8F5] p-3 rounded-[4px] border border-[#E3DBD0] font-mono text-[#C85A32]">
                  {selectedFix.symptoms}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#7A8880] block font-semibold">CONFIRMED ROOT CAUSE</span>
                <p className="bg-[#FAF8F5] p-3 rounded-[4px] border border-[#E3DBD0] text-[#1F2421] leading-relaxed">
                  {selectedFix.root_cause}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#1E3A2F] block font-bold">VERIFIED FIX (RETAINED IN HINDSIGHT)</span>
                <div className="bg-[#ECF1EE] p-3.5 rounded-[4px] border border-[#5E7D6D]/40 font-mono text-[#07241A] font-semibold leading-relaxed">
                  {selectedFix.verified_fix}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#5E7D6D] block font-semibold">PRODUCTION OUTCOME</span>
                <p className="bg-[#F4EFEA] p-2.5 rounded-[4px] border border-[#E3DBD0] text-[#1F2421]">
                  {selectedFix.outcome}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs font-mono text-[#7A8880]">
                <span>Verified by: {selectedFix.verified_by}</span>
                <span>Date: {selectedFix.verified_at}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFix(null)}
                className="px-5 py-2 bg-[#1E3A2F] text-[#FAF8F5] rounded-[4px] text-xs font-mono uppercase font-bold"
              >
                Close Post-Mortem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
