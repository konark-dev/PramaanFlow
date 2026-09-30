"use client";

import React from "react";
import { Check } from "lucide-react";

export const SOVEREIGN_STEPS = [
  "01 Intent",
  "02 Activity",
  "03 Project Profile",
  "04 Location",
  "05 Environment",
  "06 Labor",
  "07 Fiscal",
  "08 Forensics",
  "09 Gateway",
  "10 Handoff",
] as const;

export interface SovereignStepperProps {
  /** 0-indexed number representing the currently active step */
  currentStep: number;
  /** Array of completed step indices (0-indexed) */
  completedSteps: number[];
  /** Optional callback when a step is clicked */
  onStepClick?: (stepIndex: number) => void;
  /** Optional extra classes for styling container */
  className?: string;
}

export function SovereignStepper({
  currentStep,
  completedSteps = [],
  onStepClick,
  className = "",
}: SovereignStepperProps) {
  return (
    <div
      className={`w-full overflow-x-auto py-3 px-1 sm:px-2 scrollbar-thin ${className}`}
      role="navigation"
      aria-label="Sovereign Regulatory Process Steps"
    >
      <div className="flex items-start min-w-[980px] xl:min-w-full justify-between mx-auto">
        {SOVEREIGN_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.includes(index) && !isActive;
          const isFuture = !isActive && !isCompleted;
          const isLineCompleted =
            completedSteps.includes(index) && index !== currentStep;

          // Split step number (e.g. "01") and label text (e.g. "Intent")
          const firstSpaceIndex = step.indexOf(" ");
          const stepNum =
            firstSpaceIndex !== -1 ? step.slice(0, firstSpaceIndex) : `${index + 1}`;
          const stepLabel =
            firstSpaceIndex !== -1 ? step.slice(firstSpaceIndex + 1) : step;

          const isClickable = Boolean(onStepClick);

          return (
            <div
              key={step}
              className="flex-1 min-w-[95px] max-w-[145px] flex flex-col items-center relative group shrink-0"
            >
              {/* Connector line leading to the next step */}
              {index < SOVEREIGN_STEPS.length - 1 && (
                <div
                  className={`absolute left-1/2 w-full top-3.5 -translate-y-1/2 pointer-events-none ${
                    isLineCompleted
                      ? "h-0.5 bg-emerald-500"
                      : "border-t-2 border-dashed border-slate-300 h-0"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step Interactive Container */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(index)}
                className={`w-full flex flex-col items-center focus:outline-hidden ${
                  isClickable
                    ? "cursor-pointer hover:opacity-90 transition-opacity"
                    : "cursor-default"
                }`}
              >
                {/* Step Circle Indicator */}
                <div className="relative mb-2 flex items-center justify-center">
                  <div
                    className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                      isCompleted
                        ? "border-2 border-emerald-600 bg-emerald-50 text-emerald-600 shadow-xs"
                        : isActive
                        ? "border-2 border-amber-500 bg-amber-400 text-slate-950 font-extrabold ring-4 ring-amber-100 shadow-xs"
                        : "border border-slate-300 bg-slate-100 text-slate-400 font-semibold"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                </div>

                {/* Step Label Text */}
                <div className="text-center px-1 mb-1.5 flex flex-col items-center">
                  <span
                    className={`text-xs tracking-tight whitespace-nowrap transition-colors ${
                      isActive
                        ? "font-bold text-slate-900"
                        : isCompleted
                        ? "font-semibold text-slate-700"
                        : "font-medium text-slate-400"
                    }`}
                  >
                    <span className="text-slate-400 font-mono text-[11px] mr-1">
                      {stepNum}
                    </span>
                    <span>{stepLabel}</span>
                  </span>
                </div>

                {/* Status Badge Below */}
                <div className="h-5 flex items-center justify-center">
                  {isCompleted && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      VERIFIED
                    </span>
                  )}
                  {isActive && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300 font-semibold shadow-xs">
                      GEOSPATIAL AUDIT
                    </span>
                  )}
                  {isFuture && (
                    <span
                      className="w-5 border-b-2 border-dashed border-slate-300 inline-block"
                      aria-label="Pending step"
                    />
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
