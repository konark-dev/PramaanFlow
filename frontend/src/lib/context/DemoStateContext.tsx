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
    { id: "udyam", name: "Udyam / MSME Registration", authority: "Ministry of MSME", department: "Ministry of MSME", status: "Submitted", fee: 0, slaDays: 1, risk: "Low", requirements: ["id_proof", "gst_cert"], dependencies: [], requiredDocuments: ["Aadhaar Card of Proprietor/Partner", "PAN Card", "GST Registration Certificate"] },
    { id: "factory_license", name: "Factory License", authority: "DISH Maharashtra", department: "Directorate of Industrial Safety & Health", status: "Submitted", fee: 2500, slaDays: 30, risk: "Medium", requirements: ["site_plan", "env_clearance"], dependencies: ["udyam"], requiredDocuments: ["Approved Site/Layout Plan", "Architect Certificate", "List of Machinery & Equipment"] },
    { id: "mpcb_cte", name: "MPCB Consent to Establish", authority: "Maharashtra Pollution Control Board", department: "Maharashtra Pollution Control Board", status: "Pending", fee: 50000, slaDays: 90, risk: "High", requirements: ["env_clearance", "site_plan"], dependencies: ["factory_license"], requiredDocuments: ["Environmental Impact Assessment Report", "Process Flow Diagram", "Effluent Treatment Plan", "Waste Management Plan"] },
    { id: "fssai", name: "FSSAI Central License", authority: "Food Safety & Standards Authority", department: "FSSAI", status: "Pending", fee: 7500, slaDays: 60, risk: "Medium", requirements: ["gst_cert", "site_plan"], dependencies: ["udyam"], requiredDocuments: ["Food Safety Management Plan", "Product List with Category", "GST Certificate"] },
    { id: "fire_noc", name: "Fire Safety NOC", authority: "Chief Fire Officer, Pune", department: "Fire Department, Pune", status: "Pending", fee: 5000, slaDays: 15, risk: "Low", requirements: ["site_plan", "land_registry"], dependencies: [], requiredDocuments: ["Building Layout Plan", "Fire Fighting Equipment Details", "Emergency Evacuation Plan"] },
    { id: "midc_bpa", name: "MIDC Building Plan Approval", authority: "MIDC Special Planning Authority", department: "MIDC", status: "Submitted", fee: 35000, slaDays: 45, risk: "Medium", requirements: ["site_plan", "land_registry"], dependencies: ["fire_noc"], requiredDocuments: ["Architect-certified Building Plan", "Land Lease/Ownership Deed", "Structural Stability Certificate"] },
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

const now = Date.now();
const minutesAgo = (min: number) => new Date(now - min * 60000).toISOString();
const hoursAgo = (hours: number) => new Date(now - hours * 3600000).toISOString();
const daysAgo = (days: number) => new Date(now - days * 86400000).toISOString();

const DEMO_DOCUMENTS: DemoDocument[] = [
  { id: "site_plan", name: "Approved Site/Layout Plan", status: "VERIFIED", requiredFor: ["Building Plan Approval", "Fire NOC"], type: "site_plan", url: "/docs/site_plan.pdf", hash: "0xA3F8B21C", uploadedAt: daysAgo(2) },
  { id: "id_proof", name: "Director ID Proof (Aadhaar/PAN)", status: "VERIFIED", requiredFor: ["Company Incorporation", "Tax Registration"], type: "id_proof", url: "/docs/id_proof.pdf", hash: "0x7E4D9F01", uploadedAt: daysAgo(2) },
  { id: "land_registry", name: "Land Ownership/Lease Deed", status: "VERIFIED", requiredFor: ["Land Use Clearance", "Fire NOC"], type: "land_registry", url: "/docs/land_deed.pdf", hash: "0xC2B5A8E7", uploadedAt: daysAgo(1.5) },
  { id: "gst_cert", name: "GST Registration Certificate", status: "VERIFIED", requiredFor: ["Tax Registration", "FSSAI License"], type: "gst_cert", url: "/docs/gst_cert.pdf", hash: "0xD1F63B9A", uploadedAt: daysAgo(1) },
  { id: "env_clearance", name: "Environmental Impact Assessment", status: "Uploaded", requiredFor: ["CPCB Clearance", "State Pollution Board"], type: "env_clearance", url: "/docs/eia_report.pdf", hash: "0x9A4E27C3", uploadedAt: hoursAgo(5) },
];

const DEMO_MESSAGES: DemoMessage[] = [
  { id: "m1", sender: "applicant", text: "Application submitted for Edible Oil Extraction unit at MIDC Chakan.", timestamp: daysAgo(2) },
  { id: "m2", sender: "ca", text: "Reviewed your documents. Site Plan and ID Proof look good. Please ensure EIA report covers noise pollution data as per MPCB 2024 guidelines.", timestamp: daysAgo(1) },
  { id: "m3", sender: "applicant", text: "Updated EIA report uploaded with Section 5.3 noise data added.", timestamp: hoursAgo(10) },
  { id: "m4", sender: "government", text: "Case PF-2026-199 received. Under preliminary jurisdictional review.", timestamp: hoursAgo(4) },
  { id: "m5", sender: "ca", text: "Suggested Change: Update capacity from 25,000 to 45,000 LPD to remain in the Orange Category threshold for faster clearance.", timestamp: minutesAgo(15) },
];

const DEMO_TIMELINE = [
  { timestamp: daysAgo(2), event: "Case Created — Applicant initiated new business setup" },
  { timestamp: daysAgo(2), event: "Discovery Flow Completed — Business classified as Food Processing (Orange)" },
  { timestamp: daysAgo(1.9), event: "Regulatory Analysis Complete — 6 approvals identified" },
  { timestamp: daysAgo(1.8), event: "Documents Uploaded — Site Plan, ID Proof, Land Deed" },
  { timestamp: daysAgo(1), event: "GST Certificate Uploaded & Verified" },
  { timestamp: hoursAgo(23), event: "CA Assigned — Reviewing application" },
  { timestamp: hoursAgo(5), event: "EIA Report Uploaded" },
  { timestamp: hoursAgo(4), event: "Government Review — Case received by Dept. of Industries" },
  { timestamp: minutesAgo(15), event: "CA Suggested capacity change for Orange category optimization" },
];

const INITIAL_CASE: DemoCase = {
  id: "PF-2026-199",
  applicantAnswers: {},
  discoveryResult: null,
  roadmap: null,
  geoContext: null,
  governmentSupport: [],
  approvals: [],
  documents: DEMO_DOCUMENTS,
  messages: DEMO_MESSAGES,
  timeline: [{ timestamp: new Date().toISOString(), event: 'Case Created' }],
  caAssigned: false,
  caStatus: 'Unassigned',
  govStatus: 'Draft',
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
        // If saved data has old roadmap schema, use fresh demo data
        if (parsed.roadmap && !parsed.roadmap.approvals?.[0]?.dependencies) {
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
    const syncTabFromHash = () => {
      const tab = decodeURIComponent(window.location.hash.slice(1));
      if (tab) setActiveTab(tab);
    };
    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    setIsLoaded(true);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
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
