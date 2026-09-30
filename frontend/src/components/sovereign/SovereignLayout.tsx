"use client";

import React from "react";
import { SovereignNavbar } from "./SovereignNavbar";
import { SovereignStepper } from "./SovereignStepper";
import { CaseLedgerSidebar } from "./CaseLedgerSidebar";
import { IntelligencePanel } from "./IntelligencePanel";
import { SovereignFooter } from "./SovereignFooter";

interface SovereignLayoutProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
  caseId: string;
  currentStep: number;
  completedSteps: number[];
  caseData: {
    intent?: string;
    activity?: string;
    scale?: string;
    location?: string;
    district?: string;
    pollutionCategory?: string;
    nicCode?: string;
  };
  onOpenCopilot?: () => void;
  onViewRoadmap?: () => void;
  children: React.ReactNode;
}

export function SovereignLayout({
  activeRole,
  onRoleChange,
  caseId,
  currentStep,
  completedSteps,
  caseData,
  onOpenCopilot,
  onViewRoadmap,
  children,
}: SovereignLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Top Navbar */}
      <SovereignNavbar
        activeRole={activeRole}
        onRoleChange={onRoleChange}
        caseId={caseId}
        onOpenCopilot={onOpenCopilot}
      />

      {/* 10-Step Stepper (Applicant Only) */}
      {activeRole === "applicant" && (
        <div className="bg-white border-b border-slate-200 px-4">
          <SovereignStepper currentStep={currentStep} completedSteps={completedSteps} />
        </div>
      )}

      {/* Three-Column Layout */}
      <div className="flex-1 flex">
        {/* Left Sidebar: Case Ledger Facts */}
        {activeRole === "applicant" && (
          <aside className="w-64 xl:w-72 hidden lg:flex flex-col border-r border-slate-200 bg-white overflow-y-auto">
            <CaseLedgerSidebar caseData={caseData} />
          </aside>
        )}

        {/* Center: Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Right Sidebar: Intelligence Panel (Only after Discovery is complete) */}
        {activeRole === "applicant" && currentStep >= 4 && (
          <aside className="w-72 xl:w-80 hidden xl:flex flex-col border-l border-slate-200 bg-white overflow-y-auto">
            <IntelligencePanel onViewRoadmap={onViewRoadmap} />
          </aside>
        )}
      </div>

      {/* Footer */}
      <SovereignFooter />
    </div>
  );
}
