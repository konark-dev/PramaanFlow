import React from 'react';
import { useDemoState } from '@/lib/context/DemoStateContext';
import { Clock } from 'lucide-react';

export function CaseTimelineView() {
  const { activeCase } = useDemoState();

  if (!activeCase || !activeCase.timeline) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-slate-500" />
        <h3 className="text-lg font-bold text-slate-800">Case Timeline (Audit Trail)</h3>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {activeCase.timeline.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-32 flex-shrink-0 text-xs text-slate-500 pt-1">
              {new Date(item.timestamp).toLocaleString()}
            </div>
            <div className="relative pb-4">
              {index !== activeCase.timeline.length - 1 && (
                <div className="absolute top-2 left-1.5 bottom-0 w-px bg-slate-200" />
              )}
              <div className="w-3 h-3 rounded-full bg-slate-300 mt-1" />
            </div>
            <div className="text-sm font-medium text-slate-700">
              {item.event}
            </div>
          </div>
        ))}
        {activeCase.timeline.length === 0 && (
          <div className="text-sm text-slate-500">No events found.</div>
        )}
      </div>
    </div>
  );
}
