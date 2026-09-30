"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DemoStateProvider, useDemoState } from "@/lib/context/DemoStateContext";
import { GovernmentWorkspace } from "@/components/gov/GovernmentWorkspace";
import { InspectorWorkspace } from "@/components/InspectorWorkspace";
import { CAWorkspace } from "@/components/ca/CAWorkspace";
import { AICopilotModal } from "@/components/AICopilotModal";
import { ApplicantDiscoveryFlow, DiscoveryResult } from "@/components/applicant/ApplicantDiscoveryFlow";
import { RegulatoryJourneyView } from "@/components/applicant/RegulatoryJourneyView";
import { DiscoveryApplicationWorkspace } from "@/components/applicant/DiscoveryApplicationWorkspace";
import { IntelligenceAnalysisEngine } from "@/components/applicant/IntelligenceAnalysisEngine";
import { LandingDiagram } from "@/components/LandingDiagram";
import { EvidenceVaultChecklist } from "@/components/applicant/EvidenceVaultChecklist";
import { ApplicantCommunication } from "@/components/applicant/ApplicantCommunication";
import { SovereignLayout } from "@/components/sovereign/SovereignLayout";

function ProjectDetailsForm({
  initialValues,
  onSave,
}: {
  initialValues: Record<string, any>;
  onSave: (values: Record<string, any>) => void;
}) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [saved, setSaved] = useState(false);

  const fields = [
    { key: "projectName", label: "Project name", placeholder: "e.g. Chakan Edible Oil Refinery" },
    { key: "promoterName", label: "Promoter / authorized signatory", placeholder: "Full name" },
    { key: "businessType", label: "Primary activity", placeholder: "e.g. Food processing" },
    { key: "subType", label: "Specific activity", placeholder: "e.g. Edible oil extraction and refining" },
    { key: "capacity", label: "Installed capacity", placeholder: "e.g. 25,000 litres/day" },
    { key: "investment", label: "Proposed investment", placeholder: "e.g. ₹8.5 crore" },
    { key: "employees", label: "Expected employees", placeholder: "e.g. 120" },
    { key: "landArea", label: "Land area", placeholder: "e.g. 2.5 acres" },
    { key: "powerRequirement", label: "Power requirement", placeholder: "e.g. 350 kVA" },
    { key: "waterUsage", label: "Water requirement", placeholder: "e.g. 15,000 litres/day" },
    { key: "location", label: "Project site address", placeholder: "Plot, industrial area, district" },
    { key: "district", label: "District", placeholder: "e.g. Pune" },
  ];

  return (
    <section className="max-w-5xl mx-auto py-8">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Project workspace</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Project Details</h1>
      <p className="mt-3 text-slate-600">Maintain the project profile used to prepare applications, determine jurisdiction, and assign the right approvals.</p>
      <form
        className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(values);
          setSaved(true);
        }}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map(({ key, label, placeholder }) => (
            <label key={key} className={key === "location" ? "md:col-span-2" : ""}>
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
              <input
                value={values[key] ?? ""}
                placeholder={placeholder}
                onChange={(event) => {
                  setValues((current) => ({ ...current, [key]: event.target.value }));
                  setSaved(false);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <button type="submit" className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Save project details</button>
          {saved && <span className="text-sm font-medium text-emerald-700">Project details saved.</span>}
        </div>
      </form>
    </section>
  );
}

function MainApp() {
  const { activeRole, activeCase, updateCase, setActiveRole, activeTab, setActiveTab } = useDemoState();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const [hasStartedDemo, setHasStartedDemo] = useState(!!activeCase.discoveryResult);
  const [hasCompletedDiscovery, setHasCompletedDiscovery] = useState(!!activeCase.discoveryResult);
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState(!!activeCase.roadmap);
  const [hasViewedJourney, setHasViewedJourney] = useState(!!activeCase.roadmap);
  const [targetApprovalId, setTargetApprovalId] = useState<string | undefined>();
  const [draftAnswers, setDraftAnswers] = useState<Record<string, any>>({});
  const [discoveryStepIndex, setDiscoveryStepIndex] = useState(0);

  useEffect(() => {
    const hasDiscovery = Boolean(activeCase.discoveryResult);
    const hasAnalysis = Boolean(activeCase.roadmap);

    setHasStartedDemo(hasDiscovery);
    setHasCompletedDiscovery(hasDiscovery);
    setHasCompletedAnalysis(hasAnalysis);
    setHasViewedJourney(hasAnalysis);
  }, [activeCase.discoveryResult, activeCase.roadmap]);
  const handleDiscoveryComplete = (result: DiscoveryResult) => {
    updateCase({ discoveryResult: result });
    setHasCompletedDiscovery(true);
  };

  const handleJourneyProceed = (approvalId?: string) => {
    if (approvalId) setTargetApprovalId(approvalId);
    setHasViewedJourney(true);
  };

  // Derive which step of the 10-step journey we're on
  const currentStep = useMemo(() => {
    if (!hasCompletedDiscovery) return discoveryStepIndex; // 0, 1, 2, 3 mapped from wizard
    if (!hasCompletedAnalysis) return 4;  // Step 05 Environment
    if (!hasViewedJourney) return 5;      // Step 06 Labor
    return 6;                              // Step 07+
  }, [hasCompletedDiscovery, discoveryStepIndex, hasCompletedAnalysis, hasViewedJourney]);

  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    if (!hasCompletedDiscovery) {
      for (let i = 0; i < discoveryStepIndex; i++) completed.push(i);
      return completed;
    }
    completed.push(0, 1, 2, 3); // All wizard steps complete
    if (hasCompletedAnalysis) { completed.push(4); }  // Environment
    if (hasViewedJourney) { completed.push(5); }      // Labor
    return completed;
  }, [hasCompletedDiscovery, discoveryStepIndex, hasCompletedAnalysis, hasViewedJourney]);

  // Build case data for the left sidebar from discovery answers (or live draft answers)
  const caseData = useMemo(() => {
    const dr = activeCase.discoveryResult || draftAnswers;
    const subType = dr?.subType || dr?.subType_food || dr?.subType_mining;
    return {
      intent: dr?.intent || "Pending Input...",
      activity: subType || dr?.businessType || "Pending Input...",
      scale: dr?.capacity || dr?.scale || "Pending Input...",
      location: dr?.location || "Pending Input...",
      district: dr?.district || "Pending Input...",
      pollutionCategory: dr?.category === "Green" ? "Green (CPCB)" : (subType ? "Orange (CPCB 2016)" : "Pending..."),
      nicCode: dr?.businessType === "Mining & Quarrying" ? "0810 (Quarrying of stone)" : (subType ? "10402 (Vegetable Oils)" : "Pending..."),
    };
  }, [activeCase.discoveryResult, draftAnswers]);

  // LANDING PAGE REMOVED: Go straight into Applicant flow

  // Determine the main content area based on current flow state
  // TAB-SPECIFIC routes come FIRST so clicking a tab always works
  let mainContent: React.ReactNode = null;

  if (activeRole === "applicant" && (activeTab === "Evidence Vault" || activeTab === "Document Review")) {
    mainContent = <EvidenceVaultChecklist />;
  } else if (activeRole === "applicant" && (activeTab === "Messages" || activeTab === "Communication")) {
    mainContent = <ApplicantCommunication />;
  } else if (activeRole === "applicant" && activeTab === "AI Copilot") {
    mainContent = (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Pramaan AI Copilot</h2>
          <p className="text-slate-500 text-sm mb-6">Your intelligent regulatory assistant is ready to help.</p>
          <button onClick={() => setIsCopilotOpen(true)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Launch AI Assistant</button>
        </div>
      </div>
    );
  } else if (activeRole === "applicant" && activeTab === "Regulatory Roadmap") {
    if (!activeCase.discoveryResult) {
      mainContent = (
        <section className="max-w-4xl mx-auto py-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Approval planning</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Regulatory Roadmap</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Your roadmap will sequence approvals, authorities, documents, fees, and statutory timelines for this project.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["1", "Classify the project", "Identify the activity, capacity, and site."],
              ["2", "Map jurisdictions", "Determine the authorities that apply."],
              ["3", "Generate the roadmap", "Build the approval sequence and evidence plan."],
            ].map(([step, title, description]) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{step}</span>
                <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-slate-900">Project classification is required before a roadmap can be generated.</p>
            <button type="button" onClick={() => setActiveTab("Client Dashboard")} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Complete project intake</button>
          </div>
        </section>
      );
    } else if (!activeCase.roadmap) {
      mainContent = (
        <IntelligenceAnalysisEngine
          discoveryResult={activeCase.discoveryResult}
          onAnalysisComplete={(roadmap, geo, governmentSupport) => {
            updateCase({ roadmap, geoContext: geo, governmentSupport });
            setHasCompletedAnalysis(true);
          }}
        />
      );
    } else {
      mainContent = (
        <RegulatoryJourneyView
          discoveryResult={activeCase.discoveryResult}
          precomputedRoadmap={activeCase.roadmap}
          geoContext={activeCase.geoContext}
          onProceedToWorkspace={handleJourneyProceed}
          onEditAnswers={() => {
            setHasCompletedDiscovery(false);
            setHasCompletedAnalysis(false);
          }}
        />
      );
    }
  } else if (activeRole === "applicant" && activeTab === "Project Details") {
    mainContent = (
      <ProjectDetailsForm
        initialValues={{ ...draftAnswers, ...activeCase.applicantAnswers, ...activeCase.discoveryResult }}
        onSave={(applicantAnswers) => {
          updateCase({ applicantAnswers });
          setDraftAnswers(applicantAnswers);
        }}
      />
    );
  } else if (activeRole === "applicant" && (activeTab === "Dashboard" || activeTab === "Client Dashboard" || !activeTab)) {
    // Dashboard = default applicant view — show workspace if discovery done, else show discovery flow
    if (!hasCompletedDiscovery) {
      mainContent = <ApplicantDiscoveryFlow onComplete={handleDiscoveryComplete} onChange={setDraftAnswers} onStepChange={setDiscoveryStepIndex} />;
    } else if (hasCompletedDiscovery && !hasCompletedAnalysis && activeCase.discoveryResult) {
      mainContent = (
        <IntelligenceAnalysisEngine
          discoveryResult={activeCase.discoveryResult}
          onAnalysisComplete={(roadmap, geo, governmentSupport) => {
            updateCase({ roadmap, geoContext: geo, governmentSupport });
            setHasCompletedAnalysis(true);
          }}
        />
      );
    } else if (hasCompletedDiscovery && hasCompletedAnalysis && !hasViewedJourney && activeCase.discoveryResult) {
      mainContent = (
        <RegulatoryJourneyView
          discoveryResult={activeCase.discoveryResult}
          precomputedRoadmap={activeCase.roadmap}
          geoContext={activeCase.geoContext}
          onProceedToWorkspace={handleJourneyProceed}
          onEditAnswers={() => {
            setHasCompletedDiscovery(false);
            setHasCompletedAnalysis(false);
          }}
        />
      );
    } else if (activeCase.discoveryResult) {
      mainContent = (
        <DiscoveryApplicationWorkspace
          discoveryResult={activeCase.discoveryResult}
          initialApprovalId={targetApprovalId}
          onBackToJourney={() => {
            setHasViewedJourney(false);
            setTargetApprovalId(undefined);
          }}
        />
      );
    }
  } else if (activeRole === "ca") {
    mainContent = <CAWorkspace />;
  } else if (activeRole === "government") {
    mainContent = <GovernmentWorkspace />;
  } else if (activeRole === "inspector") {
    mainContent = <InspectorWorkspace />;
  }

  let hideSidebars = false;
  if (activeRole === "applicant") {
    if (activeTab === "Project Details" || activeTab === "Evidence Vault" || activeTab === "Document Review" || activeTab === "Communication" || activeTab === "Messages" || activeTab === "AI Copilot") {
      hideSidebars = true;
    }
    // Also hide if on Dashboard but rendering the Workspace
    if ((activeTab === "Dashboard" || !activeTab) && hasCompletedDiscovery && hasCompletedAnalysis && hasViewedJourney && activeCase.discoveryResult) {
      hideSidebars = true;
    }
  }

  return (
    <>
      <SovereignLayout
        activeRole={activeRole}
        onRoleChange={(role) => setActiveRole(role as any)}
        caseId={activeCase.id || "PF-2026-001"}
        currentStep={currentStep}
        completedSteps={completedSteps}
        caseData={caseData}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onViewRoadmap={() => {
          if (hasCompletedAnalysis) {
            setHasViewedJourney(false);
          }
        }}
        hideSidebars={hideSidebars}
      >
        {mainContent}
      </SovereignLayout>

      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </>
  );
}

export default function Home() {
  return (
    <DemoStateProvider>
      <MainApp />
    </DemoStateProvider>
  );
}
