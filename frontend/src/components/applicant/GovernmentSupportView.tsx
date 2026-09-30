"use client";

import React from "react";
import { useDemoState } from "@/lib/context/DemoStateContext";
import { Award, CheckCircle2, ChevronRight, FileText, Briefcase, ExternalLink, ShieldCheck } from "lucide-react";

export function GovernmentSupportView() {
  const { activeCase } = useDemoState();
  const schemes = activeCase?.governmentSupport || [];

  if (schemes.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">No Support Schemes Identified</h3>
        <p className="text-slate-500 mt-2">Complete your project profile to see applicable government subsidies and support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30 uppercase tracking-wide">
              Financial Assistance
            </span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Government Support & Schemes
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            Based on your project's sector, investment, and location, we have identified {schemes.length} potential schemes that can provide financial subsidies or operational benefits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {schemes.map((scheme, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-teal-300 transition-colors">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase mb-2 inline-block">
                  {scheme.type}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{scheme.title}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{scheme.source}</span>
                </div>
              </div>
              <button className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors flex items-center gap-1">
                Apply Now <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Why this may apply
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {scheme.whyApplies}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Eligibility
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    {scheme.eligibility}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Evidence Needed
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    {scheme.evidenceNeeded}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
