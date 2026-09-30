"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiscoveryResult } from '@/components/applicant/ApplicantDiscoveryFlow';

// Basic Shared Models
export type Role = 'applicant' | 'ca' | 'government' | 'inspector';
export type ApprovalStatus = 'Pending' | 'In Review' | 'Action Required' | 'Approved' | 'Blocked' | 'Submitted';
export type DocumentStatus = 'Missing' | 'Uploaded' | 'Under Review' | 'Verified' | 'VERIFIED' | 'Rejected' | 'Submitted';

export interface DemoDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  requiredFor: string[];
  reusable?: boolean;
  owner?: 'Applicant' | 'CA';
  type?: string;
  url?: string;
  hash?: string;
  uploadedAt?: string;
}

export interface DemoApproval {
  id: string;
  name: string;
  authority: string;
  status: ApprovalStatus;
  fee: number;
  slaDays: number;
  risk: 'Low' | 'Medium' | 'High';
  requirements?: string[];
}

export interface DemoMessage {
  id: string;
  sender: 'applicant' | 'ca' | 'government' | 'inspector';
  text: string;
  timestamp: string;
}

export interface DemoCase {
  id: string;
  applicantAnswers: Record<string, any>;
  discoveryResult: DiscoveryResult | null;
  roadmap: any | null;
  geoContext: any | null;
  governmentSupport: any[];

  approvals: DemoApproval[];
  documents: DemoDocument[];
  messages: DemoMessage[];
  timeline: { timestamp: string; event: string }[];

  caAssigned: boolean;
  caStatus: 'Unassigned' | 'Reviewing' | 'Action Required' | 'Ready for Submission';

  govStatus: 'Draft' | 'Submitted' | 'Under Review' | 'Inspection Pending' | 'Cleared';
  inspectorAssigned: boolean;
  isPackaged?: boolean;
  packageHash?: string;
}

// ═══════ PRE-FILLED DEMO DATA ═══════

const DEMO_DISCOVERY_RESULT: DiscoveryResult = {
  intent: "Start a new business",
  businessType: "Food Processing & Manufacturing",
  subType: "Edible Oil Extraction & Refinery",
  state: "Maharashtra",
  district: "Pune",
  location: "MIDC Chakan, Phase II",
  capacity: "25,000 Litres/Day",
  scale: "Large Scale",
  category: "Orange",
  employees: "120",
  investment: "₹8.5 Crore",
  landArea: "2.5 Acres",
  waterUsage: "15,000 Litres/Day",
  powerRequirement: "350 kVA",
};

const DEMO_ROADMAP = {
  approvals: [
    { id: "udyam", name: "Udyam / MSME Registration", authority: "Ministry of MSME", status: "Submitted", fee: 0, slaDays: 1, risk: "Low", requirements: ["id_proof", "gst_cert"] },
    { id: "factory_license", name: "Factory License", authority: "DISH Maharashtra", status: "Submitted", fee: 2500, slaDays: 30, risk: "Medium", requirements: ["site_plan", "env_clearance"] },
    { id: "mpcb_cte", name: "MPCB Consent to Establish", authority: "Maharashtra Pollution Control Board", status: "Pending", fee: 50000, slaDays: 90, risk: "High", requirements: ["env_clearance", "site_plan"] },
    { id: "fssai", name: "FSSAI Central License", authority: "Food Safety & Standards Authority", status: "Pending", fee: 7500, slaDays: 60, risk: "Medium", requirements: ["gst_cert", "site_plan"] },
    { id: "fire_noc", name: "Fire Safety NOC", authority: "Chief Fire Officer, Pune", status: "Pending", fee: 5000, slaDays: 15, risk: "Low", requirements: ["site_plan", "land_registry"] },
    { id: "midc_bpa", name: "MIDC Building Plan Approval", authority: "MIDC Special Planning Authority", status: "Submitted", fee: 35000, slaDays: 45, risk: "Medium", requirements: ["site_plan", "land_registry"] },
  ]
};

const DEMO_GEO_CONTEXT = {
  zone: "MIDC Industrial Estate Phase II",
  landUse: "Industrial (Pre-Cleared)",
  esaSensitivity: "None — Outside Western Ghats ESA boundary",
  municipality: "Chakan Municipal Council",
  spaRoute: true,
  fireRegion: "Pune Regional Fire Office",
};

const DEMO_GOV_SUPPORT = [
  { name: "PM-FME Scheme", ministry: "MoFPI", benefit: "35% Capital Subsidy up to ₹10 Lakh", eligible: true },
  { name: "PMEGP", ministry: "KVIC / DIC", benefit: "25% Margin Money Subsidy", eligible: true },
  { name: "Maharashtra Industrial Policy 2024", ministry: "State Industries Dept", benefit: "Stamp Duty Exemption + Power Tariff Subsidy", eligible: true },
];

const DEMO_DOCUMENTS: DemoDocument[] = [
  { id: "site_plan", name: "Approved Site/Layout Plan", status: "VERIFIED", requiredFor: ["Building Plan Approval", "Fire NOC"], type: "site_plan", url: "/docs/site_plan.pdf", hash: "0xA3F8B21C", uploadedAt: "2026-09-28T10:15:00Z" },
  { id: "id_proof", name: "Director ID Proof (Aadhaar/PAN)", status: "VERIFIED", requiredFor: ["Company Incorporation", "Tax Registration"], type: "id_proof", url: "/docs/id_proof.pdf", hash: "0x7E4D9F01", uploadedAt: "2026-09-28T09:30:00Z" },
  { id: "land_registry", name: "Land Ownership/Lease Deed", status: "VERIFIED", requiredFor: ["Land Use Clearance", "Fire NOC"], type: "land_registry", url: "/docs/land_deed.pdf", hash: "0xC2B5A8E7", uploadedAt: "2026-09-28T11:00:00Z" },
  { id: "gst_cert", name: "GST Registration Certificate", status: "VERIFIED", requiredFor: ["Tax Registration", "FSSAI License"], type: "gst_cert", url: "/docs/gst_cert.pdf", hash: "0xD1F63B9A", uploadedAt: "2026-09-29T08:45:00Z" },
  { id: "env_clearance", name: "Environmental Impact Assessment", status: "Uploaded", requiredFor: ["CPCB Clearance", "State Pollution Board"], type: "env_clearance", url: "/docs/eia_report.pdf", hash: "0x9A4E27C3", uploadedAt: "2026-09-29T14:20:00Z" },
];

const DEMO_MESSAGES: DemoMessage[] = [
  { id: "m1", sender: "applicant", text: "Application submitted for Edible Oil Extraction unit at MIDC Chakan.", timestamp: "2026-09-28T09:00:00Z" },
  { id: "m2", sender: "ca", text: "Reviewed your documents. Site Plan and ID Proof look good. Please ensure EIA report covers noise pollution data as per MPCB 2024 guidelines.", timestamp: "2026-09-28T14:30:00Z" },
  { id: "m3", sender: "applicant", text: "Updated EIA report uploaded with Section 5.3 noise data added.", timestamp: "2026-09-29T10:15:00Z" },
  { id: "m4", sender: "government", text: "Case PF-2026-199 received. Under preliminary jurisdictional review.", timestamp: "2026-09-29T16:00:00Z" },
  { id: "m5", sender: "ca", text: "Suggested Change: Update capacity from 25,000 to 45,000 LPD to remain in the Orange Category threshold for faster clearance.", timestamp: "2026-09-30T09:00:00Z" },
];

const DEMO_TIMELINE = [
  { timestamp: "2026-09-28T08:30:00Z", event: "Case Created — Applicant initiated new business setup" },
  { timestamp: "2026-09-28T09:00:00Z", event: "Discovery Flow Completed — Business classified as Food Processing (Orange)" },
  { timestamp: "2026-09-28T09:45:00Z", event: "Regulatory Analysis Complete — 6 approvals identified" },
  { timestamp: "2026-09-28T10:30:00Z", event: "Documents Uploaded — Site Plan, ID Proof, Land Deed" },
  { timestamp: "2026-09-29T08:45:00Z", event: "GST Certificate Uploaded & Verified" },
  { timestamp: "2026-09-29T11:00:00Z", event: "CA Assigned — Reviewing application" },
  { timestamp: "2026-09-29T14:20:00Z", event: "EIA Report Uploaded" },
  { timestamp: "2026-09-29T16:00:00Z", event: "Government Review — Case received by Dept. of Industries" },
  { timestamp: "2026-09-30T09:00:00Z", event: "CA Suggested capacity change for Orange category optimization" },
];

const INITIAL_CASE: DemoCase = {
  id: "PF-2026-199",
  applicantAnswers: {
    intent: "Start a new business",
    businessType: "Food Processing & Manufacturing",
    subType: "Edible Oil Extraction & Refinery",
    state: "Maharashtra",
    district: "Pune",
    location: "MIDC Chakan, Phase II",
  },
  discoveryResult: DEMO_DISCOVERY_RESULT,
  roadmap: DEMO_ROADMAP,
  geoContext: DEMO_GEO_CONTEXT,
  governmentSupport: DEMO_GOV_SUPPORT,
  approvals: [],
  documents: DEMO_DOCUMENTS,
  messages: DEMO_MESSAGES,
  timeline: DEMO_TIMELINE,
  caAssigned: true,
  caStatus: 'Reviewing',
  govStatus: 'Under Review',
  inspectorAssigned: false
};

// ═══════ CONTEXT ═══════

interface DemoStateContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCase: DemoCase;
  updateCase: (updates: Partial<DemoCase>) => void;
  updateApproval: (id: string, updates: Partial<DemoApproval>) => void;
  updateDocument: (id: string, updates: Partial<DemoDocument>) => void;
  addMessage: (msg: Omit<DemoMessage, 'id' | 'timestamp'>) => void;
  resetCase: () => void;
}

const DemoContext = createContext<DemoStateContextType | undefined>(undefined);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<Role>('applicant');
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [activeCase, setActiveCase] = useState<DemoCase>(INITIAL_CASE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pramaan_shared_demo_case');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If saved data has no discoveryResult, use fresh demo data
        if (!parsed.discoveryResult) {
          setActiveCase(INITIAL_CASE);
        } else {
          setActiveCase(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved case", e);
      }
    }
    const savedRole = localStorage.getItem('pramaan_active_role') as Role;
    if (savedRole) {
      setActiveRole(savedRole);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pramaan_shared_demo_case', JSON.stringify(activeCase));
      localStorage.setItem('pramaan_active_role', activeRole);
    }
  }, [activeCase, activeRole, isLoaded]);

  const updateCase = (updates: Partial<DemoCase>) => {
    setActiveCase(prev => {
      const events: { timestamp: string; event: string }[] = [];
      if (updates.discoveryResult && !prev.discoveryResult) {
        events.push({ timestamp: new Date().toISOString(), event: `Business Activity Classified` });
      }
      if (updates.roadmap && !prev.roadmap) {
        events.push({ timestamp: new Date().toISOString(), event: `Regulatory Analysis` });
      }
      if (updates.caAssigned && !prev.caAssigned) {
        events.push({ timestamp: new Date().toISOString(), event: `CA Review` });
      }
      if (updates.govStatus && updates.govStatus !== prev.govStatus) {
        events.push({ timestamp: new Date().toISOString(), event: `Government Status changed to ${updates.govStatus}` });
      }
      if (updates.inspectorAssigned && !prev.inspectorAssigned) {
        events.push({ timestamp: new Date().toISOString(), event: `Inspection` });
      }
      if (events.length === 0) {
        if (Object.keys(updates).length !== 1 || !updates.applicantAnswers) {
          events.push({ timestamp: new Date().toISOString(), event: `Case updated` });
        }
      }
      return {
        ...prev,
        ...updates,
        timeline: prev.timeline ? [...prev.timeline, ...events] : [...events]
      };
    });
  };

  const updateApproval = (id: string, updates: Partial<DemoApproval>) => {
    setActiveCase(prev => {
      const updatedApprovals = prev.approvals.map(a => a.id === id ? { ...a, ...updates } : a);
      const timelineEvent = {
        timestamp: new Date().toISOString(),
        event: updates.status ? `Approval ${id} status changed to ${updates.status}` : `Approval ${id} updated`
      };
      return {
        ...prev,
        approvals: updatedApprovals,
        timeline: prev.timeline ? [...prev.timeline, timelineEvent] : [timelineEvent]
      };
    });
  };

  const updateDocument = (id: string, updates: Partial<DemoDocument>) => {
    setActiveCase(prev => {
      const updatedDocs = prev.documents.map(d => d.id === id ? { ...d, ...updates } : d);
      const timelineEvent = {
        timestamp: new Date().toISOString(),
        event: updates.status ? `Document ${id} status changed to ${updates.status}` : `Document ${id} updated`
      };
      return {
        ...prev,
        documents: updatedDocs,
        timeline: prev.timeline ? [...prev.timeline, timelineEvent] : [timelineEvent]
      };
    });
  };

  const addMessage = (msg: Omit<DemoMessage, 'id' | 'timestamp'>) => {
    const newMessage: DemoMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setActiveCase(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      timeline: prev.timeline
        ? [...prev.timeline, { timestamp: new Date().toISOString(), event: `Message added by ${msg.sender}` }]
        : [{ timestamp: new Date().toISOString(), event: `Message added by ${msg.sender}` }]
    }));
  };

  const resetCase = () => {
    localStorage.removeItem('pramaan_shared_demo_case');
    localStorage.removeItem('pramaan_discovery_answers');
    localStorage.removeItem('pramaan_discovery_matches');
    localStorage.removeItem('pramaan_discovery_step');
    localStorage.removeItem('pramaan_case_id');
    setActiveCase({
      ...INITIAL_CASE,
    });
    window.location.reload();
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Demo State...</div>;

  return (
    <DemoContext.Provider value={{
      activeRole,
      setActiveRole,
      activeTab,
      setActiveTab,
      activeCase,
      updateCase,
      updateApproval,
      updateDocument,
      addMessage,
      resetCase
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoState() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoState must be used within a DemoStateProvider');
  }
  return context;
}
