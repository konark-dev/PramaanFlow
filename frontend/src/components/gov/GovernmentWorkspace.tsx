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
  Ban
} from "lucide-react";

export function GovernmentWorkspace() {
  const { activeCase, updateCase, addMessage, activeTab, setActiveTab } = useDemoState();
  const [queryInput, setQueryInput] = useState("");

  if (activeTab === "Submission Queue") {
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
                      setActiveTab("Clearance Review");
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
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Case Detail View
  const { discoveryResult } = activeCase;

  if (activeTab === "Audit Trail") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Case Audit Trail</h2>
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

  const handleApprove = (approvalId: string) => {
    const newRoadmap = { ...activeCase.roadmap };
    const targetApprovalIndex = newRoadmap.approvals.findIndex((a: any) => a.id === approvalId);
    if (targetApprovalIndex >= 0) {
      newRoadmap.approvals[targetApprovalIndex].status = 'Approved';
    }
    updateCase({ roadmap: newRoadmap });
    addMessage({ sender: 'government', text: `Approval Granted for ${newRoadmap.approvals[targetApprovalIndex].name}.` });
  };

  const handleRequireInspection = () => {
    updateCase({ govStatus: 'Inspection Pending', inspectorAssigned: true });
    addMessage({ sender: 'government', text: `Physical Inspection Scheduled.` });
    alert("Case forwarded to Inspector.");
  };

  const handleSubmitQuery = () => {
    if (!queryInput.trim()) return;
    addMessage({ sender: 'government', text: `Query: ${queryInput}` });
    setQueryInput("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[80vh]">
      {/* LEFT PANE */}
      <div className="w-full lg:w-80 space-y-4">
        <button onClick={() => setActiveTab('queue')} className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2">
          ← Back to Queue
        </button>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Case Profile</span>
              <span className="font-mono text-sm font-bold text-slate-800">{activeCase.id}</span>
            </div>
            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase">{activeCase.govStatus}</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Business Activity</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Building2 className="w-4 h-4 text-slate-400" />
                {discoveryResult?.subType || 'N/A'}
              </div>
            </div>
            
            <div>
              <span className="text-xs text-slate-500 block mb-1">Location</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-slate-400" />
                {discoveryResult?.location || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Decision Actions
          </h3>
          <button onClick={handleRequireInspection} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200">
            Require Physical Inspection
          </button>
          <button onClick={() => updateCase({ govStatus: 'Cleared' })} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200">
            Issue Final Clearance
          </button>
        </div>
      </div>

      {/* CENTER PANE */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Application Review
          </h2>

          <div className="space-y-4">
            {activeCase.roadmap?.approvals?.map((approval: any) => (
              <div key={approval.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
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

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            Evidence & Documents
          </h2>
          <div className="space-y-3">
            {activeCase.documents?.map((doc: any) => (
              <div key={doc.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{doc.name}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Status: {doc.status}</p>
                  </div>
                </div>
                <button onClick={() => alert(`Opening official document viewer for verification: ${doc.name}`)} className="text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg uppercase transition-colors">
                  View
                </button>
              </div>
            ))}
            {(!activeCase.documents || activeCase.documents.length === 0) && (
              <p className="text-sm text-slate-500 italic">No evidence provided.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Communication */}
      <div className="w-full lg:w-80 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[80vh]">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Queries & Communication
          </h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {activeCase.messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'government' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                msg.sender === 'government' 
                  ? 'bg-amber-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
              }`}>
                <span className="text-[10px] font-bold opacity-70 block mb-1 uppercase tracking-wider">{msg.sender}</span>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-200 space-y-3">
          <div className="flex gap-2">
            <input 
              type="text"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="Raise a query..."
              className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
            />
            <button 
              onClick={handleSubmitQuery}
              disabled={!queryInput.trim()}
              className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors font-bold text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
