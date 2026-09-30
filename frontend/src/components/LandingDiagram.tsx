
import React from 'react';

import { ArrowRight } from 'lucide-react';

export function LandingDiagram({ onStart }: { onStart?: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 overflow-auto p-8">
      

  
  <div className="w-full max-w-[1180px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 md:p-8 transition-all">
    
    
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Problem Statement 26130 • GovTech Workflow
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
          PramaanFlow — <span className="text-blue-700 font-extrabold">From Business Intent to Submission-Ready Evidence</span>
        </h1>
        <p className="text-xs md:text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
          <span>Prepare</span> • <span>Validate</span> • <span>Connect</span> • <span>Monitor</span>
        </p>
      </div>

      
      <div className="flex flex-col items-end gap-3">
        {onStart && (
          <button 
            onClick={onStart}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            Start Interactive Demo <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider px-1">Actors:</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100/70 text-sky-800 border border-sky-200/80">
          <span className="w-2 h-2 rounded-full bg-sky-600"></span> 1. Business User
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-300">
          <span className="w-2 h-2 rounded-full bg-amber-300"></span> 2. PramaanFlow (Core)
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> 3. CA / Consultant
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 4. Statutory Authority
        </span>
      </div>
      </div>
    </div>

    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative">
      
      
      <div className="lg:col-span-2 flex flex-col justify-between bg-sky-50/50 rounded-xl p-3.5 border border-sky-100 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="actor-pill text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Actor 1</span>
          <span className="text-[11px] font-bold text-sky-900">Applicant</span>
        </div>

        <div className="space-y-3 my-auto">
          
          <div className="bg-white rounded-lg p-3 border border-sky-200 shadow-sm text-center group hover:border-sky-400 transition-all">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
              👤
            </div>
            <div className="text-xs font-bold text-slate-800">Business User</div>
            <div className="text-[11px] text-slate-500 mt-0.5">MSME / Industry Applicant</div>
          </div>

          
          <div className="flex justify-center text-sky-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </div>

          
          <div className="bg-white rounded-lg p-3 border border-sky-200 shadow-sm text-center">
            <div className="text-xs font-bold text-slate-800">Business Profile & Intent</div>
            <p className="text-[10px] text-slate-500 mt-1 leading-snug">Sector, scale, plant location & proposed operations</p>
          </div>
        </div>

        
        <div className="hidden lg:flex items-center justify-end text-blue-500 pt-2 font-medium text-[11px]">
          Intake <span className="ml-1">➔</span>
        </div>
      </div>

      
      <div className="lg:col-span-6 bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-indigo-50/40 rounded-xl p-4 border-2 border-indigo-500/80 shadow-md relative flex flex-col justify-between">
        
        
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
            <span className="actor-pill text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-extrabold">Actor 2 • Core Engine</span>
            <span className="text-xs font-black text-indigo-950 tracking-tight">PramaanFlow Intelligence Platform</span>
          </div>
          <span className="text-[10px] font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
            Pre-Submission Shield
          </span>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 my-auto">
          
          
          <div className="bg-white rounded-lg p-3 border border-indigo-200/90 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs bg-indigo-100 text-indigo-700 w-5 h-5 rounded flex items-center justify-center font-bold">1</span>
                <span className="text-xs font-bold text-indigo-950 leading-tight">Requirement Intelligence</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-snug">
                Identifies applicable approvals, documents, inspections, renewals & subsidies automatically.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              <span className="inline-block text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Zero Guesswork</span>
            </div>
          </div>

          
          <div className="bg-white rounded-lg p-3 border border-indigo-200/90 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all relative">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs bg-indigo-100 text-indigo-700 w-5 h-5 rounded flex items-center justify-center font-bold">2</span>
                <span className="text-xs font-bold text-indigo-950 leading-tight">Validation & Readiness Check</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-snug">
                OCR extraction + statutory rule verification + cross-document consistency checks.
              </p>
              
              
              <div className="mt-2 flex items-center gap-1 text-[9px] font-semibold flex-wrap">
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">✓ Complete</span>
                <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">⚠ Gaps</span>
              </div>
            </div>

            
            <div className="mt-2 pt-2 border-t border-slate-100 text-[9px] text-indigo-700 font-medium flex items-center gap-1">
              <span>↻</span> Explain Gap + Auto-Rectify
            </div>
          </div>

          
          <div className="bg-indigo-600 text-white rounded-lg p-3 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 text-indigo-500/20 text-4xl select-none font-bold">✓</div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs bg-white text-indigo-700 w-5 h-5 rounded flex items-center justify-center font-bold">3</span>
                <span className="text-xs font-bold leading-tight">Submission-Ready Evidence Package</span>
              </div>
              <p className="text-[10px] text-indigo-100 leading-snug">
                Standardized dossier with verified signatures, formats, and tamper-evident metadata.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-indigo-500/60 flex items-center justify-between text-[9px]">
              <span className="text-amber-300 font-bold">100% Audit Ready</span>
              <span>Pass-through ➔</span>
            </div>
          </div>

        </div>

        
        <div className="mt-3 pt-2.5 border-t border-indigo-100/90 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/70 backdrop-blur-xs rounded-lg p-2.5 border border-amber-200/80">
          <div className="flex items-center gap-2">
            <span className="actor-pill text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Actor 3 (Optional)</span>
            <div className="text-[11px] font-bold text-slate-800">Need Expert CA / Consultant Assistance?</div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <span className="bg-amber-50 border border-amber-200 text-amber-900 font-medium px-2 py-0.5 rounded">
              Review • Assist • Prepare Complex Filings
            </span>
            <span className="text-indigo-600 font-semibold flex items-center">
              Re-integrates to Package ⤴
            </span>
          </div>
        </div>

      </div>

      
      <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50 rounded-xl p-3.5 border border-slate-200 relative">
        
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="actor-pill text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Actor 4</span>
            <span className="text-xs font-bold text-slate-900">Statutory Authority</span>
          </div>
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
            Statutory Mandate
          </span>
        </div>

        
        <div className="bg-blue-900 text-white rounded-lg p-2.5 text-center shadow-xs mb-2">
          <div className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Bridge Interface</div>
          <div className="text-xs font-bold mt-0.5">Existing Govt Portals & API Connectors</div>
          <div className="text-[9px] text-blue-200 mt-0.5">National Single Window / State Industrial Portals</div>
        </div>

        
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-2.5 mb-2">
          <div className="text-xs font-bold text-emerald-950 flex items-center justify-between">
            <span>Departmental Processing</span>
            <span className="text-[9px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded font-semibold">Statutory Authority</span>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1 text-[9px] font-semibold text-center text-emerald-900">
            <div className="bg-white p-1 rounded border border-emerald-200">Review</div>
            <div className="bg-white p-1 rounded border border-emerald-200">Query</div>
            <div className="bg-white p-1 rounded border border-emerald-200">Inspect</div>
            <div className="bg-white p-1 rounded border border-emerald-200">Decision</div>
            <div className="bg-emerald-700 text-white p-1 rounded font-bold">Certify</div>
          </div>
        </div>

        
        <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-extrabold uppercase text-slate-700 mb-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">✓</span> Post-Approval Lifecycle (PramaanFlow)
          </div>
          <div className="grid grid-cols-3 gap-1 text-[9px] text-center text-slate-700">
            <div className="bg-slate-50 p-1 rounded border border-slate-200">
              <span className="font-bold block text-slate-900">Renewal</span>
              Compliance Tracking
            </div>
            <div className="bg-slate-50 p-1 rounded border border-slate-200">
              <span className="font-bold block text-slate-900">Change</span>
              Impact Alerts
            </div>
            <div className="bg-slate-50 p-1 rounded border border-slate-200">
              <span className="font-bold block text-slate-900">Subsidies</span>
              Applicable Schemes
            </div>
          </div>
        </div>

      </div>

    </div>

    
    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-700">Key Takeaway for Jury:</span>
        <span>PramaanFlow does <strong className="text-slate-800">NOT</strong> replace statutory government portals; it eliminates rejection cycles by ensuring pre-submission evidence perfection.</span>
      </div>
      <div className="flex items-center gap-3 font-semibold text-slate-600">
        <span>⚡ 5-10s Glance Time</span>
        <span>•</span>
        <span>Slide Target: Half of 16:9 PPT</span>
      </div>
    </div>

  </div>


    </div>
  );
}
