import React from 'react';
import { Check } from 'lucide-react';
import { DISCOVERY_STEPS } from '@/lib/regulatory-questions';

/**
 * Horizontal stepper used for video walkthroughs and navigation.
 * It reads the current step index from the parent and optionally
 * allows clicking on completed steps to jump back.
 */
export function JourneyStepper({
  activeStepIndex,
  onStepClick,
}: {
  activeStepIndex: number;
  onStepClick?: (index: number) => void;
}) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 sticky top-[64px] z-30 shadow-sm flex items-center justify-center">
      <div className="flex items-center gap-1 overflow-x-auto w-full max-w-[1400px] scrollbar-hide">
        {DISCOVERY_STEPS.map((step, idx) => {
          const isActive = activeStepIndex === idx;
          const isCompleted = idx < activeStepIndex;
          return (
            <div key={step.id} className="flex items-center shrink-0">
              <button
                onClick={() => onStepClick && onStepClick(idx)}
                disabled={!onStepClick || idx > activeStepIndex + 1}
                className={`flex items-center gap-2 px-2 py-1 transition-colors ${
                  isActive
                    ? 'text-teal-700'
                    : isCompleted
                    ? 'text-slate-700 hover:text-slate-900 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                    isActive
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : isCompleted
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-teal-700' : 'text-slate-400'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-xs ${isActive ? 'font-bold' : 'font-semibold'} whitespace-nowrap`}>${step.title.replace(/^\d{2}\s/, '')}</span>
                </div>
              </button>
              {idx < DISCOVERY_STEPS.length - 1 && (
                <div className="w-6 h-[1px] bg-slate-200 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
