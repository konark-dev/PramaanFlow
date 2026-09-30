"use client";

import React, { useState, useMemo } from "react";
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
import { SovereignLayout } from "@/components/sovereign/SovereignLayout";

function MainApp() {
  const { activeRole, activeCase, updateCase, setActiveRole } = useDemoState();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const [hasStartedDemo, setHasStartedDemo] = useState(!!activeCase.discoveryResult);
  const [hasCompletedDiscovery, setHasCompletedDiscovery] = useState(!!activeCase.discoveryResult);
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState(!!activeCase.roadmap);
  const [hasViewedJourney, setHasViewedJourney] = useState(false);
  const [targetApprovalId, setTargetApprovalId] = useState<string | undefined>();
  const [draftAnswers, setDraftAnswers] = useState<Record<string, any>>({});
  const [discoveryStepIndex, setDiscoveryStepIndex] = useState(0);

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
  let mainContent: React.ReactNode = null;

  if (activeRole === "applicant" && !hasCompletedDiscovery) {
    mainContent = <ApplicantDiscoveryFlow onComplete={handleDiscoveryComplete} onChange={setDraftAnswers} onStepChange={setDiscoveryStepIndex} />;
  } else if (activeRole === "applicant" && hasCompletedDiscovery && !hasCompletedAnalysis && activeCase.discoveryResult) {
    mainContent = (
      <IntelligenceAnalysisEngine
        discoveryResult={activeCase.discoveryResult}
        onAnalysisComplete={(roadmap, geo, governmentSupport) => {
          updateCase({ roadmap, geoContext: geo, governmentSupport });
          setHasCompletedAnalysis(true);
        }}
      />
    );
  } else if (activeRole === "applicant" && hasCompletedDiscovery && hasCompletedAnalysis && !hasViewedJourney && activeCase.discoveryResult) {
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
  } else if (activeRole === "applicant" && activeCase.discoveryResult) {
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
  } else if (activeRole === "ca") {
    mainContent = <CAWorkspace />;
  } else if (activeRole === "government") {
    mainContent = <GovernmentWorkspace />;
  } else if (activeRole === "inspector") {
    mainContent = <InspectorWorkspace />;
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
