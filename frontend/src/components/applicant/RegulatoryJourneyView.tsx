"use client";

import React, { useMemo, useState } from "react";
import { DiscoveryResult } from "./ApplicantDiscoveryFlow";
import { ProjectProfile, ResolvedLocation, generateRegulatoryRoadmap } from "@/lib/project-state";
import { ChevronRight, Check, AlertCircle, ArrowRight, ShieldAlert, ChevronDown, ChevronUp, Link as LinkIcon, Square, CheckSquare, Upload, Sparkles } from "lucide-react";

interface RegulatoryJourneyViewProps {
  discoveryResult: DiscoveryResult;
  precomputedRoadmap: any;
  geoContext?: any;
  onProceedToWorkspace: (approvalId?: string) => void;
  onEditAnswers?: () => void;
}

export function RegulatoryJourneyView({ discoveryResult, precomputedRoadmap, geoContext, onProceedToWorkspace, onEditAnswers }: RegulatoryJourneyViewProps) {
  const roadmap = precomputedRoadmap;

  const [expandedCard, setExpandedCard] = useState<string | null>(roadmap.approvals[0]?.id || null);
  
  // Track selected state of required evidence docs: { approvalId: { docIndex: boolean } }
  const [selectedDocs, setSelectedDocs] = useState<Record<string, Record<number, boolean>>>({});

  const toggleCard = (id: string) => {
    setExpandedCard(prev => prev === id ? null : id);
  };

  const toggleDoc = (approvalId: string, docIndex: number) => {
    setSelectedDocs(prev => ({
      ...prev,
      [approvalId]: {
        ...(prev[approvalId] || {}),
        [docIndex]: !(prev[approvalId]?.[docIndex])
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 text-slate-900 font-sans">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header / Nav */}
        <header className="flex flex-col items-center space-y-6 pb-6 border-b border-slate-200">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">PRAMAANFLOW</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span className="text-teal-700 flex items-center gap-1"><Check className="w-3 h-3" /> Business Intent</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-teal-700 flex items-center gap-1"><Check className="w-3 h-3" /> Business Activity</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-teal-700 flex items-center gap-1"><Check className="w-3 h-3" /> Sub-Activity</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-teal-700 flex items-center gap-1"><Check className="w-3 h-3" /> Location</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-teal-700 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-600 inline-block" /> Regulatory Journey</span>
          </div>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center sm:text-left">
              Your Regulatory Journey
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl text-center sm:text-left">
              Based on the information you provided, PramaanFlow has identified the following potentially applicable requirements. Please review these steps carefully.
            </p>
          </div>

          {/* Compact Input Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Intent</span>
                <span className="text-sm font-semibold text-slate-800">{discoveryResult.intent}</span>
              </div>
              <div className="flex flex-col gap-1 sm:border-l border-slate-200 sm:pl-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activity</span>
                <span className="text-sm font-semibold text-slate-800">{discoveryResult.businessType}</span>
                <span className="text-xs text-slate-500">{discoveryResult.subType}</span>
              </div>
              <div className="flex flex-col gap-1 sm:border-l border-slate-200 sm:pl-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                <span className="text-sm font-semibold text-slate-800">{discoveryResult.state} → {discoveryResult.district}</span>
                <span className="text-xs text-slate-500">{discoveryResult.location}</span>
              </div>
              <div className="flex flex-col gap-1 sm:border-l border-slate-200 sm:pl-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scale / Capacity</span>
                <span className="text-sm font-semibold text-slate-800">{discoveryResult.investment || "Standard"}</span>
                <span className="text-xs text-slate-500">{discoveryResult.capacity || "N/A"}</span>
              </div>
            </div>
            {onEditAnswers && (
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button 
                  type="button"
                  onClick={onEditAnswers}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  Change Answers
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Regulatory Journey Requirements */}
        <div className="space-y-5 pt-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-teal-700" /> Potentially Applicable Clearances
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              These clearances require verification based on your exact engineering plans.
            </p>
          </div>

          <div className="relative pt-2 pb-4">
            {/* Vertical timeline line connecting the cards */}
            <div className="absolute top-0 bottom-0 left-[26px] sm:left-[38px] w-0.5 bg-slate-200 z-0 hidden sm:block"></div>

            <div className="space-y-4">
              {roadmap.approvals.map((approval: any, index: number) => {
                const isExpanded = expandedCard === approval.id;
                const numberLabel = (index + 1).toString().padStart(2, '0');
                const hasDependencies = approval.dependencies && approval.dependencies.length > 0;
                
                // Map dependency IDs to structured info
                const mappedDeps = approval.dependencies.map((depId: string) => {
                  const depIndex = roadmap.approvals.findIndex((a: any) => a.id === depId);
                  const found = roadmap.approvals[depIndex];
                  return {
                    name: found ? found.name : depId,
                    num: depIndex >= 0 ? (depIndex + 1).toString().padStart(2, '0') : '--'
                  };
                });

                return (
                  <div key={approval.id} className="relative z-10 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                    {/* Compact Header (Always visible) */}
                    <div 
                      onClick={() => toggleCard(approval.id)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-slate-100 text-slate-600 text-xs font-bold w-9 h-9 rounded flex items-center justify-center shrink-0 border border-slate-200 shadow-sm z-10 relative mt-0.5">
                          {numberLabel}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <h4 className="text-base font-extrabold text-slate-900 tracking-tight">{approval.name}</h4>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{approval.department}</p>
                          
                          {/* Dependencies shown in collapsed view */}
                          {!isExpanded && hasDependencies && (
                            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 pt-1">
                              <LinkIcon className="w-3 h-3 text-slate-400" />
                              Depends on: {mappedDeps[0].name} {mappedDeps.length > 1 ? `+ ${mappedDeps.length - 1} more` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto pl-13 sm:pl-0">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 text-right">
                          {/* Classification Badge (Secondary) */}
                          {approval.riskLevel === "HIGH" && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1 opacity-80">
                              <ShieldAlert className="w-3 h-3" /> High Risk
                            </span>
                          )}
                          {/* Workflow Status Badge (Primary) */}
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                            {approval.status === "PENDING_SUBMISSION" ? "Requires Action" : "Verification Required"}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-5 pt-4 border-t border-slate-100 bg-slate-50/50 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-3">
                          
                          {/* Left Column: Context & Rationale */}
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Why it may apply</h5>
                              <p className="text-sm text-slate-700 leading-relaxed">
                                {approval.whyRequired?.gazetteExcerpt || "Applicable based on location and sector parameters provided in your discovery flow."}
                              </p>
                            </div>
                            
                            {approval.whyRequired?.statutoryAct && (
                              <div className="space-y-2">
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statutory Basis</h5>
                                <p className="text-xs font-medium text-slate-600 font-mono">
                                  {approval.whyRequired.statutoryAct}, {approval.whyRequired.section}
                                </p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dependency</h5>
                              {hasDependencies ? (
                                <div className="text-sm text-slate-700 space-y-1.5">
                                  <ul className="space-y-1.5">
                                    {mappedDeps.map((dep: any, idx: number) => (
                                      <li key={idx} className="text-slate-800 text-xs flex items-center gap-1.5">
                                        <span className="font-semibold text-slate-600">Depends on</span>
                                        <span className="font-mono text-[10px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded">{dep.num}</span>
                                        <span className="font-medium text-slate-700">· {dep.name}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                                  Can proceed independently
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Column: Evidence & Action */}
                          <div className="space-y-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8 flex flex-col">
                            <div className="space-y-3 flex-1">
                              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Evidence</h5>
                              {approval.requiredDocuments && approval.requiredDocuments.length > 0 ? (
                                <ul className="space-y-2.5">
                                  {approval.requiredDocuments.map((doc: any, idx: number) => {
                                    const isDocSelected = selectedDocs[approval.id]?.[idx] || false;
                                    return (
                                      <li key={idx} className="flex flex-col gap-2">
                                        <div 
                                          onClick={() => toggleDoc(approval.id, idx)}
                                          className={`flex items-start gap-2.5 cursor-pointer p-2 -ml-2 rounded-lg transition-colors ${isDocSelected ? 'hover:bg-slate-100' : 'hover:bg-slate-100'}`}
                                        >
                                          <div className="mt-0.5 shrink-0 text-slate-400">
                                            {isDocSelected ? <CheckSquare className="w-4 h-4 text-teal-600" /> : <Square className="w-4 h-4" />}
                                          </div>
                                          <span className={`text-xs leading-snug transition-colors ${isDocSelected ? 'font-semibold text-teal-900' : 'font-medium text-slate-700'}`}>
                                            {doc}
                                          </span>
                                        </div>
                                        {/* Document Action appearing inline when selected */}
                                        {isDocSelected && (
                                          <div className="pl-6 animate-in fade-in slide-in-from-top-1">
                                            <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 px-3 py-1.5 rounded-md shadow-sm transition-colors uppercase tracking-wider cursor-pointer">
                                              <Upload className="w-3 h-3" /> Add / Upload Document
                                            </button>
                                          </div>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <p className="text-xs text-slate-500 italic">No specific documents listed.</p>
                              )}
                            </div>
                            
                            <div className="pt-5 border-t border-slate-100 space-y-3">
                              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Next Action</h5>
                              <button 
                                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg bg-slate-900 hover:bg-teal-700 text-white font-bold text-sm transition-colors shadow-sm cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onProceedToWorkspace(approval.id);
                                }}
                              >
                                Prepare Application <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Government Support & Incentives */}
        <div className="space-y-5 pt-8 border-t border-slate-200 mt-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Government Support &amp; Incentives
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Based on your business profile, location, and scale, you may be eligible for the following support schemes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col gap-2 hover:border-amber-400 transition-colors cursor-pointer">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded inline-block w-fit">Capital Subsidy</span>
              <h4 className="font-bold text-slate-800 text-sm">Package Scheme of Incentives (PSI)</h4>
              <p className="text-xs text-slate-600">Eligible for up to 30% capital subsidy on fixed investment based on your location in a developing industrial zone.</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col gap-2 hover:border-amber-400 transition-colors cursor-pointer">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded inline-block w-fit">Power Benefit</span>
              <h4 className="font-bold text-slate-800 text-sm">Electricity Duty Exemption</h4>
              <p className="text-xs text-slate-600">As a new industrial unit, you are exempt from electricity duty for a period of 5 years from commencement.</p>
            </div>
          </div>
        </div>

        <div className="pt-10 pb-16 flex justify-center border-t border-slate-200 mt-8">
          <button 
            onClick={() => onProceedToWorkspace()}
            className="flex items-center gap-2 py-4 px-8 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Proceed to Application Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

