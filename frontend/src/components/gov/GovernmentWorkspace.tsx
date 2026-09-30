"use client";

import React, { useState } from "react";
import { useDemoState } from "@/lib/context/DemoStateContext";
import {
  Building2,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldCheck,
  Ban,
  Globe,
  Scale,
  Landmark,
  Layers,
  Eye,
  Download
} from "lucide-react";

export function GovernmentWorkspace() {
  const { activeCase, updateCase, addMessage, activeTab, setActiveTab } = useDemoState();
  const [queryInput, setQueryInput] = useState("");

  // --- TAB: Incoming Cases ---
  if (activeTab === "Incoming Cases") {
    return (
      <div className="flex flex-col gap-6 min-h-[80vh]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Incoming Cases (Department Queue)</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search cases..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center gap-2 text-sm font-bold">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <th className="p-4">Case ID</th>
                <th className="p-4">Business Profile</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-bold text-slate-800">{activeCase.id}</td>
                <td className="p-4">
                  <div className="font-semibold text-slate-800">{activeCase.discoveryResult?.subType || 'Pending'}</div>
                  <div className="text-xs text-slate-500">New Application</div>
                </td>
                <td className="p-4 text-slate-600">{activeCase.discoveryResult?.location || 'Unknown'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${activeCase.govStatus === 'Submitted' || activeCase.govStatus === 'Under Review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {activeCase.govStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setActiveTab("Jurisdiction");
                      if (activeCase.govStatus === 'Submitted') {
                        updateCase({ govStatus: 'Under Review' });
                      }
                    }}
                    className="text-sm font-bold text-teal-600 hover:text-teal-700"
                  >
                    Review Case →
                  </button>
                </td>
              </tr>
              {/* Additional mock cases */}
              <tr className="hover:bg-slate-50 transition-colors opacity-60">
                <td className="p-4 font-mono font-bold text-slate-800">PF-2026-047</td>
                <td className="p-4">
                  <div className="font-semibold text-slate-800">Textile Manufacturing</div>
                  <div className="text-xs text-slate-500">Renewal Application</div>
                </td>
                <td className="p-4 text-slate-600">GIDC Ahmedabad, Gujarat</td>
                <td className="p-4"><span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">Cleared</span></td>
                <td className="p-4 text-right"><span className="text-sm text-slate-400">Completed</span></td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors opacity-60">
                <td className="p-4 font-mono font-bold text-slate-800">PF-2026-089</td>
                <td className="p-4">
                  <div className="font-semibold text-slate-800">Pharmaceutical Unit</div>
                  <div className="text-xs text-slate-500">New Application</div>
                </td>
                <td className="p-4 text-slate-600">SEZ Hyderabad, Telangana</td>
                <td className="p-4"><span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">Under Review</span></td>
                <td className="p-4 text-right"><span className="text-sm text-slate-400">Assigned</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // For all other tabs, show "No Active Case" if discovery not done
  if (!activeCase.discoveryResult) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-md">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No Active Case Found</h2>
          <p className="text-slate-500 text-sm mt-2">
            Switch to the Applicant role and complete the Discovery flow to generate a case for review.
          </p>
        </div>
      </div>
    );
  }

  const { discoveryResult } = activeCase;

  // --- TAB: Jurisdiction (Territorial & Subject-matter jurisdiction check) ---
  if (activeTab === "Jurisdiction") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Jurisdiction Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">State</span>
            <p className="font-bold text-slate-900 mt-1">{activeCase.discoveryResult?.state || 'Maharashtra'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">District</span>
            <p className="font-bold text-slate-900 mt-1">{activeCase.discoveryResult?.district || 'Pune'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Industrial Zone</span>
            <p className="font-bold text-slate-900 mt-1">{activeCase.discoveryResult?.location || 'Chakan MIDC'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Governing Authority</span>
            <p className="font-bold text-slate-900 mt-1">MIDC Special Planning Authority (SPA)</p>
          </div>
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 sm:col-span-2">
            <span className="text-[10px] font-bold uppercase text-teal-700">Jurisdiction Note</span>
            <p className="text-sm text-slate-700 mt-1">This project falls within MIDC notified industrial estate. Jurisdiction transfers from local municipal authority to MIDC SPA for building plan approvals and water/sewage connections.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- TAB: Regulatory Review ---
  if (activeTab === "Regulatory Review") {
    const handleApprove = (approvalId: string) => {
      const newRoadmap = { ...activeCase.roadmap };
      const targetApprovalIndex = newRoadmap.approvals.findIndex((a: any) => a.id === approvalId);
      if (targetApprovalIndex >= 0) {
        newRoadmap.approvals[targetApprovalIndex].status = 'Approved';
      }
      updateCase({ roadmap: newRoadmap });
      addMessage({ sender: 'government', text: `Approval Granted for ${newRoadmap.approvals[targetApprovalIndex].name}.` });
    };

    return (
      <div className="flex flex-col gap-6 min-h-[80vh]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-600" />
            Regulatory Review & Approval
          </h2>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200 uppercase">
            {activeCase.govStatus}
          </span>
        </div>

        {/* Statutory References */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            Applicable Statutory Acts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "The Factories Act, 1948", desc: "Factory licensing, safety protocols, labor regulations", sections: "§ 6, 7, 11-21" },
              { name: "Environment (Protection) Act, 1986", desc: "MPCB pollution control, ETP, waste management", sections: "§ 3, 5, 25" },
              { name: "Maharashtra Industrial Development Act, 1961", desc: "MIDC land allotment and building plan", sections: "§ 32, 44A" },
              { name: "Fire Prevention & Life Safety Act, 2006", desc: "Fire NOC, safety equipment, emergency exits", sections: "§ 3-8" },
            ].map((act, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <h4 className="font-bold text-slate-800 text-sm">{act.name}</h4>
                <p className="text-xs text-slate-600 mt-1">{act.desc}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">Sections: {act.sections}</span>
                  <button onClick={() => alert(`Opening ${act.name} digital viewer...`)} className="text-xs font-bold text-teal-600 hover:underline">View Act</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Queue */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Application Approval Queue
          </h3>
          <div className="space-y-3">
            {activeCase.roadmap?.approvals?.map((approval: any) => (
              <div key={approval.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${approval.status === 'Submitted' ? 'bg-amber-400' : approval.status === 'Approved' ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
                    <p className="font-bold text-slate-800 text-sm">{approval.name}</p>
                  </div>
                  <p className="text-xs text-slate-500">Status: {approval.status || 'Pending'}</p>
                </div>
                {approval.status === 'Submitted' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(approval.id)} className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-3 py-1.5 rounded hover:bg-teal-100">
                      Approve
                    </button>
                  </div>
                )}
                {approval.status === 'Approved' && (
                  <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Approved
                  </span>
                )}
              </div>
            ))}
            {(!activeCase.roadmap?.approvals || activeCase.roadmap.approvals.length === 0) && (
              <p className="text-sm text-slate-500 italic">No applications submitted yet.</p>
            )}
          </div>
        </div>

        {/* Decision Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Final Decision
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                updateCase({ govStatus: 'Inspection Pending', inspectorAssigned: true });
                addMessage({ sender: 'government', text: 'Physical Inspection Scheduled.' });
                alert("Case forwarded to Inspector.");
              }}
              className="px-5 py-2.5 text-sm font-bold rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
            >
              Require Physical Inspection
            </button>
            <button
              onClick={() => updateCase({ govStatus: 'Cleared' })}
              className="px-5 py-2.5 text-sm font-bold rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200"
            >
              Issue Final Clearance
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TAB: Evidence (Submitted Documents from Applicant) ---
  if (activeTab === "Evidence") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Evidence & Documents</h2>
        <div className="space-y-3">
          {activeCase.documents?.map((doc: any) => (
            <div key={doc.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50 hover:bg-white transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${ doc.status === 'Verified' ? 'bg-emerald-500' : doc.status === 'Submitted' ? 'bg-blue-500' : 'bg-amber-400' }`} />
                <span className="text-sm font-medium text-slate-800">{doc.name}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${ doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : doc.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700' }`}>
                {doc.status || 'Pending'}
              </span>
            </div>
          ))}
          {(!activeCase.documents || activeCase.documents.length === 0) && (
            <p className="text-sm text-slate-500 italic text-center py-8">No documents submitted yet.</p>
          )}
        </div>
      </div>
    );
  }

  // --- TAB: Timeline ---
  if (activeTab === "Timeline") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          Case Audit Trail
        </h2>
        <div className="space-y-6">
          {activeCase.timeline?.slice().reverse().map((event: any, idx: number) => (
            <div key={idx} className="flex gap-4">
              <div className="w-32 text-xs font-mono text-slate-500 shrink-0">
                {new Date(event.timestamp).toLocaleString()}
              </div>
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="text-sm font-semibold text-slate-800">
                {event.event}
              </div>
            </div>
          ))}
          {(!activeCase.timeline || activeCase.timeline.length === 0) && (
            <p className="text-slate-500 italic text-sm">No timeline events recorded.</p>
          )}
        </div>
      </div>
    );
  }

  // --- DEFAULT / FALLBACK (should not reach, but safe) ---
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-md">
        <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Government Portal</h2>
        <p className="text-slate-500 text-sm mt-2">
          Select a tab above to navigate the case review workflow.
        </p>
      </div>
    </div>
  );
}
