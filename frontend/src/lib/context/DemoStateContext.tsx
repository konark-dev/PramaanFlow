"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiscoveryResult } from '@/components/applicant/ApplicantDiscoveryFlow';

// Basic Shared Models
export type Role = 'applicant' | 'ca' | 'government' | 'inspector' | 'inspector';
export type ApprovalStatus = 'Pending' | 'In Review' | 'Action Required' | 'Approved' | 'Blocked';
export type DocumentStatus = 'Missing' | 'Uploaded' | 'Under Review' | 'Verified' | 'VERIFIED' | 'Rejected';

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
  roadmap: any | null; // The result from /api/applicant/analyze
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

const INITIAL_CASE: DemoCase = {
  id: `PF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
  applicantAnswers: {},
  discoveryResult: null,
  roadmap: null,
  geoContext: null,
  governmentSupport: [],
  approvals: [],
  documents: [],
  messages: [],
  timeline: [{ timestamp: new Date().toISOString(), event: 'Case Created' }],
  caAssigned: false,
  caStatus: 'Unassigned',
  govStatus: 'Draft',
  inspectorAssigned: false
};

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
  const [activeTab, setActiveTab] = useState<string>("Case Dashboard");
  const [activeCase, setActiveCase] = useState<DemoCase>(INITIAL_CASE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pramaan_shared_demo_case');
    if (saved) {
      try {
        setActiveCase(JSON.parse(saved));
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
      if (updates.caStatus && updates.caStatus !== prev.caStatus) {
        events.push({ timestamp: new Date().toISOString(), event: `CA Status changed to ${updates.caStatus}` });
      }
      if (updates.govStatus && updates.govStatus !== prev.govStatus) {
        events.push({ timestamp: new Date().toISOString(), event: `Government Status changed to ${updates.govStatus}` });
      }
      if (events.length === 0) {
        events.push({ timestamp: new Date().toISOString(), event: `Case updated` });
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
      id: `PF-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    });
    // Optional: force a reload to cleanly wipe all local states if needed, 
    // but just changing activeCase helps. A true restart might prefer a reload:
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
