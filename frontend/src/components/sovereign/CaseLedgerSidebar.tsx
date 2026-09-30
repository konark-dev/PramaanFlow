"use client";

import React, { useState } from "react";
import { Shield, Lock, Check, Copy, CheckCheck } from "lucide-react";

export interface CaseData {
  intent?: string;
  activity?: string;
  scale?: string;
  location?: string;
  district?: string;
  pollutionCategory?: string;
  nicCode?: string;
}

export interface CaseLedgerSidebarProps {
  caseData?: CaseData;
  className?: string;
}

export function CaseLedgerSidebar({ caseData, className = "" }: CaseLedgerSidebarProps) {
  const [copied, setCopied] = useState(false);
  const ledgerHash = "#0x8F91...4872";
  const fullHash = "0x8F91c7a82b9e4a33d1c074f762e84d28e7d84872";

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(fullHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`w-full h-full flex flex-col bg-white p-6 space-y-6 text-slate-800 ${className}`}
      aria-label="Case Ledger Facts"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          PROJECT PROFILE
        </h2>
      </div>

      {/* 01 STATUTORY INTENT */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            INTENT
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-700">
            <Check className="w-3 h-3" />
            Verified
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          {caseData?.intent || "Industrial Establishment"}
        </p>
      </div>

      {/* 02 BUSINESS ACTIVITY */}
      <div className="space-y-1 pt-1 border-t border-slate-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          ACTIVITY
        </span>
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          {caseData?.activity || "Agro-Processing & Extraction"}
        </p>
        <p className="text-xs text-slate-500 font-medium">
          {caseData?.nicCode
            ? (caseData.nicCode.startsWith("NIC Code:") ? caseData.nicCode : `NIC Code: ${caseData.nicCode}`)
            : "NIC Code: 10402 (Vegetable Oils)"}
        </p>
      </div>

      {/* 03 OPERATIONAL SCALE */}
      <div className="space-y-1 pt-1 border-t border-slate-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          SCALE & CAPACITY
        </span>
        <p className="text-sm font-semibold text-slate-900 leading-none tracking-tight mt-1">
          {caseData?.scale || "25,000 L/Day"}
        </p>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {caseData?.pollutionCategory
            ? (caseData.pollutionCategory.startsWith("Pollution Cat:")
                ? caseData.pollutionCategory
                : `Pollution Cat: ${caseData.pollutionCategory}`)
            : "Pollution Cat: Orange (CPCB 2016)"}
        </p>
      </div>

      {/* 04 LOCATION PROFILE */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          LOCATION
        </span>
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          {caseData?.location || "Plot B-42, MIDC Chakan"}
        </p>
        <p className="text-xs text-slate-500 font-medium mb-2">
          {caseData?.district || "Taluka Khed, Pune, MH"}
        </p>
        <div className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
          Zone: MIDC II
        </div>
      </div>
    </div>
  );
}
