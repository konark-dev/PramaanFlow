import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getApiBaseUrl } from '@/lib/api';
import { Activity, AlertTriangle, FileWarning, Search, Info } from 'lucide-react';

export function ImpactAnalysisPanel({ projectId }: { projectId: string }) {
  const [factField, setFactField] = useState('investment_amount');
  const [factValue, setFactValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkImpact = async () => {
    setLoading(true);
    try {
      // Basic type casting
      let val: any = factValue;
      if (!isNaN(Number(val))) val = Number(val);
      
      const res = await fetch(`${getApiBaseUrl()}/projects/${projectId}/impact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ changedFacts: { [factField]: val } })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('Error checking impact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="bg-slate-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Change Impact Simulator</h2>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-600 mb-4">
          Test how changes to your project facts dynamically alter required approvals, SLAs, and downstream dependencies before applying them.
        </p>
        
        <div className="flex gap-3 mb-6">
          <select 
            value={factField} 
            onChange={e => setFactField(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="investment_amount">Investment Amount (INR)</option>
            <option value="employee_count">Employee Count</option>
            <option value="industrial_area">Industrial Area</option>
            <option value="sector">Sector</option>
            <option value="stage">Project Stage</option>
          </select>
          <input 
            type="text" 
            placeholder="New Value..." 
            value={factValue} 
            onChange={e => setFactValue(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 flex-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button 
            onClick={checkImpact}
            disabled={loading || !factValue}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Check Impact'}
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded border border-gray-200">
              {result.message} (Checked {result.rulesChecked} rules)
            </div>
            
            {result.impacts?.length > 0 && (
              <div className="space-y-3">
                {result.impacts.map((impact: any, idx: number) => (
                  <div key={idx} className="border border-amber-200 bg-amber-50 rounded-lg p-4 cursor-pointer hover:bg-amber-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        {impact.approval_name}
                      </h4>
                      <span className="text-xs font-bold uppercase tracking-wide bg-amber-200 text-amber-800 px-2 py-0.5 rounded">
                        {impact.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-amber-800 mb-3">
                      <div><span className="font-semibold">Type:</span> {impact.impact_type.replace(/_/g, ' ')}</div>
                      <div><span className="font-semibold">Rule Fired:</span> {impact.condition_fired}</div>
                      <div><span className="font-semibold">Owner:</span> {impact.owner}</div>
                      <div><span className="font-semibold">SLA Impact:</span> {impact.sla_policy}</div>
                    </div>
                    
                    <div className="text-xs text-amber-700 mb-2 font-mono bg-amber-200/50 p-2 rounded">
                      <Info className="w-3 h-3 inline mr-1" />
                      Trace: {impact.reason} 
                      <span className="ml-2 text-amber-600">(Source: {impact.source_citation || 'Source not recorded'})</span>
                    </div>

                    {impact.stale_documents?.length > 0 && (
                      <div className="mt-3 border-t border-amber-200/50 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1 block">Stale Evidence Requires Revalidation:</span>
                        <ul className="text-xs text-amber-900 space-y-1">
                          {impact.stale_documents.map((d: any) => (
                            <li key={d.id} className="flex items-center gap-1.5"><FileWarning className="w-3 h-3 text-red-500" /> {d.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {impact.downstream_blocked?.length > 0 && (
                      <div className="mt-2 border-t border-amber-200/50 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1 block">Downstream Blocked Approvals:</span>
                        <ul className="text-xs text-amber-900 space-y-1">
                          {impact.downstream_blocked.map((d: any) => (
                            <li key={d.id}>• {d.name} ({d.type})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
