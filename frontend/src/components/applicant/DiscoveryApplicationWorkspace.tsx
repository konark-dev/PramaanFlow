"use client";

import React, { useMemo, useState } from "react";
import { DiscoveryResult } from "./ApplicantDiscoveryFlow";
import { ProjectProfile, ResolvedLocation, generateRegulatoryRoadmap } from "@/lib/project-state";
import { ArrowLeft, CheckCircle2, Circle, AlertCircle, FileText, Upload, Check, Lock, ChevronRight, MessageSquare } from "lucide-react";
import { useDemoState } from "@/lib/context/DemoStateContext";

interface DiscoveryApplicationWorkspaceProps {
  discoveryResult: DiscoveryResult;
  initialApprovalId?: string;
  onBackToJourney: () => void;
}

export function DiscoveryApplicationWorkspace({ discoveryResult, initialApprovalId, onBackToJourney }: DiscoveryApplicationWorkspaceProps) {
  const { activeCase, updateCase, addMessage } = useDemoState();
  const profile = useMemo<ProjectProfile>(() => ({
    name: "New Enterprise",
    enterpriseName: "New Enterprise Pvt Ltd",
    sector: discoveryResult.businessType as any || "General Manufacturing",
    subSector: discoveryResult.subType || discoveryResult.businessType,
    activityDescription: "Setup a new industrial facility based on user input",
    capacity: 100,
    investmentCrores: 50,
  }), [discoveryResult]);

  const location = useMemo<ResolvedLocation>(() => ({
    lat: 18.7612,
    lng: 73.8542,
    displayAddress: discoveryResult.location,
    state: (discoveryResult.state as any) || "Maharashtra",
    district: discoveryResult.district || "Pune",
    taluka: "Khed",
    industrialArea: discoveryResult.location,
    insideIndustrialArea: discoveryResult.location.includes("Notified Industrial Estate") || discoveryResult.location.includes("MIDC"),
    planningAuthority: discoveryResult.location.includes("MIDC") ? "MIDC Special Planning Authority" : "Local Planning Authority",
    environmentalOffice: "MPCB Sub-Regional Office",
    localBody: "Local Authority",
  }), [discoveryResult]);

  const roadmap = activeCase.roadmap || useMemo(() => generateRegulatoryRoadmap(profile, location), [profile, location]);

  const [activeApprovalId, setActiveApprovalId] = useState<string>(
    initialApprovalId || roadmap.approvals[0]?.id
  );

  // Track form field inputs per approval
  const [formInputs, setFormInputs] = useState<Record<string, Record<string, string>>>({});

  const activeApproval = roadmap.approvals.find((a: any) => a.id === activeApprovalId) || roadmap.approvals[0];

  // Calculate dependency locks based on simple sequential assumption for the prototype UI
  // Real implementation would check backend state of dependency completions
  const isLocked = (id: string) => {
    const node = roadmap.approvals.find((a: any) => a.id === id);
    if (!node || !node.dependencies || node.dependencies.length === 0) return false;
    
    return node.dependencies.some((depId: string) => {
      const depNode = roadmap.approvals.find((a: any) => a.id === depId);
      if (!depNode) return false;
      return depNode.status !== 'Submitted' && depNode.status !== 'Approved';
    });
  };

  const activeApprovalLocked = isLocked(activeApproval.id);

  const toggleDoc = (idx: number) => {
    const docName = activeApproval.requiredDocuments[idx];
    const isAdding = !activeCase.documents.some(d => d.name === docName);
    
    if (isAdding) {
      updateCase({
        documents: [
          ...activeCase.documents,
          { id: `doc-${Date.now()}`, name: docName, status: 'Uploaded', requiredFor: [activeApproval.id], reusable: false, owner: 'Applicant' }
        ]
      });
    } else {
      updateCase({
        documents: activeCase.documents.filter(d => d.name !== docName)
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormInputs(prev => ({
      ...prev,
      [activeApproval.id]: {
        ...(prev[activeApproval.id] || {}),
        [field]: value
      }
    }));
  };

  const getDynamicFields = (appId: string) => {
    if (appId.includes("mpcb") || appId.includes("cte")) {
      return [
        { id: "production_capacity", label: "Production Capacity", type: "text", placeholder: "e.g., 100 TPD" },
        { id: "water_consumption", label: "Water Consumption (KLD)", type: "number", placeholder: "e.g., 50" },
        { id: "effluent_generation", label: "Effluent Generation (KLD)", type: "number", placeholder: "e.g., 40" }
      ];
    }
    if (appId.includes("fire")) {
      return [
        { id: "building_height", label: "Max Building Height (m)", type: "number", placeholder: "e.g., 15" },
        { id: "fire_pump_capacity", label: "Fire Pump Capacity (LPM)", type: "number", placeholder: "e.g., 2280" }
      ];
    }
    if (appId.includes("midc") || appId.includes("land")) {
      return [
        { id: "plot_area", label: "Requested Plot Area (Sq.M)", type: "number", placeholder: "e.g., 5000" },
        { id: "builtup_area", label: "Proposed Built-up Area (Sq.M)", type: "number", placeholder: "e.g., 2500" }
      ];
    }
    return [
      { id: "project_cost", label: "Project Cost / Value", type: "text", placeholder: "Enter value" }
    ];
  };

  const dynamicFields = getDynamicFields(activeApproval.id);
  const currentInputs = formInputs[activeApproval.id] || {};
  const currentDocs = activeApproval.requiredDocuments?.map((doc: string) => {
    return activeCase.documents.some(d => d.name === doc);
  }) || [];
  
  const filledFieldsCount = dynamicFields.filter((f: any) => currentInputs[f.id] && currentInputs[f.id].trim() !== "").length;
  const attachedDocsCount = activeApproval.requiredDocuments?.filter((_: any, idx: number) => currentDocs[idx]).length || 0;
  const totalDocsCount = activeApproval.requiredDocuments?.length || 0;

  const isFormComplete = filledFieldsCount === dynamicFields.length;
  const isDocsComplete = attachedDocsCount === totalDocsCount;
  const isReady = isFormComplete && (totalDocsCount === 0 || isDocsComplete) && !activeApprovalLocked;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Left Sidebar: Requirement Navigator */}
      <div className="w-80 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Workspace</div>
          <h2 className="font-extrabold text-slate-900">Application Tasks</h2>
        </div>
        <div className="p-3 space-y-2">
          {roadmap.approvals.map((approval: any, index: number) => {
            const num = (index + 1).toString().padStart(2, '0');
            const isActive = activeApprovalId === approval.id;
            const locked = isLocked(approval.id);
            
            // Derive a simplified status for the nav
            let statusLabel = "Ready";
            let StatusIcon = Circle;
            let statusColor = "text-slate-400";
            
            if (approval.status === 'Submitted' || approval.status === 'Approved') {
               statusLabel = approval.status;
               StatusIcon = CheckCircle2;
               statusColor = "text-teal-600";
            } else if (locked) {
               statusLabel = "Locked";
               StatusIcon = Lock;
               statusColor = "text-slate-400";
            } else if (isActive && (filledFieldsCount > 0 || attachedDocsCount > 0)) {
               statusLabel = "In Progress";
               StatusIcon = AlertCircle;
               statusColor = "text-amber-500";
            } else if (!locked && !isActive) {
               statusLabel = "Ready";
               StatusIcon = CheckCircle2;
               statusColor = "text-teal-600";
            }

            return (
              <div 
                key={approval.id}
                onClick={() => setActiveApprovalId(approval.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${isActive ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`font-mono text-xs mt-0.5 ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>{num}</span>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm leading-tight mb-1.5 ${isActive ? 'text-white' : 'text-slate-900'}`}>{approval.name}</h4>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className={`w-3 h-3 ${isActive && locked ? 'text-slate-400' : isActive ? 'text-teal-400' : statusColor}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {statusLabel}
                      </span>
                    </div>
                    {locked && approval.dependencies && approval.dependencies.length > 0 && (
                      <div className="text-[10px] text-amber-600 font-medium mt-1 leading-tight">
                        LOCKED - Complete {approval.dependencies[0]} before starting this application
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToJourney}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              title="Back to Regulatory Journey"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Application Workspace</div>
              <h1 className="font-extrabold text-slate-900 text-lg">Submission Form Builder</h1>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8">
          
          {/* Active Requirement Header */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded border border-teal-100 mb-2 inline-block">
                  Selected Requirement
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">{activeApproval.name}</h2>
                <p className="text-sm font-semibold text-slate-500 mt-1">{activeApproval.department}</p>
              </div>
              <div className="text-right flex flex-col sm:items-end gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {activeApprovalLocked ? "LOCKED (DEPENDENCIES PENDING)" : "VERIFICATION REQUIRED"}
                </span>
              </div>
            </div>
            
            {activeApprovalLocked && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">Application Locked</h4>
                  <p className="text-xs text-amber-800 mt-1">
                    Complete {activeApproval.dependencies.join(", ")} before starting this application.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 1: APPLICATION OVERVIEW */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
              Section 1 • Application Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Why this requirement applies</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{activeApproval.whyRequired?.gazetteExcerpt || "Applicable based on location and sector parameters."}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Statutory Basis</h4>
                  <p className="text-xs font-medium text-slate-700 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block">
                    {activeApproval.whyRequired?.statutoryAct}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dependencies</h4>
                  {activeApproval.dependencies && activeApproval.dependencies.length > 0 ? (
                    <ul className="text-xs text-slate-700">
                      {activeApproval.dependencies.map((d: string, i: number) => <li key={i}>• {d}</li>)}
                    </ul>
                  ) : (
                    <span className="text-xs text-slate-500">None. Can proceed independently.</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: PRE-FILLED INFORMATION */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>WHAT PRAMAANFLOW ALREADY KNOWS</span>
              <button onClick={onBackToJourney} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded border border-slate-200 uppercase tracking-wider transition-colors">Edit</button>
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-600 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider z-10">Already provided</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Intent</div>
                  <div className="text-xs font-semibold text-slate-800">{discoveryResult.intent}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Activity</div>
                  <div className="text-xs font-semibold text-slate-800">{discoveryResult.businessType}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</div>
                  <div className="text-xs font-semibold text-slate-800">{discoveryResult.state} → {discoveryResult.district}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scale / Capacity</div>
                  <div className="text-xs font-semibold text-slate-800">{discoveryResult.investment || "Standard"}</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: REQUIRED INFORMATION */}
          <section className={`space-y-3 ${activeApprovalLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
              WHAT IS STILL REQUIRED
            </h3>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Application Specific Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {dynamicFields.map(field => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">{field.label}</label>
                    <input 
                      type={field.type} 
                      placeholder={field.placeholder}
                      value={currentInputs[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow bg-slate-50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: DOCUMENTS / EVIDENCE */}
          <section className={`space-y-3 ${activeApprovalLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
              Section 4 • Documents / Evidence
            </h3>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Required Documents</h4>
              
              {activeApproval.requiredDocuments && activeApproval.requiredDocuments.length > 0 ? (
                <div className="space-y-3">
                  {activeApproval.requiredDocuments.map((doc: string, idx: number) => {
                    const isAdded = currentDocs[idx];
                    const docState = activeCase.documents.find(d => d.name === doc);
                    const isVerified = docState?.status === 'Verified';
                    
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200 gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div 
                            onClick={() => { if (!isVerified) toggleDoc(idx); }}
                            className={`mt-0.5 shrink-0 ${isVerified ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            {isAdded ? (
                              <CheckCircle2 className={`w-5 h-5 ${isVerified ? 'text-blue-500' : 'text-teal-600'}`} />
                            ) : (
                              <div className="w-5 h-5 rounded border-2 border-slate-300"></div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className={`text-sm font-medium break-words ${isAdded ? 'text-slate-900' : 'text-slate-700'}`}>{doc}</div>
                            <div className={`text-[10px] font-bold uppercase mt-0.5 tracking-wider ${isVerified ? 'text-blue-500' : (isAdded ? 'text-teal-600' : 'text-slate-400')}`}>
                              {isVerified ? 'Verified by CA' : (isAdded ? 'Added' : 'Required')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isAdded ? (
                            <>
                              <button className="whitespace-nowrap text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors">
                                View
                              </button>
                              {!isVerified && (
                                <button onClick={() => toggleDoc(idx)} className="whitespace-nowrap text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors">
                                  Remove
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button onClick={() => toggleDoc(idx)} className="whitespace-nowrap text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase tracking-wider transition-colors">
                                Add Document
                              </button>
                              <button onClick={() => toggleDoc(idx)} className="whitespace-nowrap text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 uppercase tracking-wider transition-colors">
                                <Upload className="w-3.5 h-3.5" /> Upload
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No additional documents required.</p>
              )}
            </div>
          </section>

          {/* SECTION 5: APPLICATION READINESS */}
          <section className="space-y-3 pb-20">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
              Section 5 • Application Readiness
            </h3>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg text-white">
              {(() => {
                const totalApprovals = roadmap.approvals.length;
                const completedApprovals = roadmap.approvals.filter((a: any) => a.status === 'APPROVED').length;
                
                const allRequiredDocs = new Set<string>();
                roadmap.approvals.forEach((a: any) => {
                  if (a.requiredDocuments) {
                    a.requiredDocuments.forEach((d: string) => allRequiredDocs.add(d));
                  }
                });
                const totalEvidenceNeeded = allRequiredDocs.size;
                const evidenceAvailable = activeCase.documents.filter((d: any) => allRequiredDocs.has(d.name)).length;
                
                const caApprovalsNeeded = roadmap.approvals.filter((a: any) => a.caRequired).length || 1; // fallback to 1 if caRequired flag is not heavily used in demo
                const professionalStatus = activeCase.caAssigned 
                  ? "CA Review Active" 
                  : `${caApprovalsNeeded} CA Review Required`;
                
                const isReady = (evidenceAvailable >= totalEvidenceNeeded) && !activeApprovalLocked && isFormComplete;
                
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Regulatory</div>
                      <div className="flex items-center gap-2">
                        {completedApprovals === totalApprovals ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
                        <span className="text-sm font-medium">{completedApprovals} / {totalApprovals} approvals completed</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Evidence</div>
                      <div className="flex items-center gap-2">
                        {evidenceAvailable >= totalEvidenceNeeded ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
                        <span className="text-sm font-medium">{evidenceAvailable} / {totalEvidenceNeeded} documents available</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Professional</div>
                      <div className="flex items-center gap-2">
                        {activeCase.caAssigned || caApprovalsNeeded === 0 ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <Lock className="w-5 h-5 text-rose-400" />}
                        <span className="text-sm font-medium">{professionalStatus}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Submission</div>
                      <div className="flex items-center gap-2">
                        {isReady ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <AlertCircle className="w-5 h-5 text-slate-500" />}
                        <span className={`text-sm font-bold ${isReady ? 'text-teal-400' : 'text-slate-400'}`}>
                          {isReady ? 'Ready for Submission' : 'Not Ready'}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-700">
                {activeCase.caAssigned ? (
                  <div className="flex flex-col w-full sm:w-1/2 bg-slate-800 rounded-lg p-3 max-h-32 overflow-y-auto border border-slate-700">
                    <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> CA Assistance Active
                    </div>
                    {activeCase.messages.map((m: any) => (
                      <div key={m.id} className={`text-xs mb-1 ${m.sender === 'ca' ? 'text-blue-300' : 'text-slate-400'}`}>
                        <span className="font-bold">{m.sender === 'ca' ? 'CA: ' : 'You: '}</span>
                        {m.text}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      updateCase({ caAssigned: true, caStatus: 'Reviewing' });
                      addMessage({ sender: 'applicant', text: `I need help preparing the application for ${activeApproval.name} and gathering documents.` });
                      alert("CA Assistance Requested. Switch to CA role to view requests.");
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-bold text-blue-300 hover:text-white hover:bg-blue-900 border border-blue-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Request CA Assistance
                  </button>
                )}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      updateCase({ 
                        applicantAnswers: { ...activeCase.applicantAnswers, ...currentInputs }
                      });
                      alert("Progress Saved!");
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                    Save Progress
                  </button>
                  <button 
                    disabled={!isReady}
                    onClick={() => {
                      const newRoadmap = { ...roadmap };
                      const targetApprovalIndex = newRoadmap.approvals.findIndex((a: any) => a.id === activeApproval.id);
                      if (targetApprovalIndex >= 0) {
                        newRoadmap.approvals[targetApprovalIndex].status = 'Submitted';
                      }
                      
                      updateCase({ 
                        applicantAnswers: { ...activeCase.applicantAnswers, ...currentInputs },
                        govStatus: 'Submitted',
                        roadmap: newRoadmap
                      });
                      
                      const nextUnlocked = newRoadmap.approvals.find((a: any) => a.status !== 'Submitted' && a.status !== 'Approved' && !a.dependencies.some((depId: string) => {
                          const depNode = newRoadmap.approvals.find((n: any) => n.id === depId);
                          return depNode && depNode.status !== 'Submitted' && depNode.status !== 'Approved';
                      }));
                      if (nextUnlocked) {
                         setActiveApprovalId(nextUnlocked.id);
                      }
                      
                      alert("Application Submitted Successfully!");
                    }}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${isReady ? 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-md' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                  >
                    Continue / Submit Application <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 6: ASSISTANCE / COMMUNICATIONS */}
          <section className="space-y-3 pb-20">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Section 6 • Assistance / Communications
            </h3>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {activeCase.messages.length === 0 ? (
                  <p className="text-sm text-slate-500 italic text-center mt-10">No messages yet. Send a message to your CA or Government official for assistance.</p>
                ) : (
                  activeCase.messages.map((msg, idx) => {
                    const isApplicant = msg.sender === 'applicant';
                    const isGov = msg.sender === 'government' || msg.sender === 'inspector';
                    return (
                      <div key={idx} className={`flex flex-col ${isApplicant ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isApplicant ? 'text-teal-600' : isGov ? 'text-indigo-600' : 'text-blue-600'}`}>
                            {msg.sender === 'ca' ? 'CA / Consultant' : msg.sender === 'government' ? 'Government Officer' : msg.sender === 'inspector' ? 'Field Inspector' : 'You'}
                          </span>
                          <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isApplicant ? 'bg-teal-50 text-teal-900 border border-teal-100 rounded-tr-sm' : isGov ? 'bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-tl-sm' : 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <input 
                  type="text"
                  id="applicant-msg-input"
                  placeholder="Type a message to your CA or Officer..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addMessage({ sender: 'applicant', text: e.currentTarget.value.trim() });
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('applicant-msg-input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      addMessage({ sender: 'applicant', text: input.value.trim() });
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-bold text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
