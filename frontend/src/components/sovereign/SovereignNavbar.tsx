"use client";

import React, { useState } from "react";
import { Bell, Settings, Shield, CheckCircle2 } from "lucide-react";
import { useDemoState } from "@/lib/context/DemoStateContext";

export interface SovereignNavbarProps {
  activeRole: string;
  onRoleChange: (role: string) => void;
  caseId: string;
  onOpenCopilot?: () => void;
}

const ROLES = [
  { id: "applicant", label: "Applicant" },
  { id: "ca", label: "CA/Consultant" },
  { id: "government", label: "Government" },
  { id: "inspector", label: "Inspector" },
] as const;

const ROLE_TABS: Record<string, string[]> = {
  applicant: ["Dashboard", "Evidence Vault", "Messages"],
  ca: ["Project Details", "Regulatory Roadmap", "Evidence Vault", "Document Review", "Communication"],
  government: ["Incoming Cases", "Jurisdiction", "Regulatory Review", "Evidence", "Timeline"],
  inspector: ["Inspection Queue", "Site Observation", "Reports"],
};

export function SovereignNavbar({
  activeRole,
  onRoleChange,
  caseId,
  onOpenCopilot,
}: SovereignNavbarProps) {
  const { activeTab, setActiveTab, resetCase } = useDemoState();
  const currentRoleKey = (activeRole || "applicant").toLowerCase().includes("ca") ? "ca" : (activeRole || "applicant").toLowerCase();
  const tabs = ROLE_TABS[currentRoleKey] || ROLE_TABS.applicant;

  // Make sure activeTab is updated when role changes, if it's not in the new list
  React.useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab, setActiveTab]);

  const isRoleActive = (role: { id: string; label: string }) => {
    const current = (activeRole || "").toLowerCase().trim();
    if (role.id === "ca") {
      return current === "ca" || current === "ca/consultant" || current === "consultant";
    }
    return current === role.id.toLowerCase() || current === role.label.toLowerCase();
  };

  const handleRoleClick = (role: { id: string; label: string }) => {
    // Preserve caller's role casing preference if it matches label or id
    if (activeRole === role.label) {
      onRoleChange(role.label);
    } else {
      onRoleChange(role.id);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "AI Copilot" && onOpenCopilot) {
      onOpenCopilot();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="flex flex-col justify-center">
            {/* 'PramaanFlow' bold title */}
            <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
              PramaanFlow
            </span>
            {/* Small badge below: 'SOVEREIGN-V3.4' in a rounded pill (bg-slate-100 text-slate-600) */}
            <div className="mt-1 flex items-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-600 leading-none border border-slate-200/50">
                <Shield className="w-2.5 h-2.5 text-slate-500" />
                SOVEREIGN-V3.4
              </span>
            </div>
          </div>

          {/* Separator */}
          <div className="h-7 w-px bg-slate-200 hidden md:block mx-1" />

          {/* Case ID and Autosaved */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Case ID: 'PF-2026-001' in monospace */}
            <div className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
              {caseId || "PF-2026-001"}
            </div>

            {/* Green dot + 'Autosaved' text (text-emerald-600) */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autosaved</span>
            </div>
          </div>
        </div>

        {/* Center tabs (horizontal row) */}
        <nav aria-label="Center Navigation" className="hidden lg:flex items-center gap-4 xl:gap-6 h-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`relative h-full flex items-center px-1 text-xs transition-colors duration-150 ${
                  isActive
                    ? "font-bold text-slate-900 border-b-2 border-emerald-600"
                    : "font-medium text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Right Area: Role switcher and Far Right actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Role switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80 gap-0.5">
            {ROLES.map((role) => {
              const active = isRoleActive(role);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleClick(role)}
                  className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

          {/* Far right icons and button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Bell icon */}
            <div className="relative">
              <button
                type="button"
                onClick={() => alert("Notification Center:\n- CA Document Review requested\n- New schemes matched for Food Processing")}
                aria-label="Notifications"
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </button>
            </div>

            {/* Settings icon */}
            <button
              type="button"
              onClick={() => alert("Settings Panel:\n- Profile details\n- Security & Access\n- Preferences")}
              aria-label="Settings"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors hidden sm:block"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Reset Demo button */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to completely restart the PramaanFlow process? All progress will be lost.')) {
                  resetCase();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors shadow-sm shrink-0"
            >
              Restart
            </button>

            {/* 'Verify & Dispatch' green button (bg-emerald-700 text-white rounded-lg) */}
            <button
              type="button"
              onClick={() => alert(`Dispatch Initiated!\nRole: ${activeRole.toUpperCase()}\nStatus: Pre-checks running via Sovereign Engine.`)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 transition-colors shadow-sm shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Verify &amp; Dispatch</span>
              <span className="sm:hidden">Verify</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet sub-bar for Case ID and autosaved status if medium or small screen */}
      <div className="md:hidden border-t border-slate-100 px-4 py-1.5 flex items-center justify-between text-xs bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium text-slate-600 text-[11px]">
            {caseId || "PF-2026-001"}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autosaved</span>
          </div>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto text-[11px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={activeTab === tab ? "font-bold text-slate-900" : "text-slate-500"}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
