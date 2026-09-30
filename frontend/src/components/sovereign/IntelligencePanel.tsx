"use client";

import React from "react";
import { Rocket, ShieldCheck, Check } from "lucide-react";

export interface IntelligencePanelProps {
  onViewRoadmap?: () => void;
  className?: string;
}

interface ImplicationCardData {
  id: number;
  title: string;
  badge: {
    label: string;
    bg: string;
    text: string;
  };
  body: string;
}

const IMPLICATION_CARDS: ImplicationCardData[] = [
  {
    id: 1,
    title: "Land Use Clearance",
    badge: {
      label: "EXEMPT",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
    },
    body: "Pre-cleared by MIDC Industrial Masterplan. Agricultural Land Conversion (NA/CLU) EXEMPT under Sec 44A MLRC.",
  },
  {
    id: 2,
    title: "Local Municipal Authority",
    badge: {
      label: "SPA ROUTE",
      bg: "bg-blue-100",
      text: "text-blue-800",
    },
    body: "Chakan Municipal Council NOC bypassed; MIDC Special Planning Authority (SPA) Building Plan approval applies exclusively.",
  },
  {
    id: 3,
    title: "Environmental Sensitivity",
    badge: {
      label: "CAT B2",
      bg: "bg-amber-100",
      text: "text-amber-800",
    },
    body: "Outside Western Ghats ESA boundary. Category B2 clearance applicable under SEIA Maharashtra without public hearing requirement.",
  },
  {
    id: 4,
    title: "Fire Safety NOC",
    badge: {
      label: "PROVISIONAL",
      bg: "bg-rose-100",
      text: "text-rose-800",
    },
    body: "MIDC Regional Fire Officer Provisional Fire NOC required prior to construction plinth verification.",
  },
];

export function IntelligencePanel({
  onViewRoadmap,
  className = "",
}: IntelligencePanelProps): React.ReactElement {
  return (
    <div
      className={`bg-white h-full p-6 flex flex-col gap-4 text-slate-800 w-full ${className}`}
      aria-label="Geospatial Intelligence Panel"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
          GEOSPATIAL INTELLIGENCE
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Verification
        </span>
      </div>

      {/* Subheading */}
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Identified Location Implications
        </h3>
      </div>

      {/* 4 Numbered Cards */}
      <div className="flex flex-col gap-3">
        {IMPLICATION_CARDS.map((card) => (
          <div
            key={card.id}
            className="bg-slate-50/80 border border-slate-200/80 rounded-lg p-3 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[11px] font-bold text-slate-700 shrink-0 shadow-xs">
                  {card.id}
                </span>
                <span className="text-xs font-bold text-slate-900 truncate">
                  {card.title}
                </span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase shrink-0 ${card.badge.bg} ${card.badge.text}`}
              >
                {card.badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-7">
              {card.body}
            </p>
          </div>
        ))}
      </div>

      {/* Highlighted Section: Why This Matters & Next Step */}
      <div className="border-l-4 border-l-emerald-500 bg-emerald-50/60 p-4 rounded-r-lg border-y border-r border-emerald-100/80 space-y-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            WHY THIS MATTERS
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Locating inside a notified industrial estate reduces{" "}
          <strong className="font-bold text-slate-900">4 statutory approvals</strong>{" "}
          and shortens overall approval turnaround by{" "}
          <strong className="font-bold text-slate-900">60 days</strong>.
        </p>

        <div className="pt-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            NEXT STEP
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Proceed to view consolidated Regulatory Intelligence Master Journey.
          </p>

          <button
            type="button"
            onClick={onViewRoadmap}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Master Statutory Roadmap &gt;</span>
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>MIDC Act, 1961 § 32</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
          CERTIFIED
        </span>
      </div>
    </div>
  );
}
