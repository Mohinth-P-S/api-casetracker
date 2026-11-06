import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Filter, 
  BarChart2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Layers,
  ChevronRight,
  Terminal
} from 'lucide-react';
import { api } from '../api';
import { FrequentProblem } from '../types';

export const FrequentProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<FrequentProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<FrequentProblem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Security / Auth',
    'Traffic / Quota',
    'Payload / Serialization',
    'Performance / Latency',
    'Integration / Events'
  ];

  useEffect(() => {
    fetchProblems(activeCategory);
  }, [activeCategory]);

  const fetchProblems = async (cat: string) => {
    setLoading(true);
    try {
      const data = await api.getProblems(cat);
      setProblems(data);
      if (data.length > 0 && !selectedProblem) {
        setSelectedProblem(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const maxOccurrences = Math.max(...problems.map(p => p.occurrences), 50);

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto px-6 py-8">
      {/* Broadsheet Headline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#E3DBD0] gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#07241A] tracking-tight">
            Recurring Integration Failures & Anomalies
          </h1>
          <p className="text-sm text-[#5E7D6D] mt-1 font-sans">
            Ranked occurrence telemetry across enterprise customer API endpoints and gateway configurations.
          </p>
        </div>

        <span className="text-xs font-mono text-[#1E3A2F] bg-[#EAE3D9] px-3 py-1.5 rounded-[4px] border border-[#5E7D6D]/30 self-start md:self-auto font-semibold">
          TOP FREQUENT INCIDENTS
        </span>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs font-mono">
        <span className="text-[#7A8880] flex items-center space-x-1 mr-2">
          <Filter className="w-3.5 h-3.5 text-[#5E7D6D]" />
          <span>FILTER:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-[4px] transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#1E3A2F] text-[#FAF8F5] font-semibold'
                : 'bg-[#FFFFFF] border border-[#E3DBD0] text-[#4A554E] hover:bg-[#F4EFEA]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Layout: Ranked Horizontal Bar Chart List (Left) + Detail View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ranked Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-6 space-y-5">
          <div className="border-b border-[#EAE3D9] pb-3 flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-[#07241A]">
              Ranked Incident Frequency
            </h2>
            <span className="text-xs font-mono text-[#5E7D6D]">
              {problems.length} FAILURE CLUSTERS
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#5E7D6D]">
              Loading recurring incident telemetry...
            </div>
          ) : (
            <div className="space-y-4">
              {problems.map((problem, idx) => {
                const isSelected = selectedProblem?.id === problem.id;
                const percentage = Math.round((problem.occurrences / maxOccurrences) * 100);
                const isCritical = problem.severity === 'Critical';

                return (
                  <div
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`p-4 rounded-[4px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F4EFEA] border-[#1E3A2F] shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E3DBD0] hover:border-[#5E7D6D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#7A8880]">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-sm font-serif font-bold text-[#07241A]">
                          {problem.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-[2px] font-bold ${
                          isCritical
                            ? 'bg-[#FDF1EA] text-[#C85A32] border border-[#F3CCB8]'
                            : 'bg-[#EAE3D9] text-[#1E3A2F]'
                        }`}>
                          {problem.severity}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#07241A]">
                          {problem.occurrences} cases
                        </span>
                        <ChevronRight className={`w-4 h-4 text-[#7A8880] transition-transform ${isSelected ? 'rotate-90 text-[#1E3A2F]' : ''}`} />
                      </div>
                    </div>

                    {/* Sharp Rectangular Broadsheet Progress Bar */}
                    <div className="h-2.5 bg-[#EAE3D9] rounded-[2px] overflow-hidden mb-2">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCritical ? 'bg-[#C85A32]' : 'bg-[#5E7D6D]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#7A8880]">
                      <span>Category: {problem.category}</span>
                      <span>Affects: {problem.affected_customers.length} customer profiles</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Problem Detail View (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E3DBD0] rounded-[4px] p-6 space-y-6 sticky top-24">
          <div className="border-b border-[#EAE3D9] pb-3 flex items-center justify-between">
            <h2 className="text-lg font-serif font-semibold text-[#07241A]">
              Problem Detail & Runbook
            </h2>
            <span className="text-xs font-mono text-[#5E7D6D]">DIAGNOSTIC SPEC</span>
          </div>

          {selectedProblem ? (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[2px] bg-[#EAE3D9] text-[#1E3A2F] font-bold">
                  {selectedProblem.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#07241A] mt-2">
                  {selectedProblem.title}
                </h3>
              </div>

              {/* Affected Customers */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase text-[#7A8880] font-semibold">
                  Affected Customer Environments:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProblem.affected_customers.map((cust) => (
                    <span 
                      key={cust}
                      className="px-2 py-0.5 rounded-[2px] bg-[#F4EFEA] border border-[#E3DBD0] text-xs font-mono text-[#1F2421]"
                    >
                      {cust}
                    </span>
                  ))}
                </div>
              </div>

              {/* Common Symptoms */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase text-[#7A8880] font-semibold">
                  Characteristic Symptoms:
                </span>
                <p className="text-xs text-[#1F2421] bg-[#FAF8F5] p-3 rounded-[4px] border border-[#E3DBD0] leading-relaxed">
                  {selectedProblem.common_symptoms}
                </p>
              </div>

              {/* Common Root Cause */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase text-[#7A8880] font-semibold">
                  Verified Root Cause Pattern:
                </span>
                <p className="text-xs text-[#4A554E] bg-[#FAF8F5] p-3 rounded-[4px] border border-[#E3DBD0] leading-relaxed">
                  {selectedProblem.common_root_cause}
                </p>
              </div>

              {/* Recommended Fix */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase text-[#1E3A2F] font-bold">
                  Recommended Remediation Runbook:
                </span>
                <div className="p-3.5 bg-[#ECF1EE] border border-[#5E7D6D]/40 rounded-[4px] text-xs font-mono text-[#07241A] font-semibold leading-relaxed">
                  {selectedProblem.recommended_fix}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between text-xs font-mono text-[#5E7D6D]">
                <span>Total Recorded: {selectedProblem.occurrences} incidents</span>
                <span className="font-semibold text-[#1E3A2F]">VERIFIED RUNBOOK</span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#7A8880]">
              Select a problem from the left ranking to view detailed runbook and forensic details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
