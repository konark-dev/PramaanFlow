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
  Paperclip,
  Check,
  Send,
  AlertTriangle
} from "lucide-react";

export function CAWorkspace() {
  const { activeCase, updateCase, addMessage, activeTab, setActiveTab } = useDemoState();
  const [msgInput, setMsgInput] = useState("");
  const [reportDraft, setReportDraft] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const project = activeCase.discoveryResult || {
    businessType: "Food Processing & Manufacturing",
    subType: "Edible Oil Extraction & Refinery",
    location: "MIDC Chakan, Phase II",
    district: "Pune",
    capacity: "25,000 Litres/Day",
    investment: "₹8.5 Crore",
    employees: "120",
  };
  const approvals = activeCase.roadmap?.approvals || [
    { id: "udyam", name: "Udyam / MSME Registration", authority: "Ministry of MSME", status: "Submitted", slaDays: 1, fee: 0 },
    { id: "factory", name: "Factory License", authority: "DISH Maharashtra", status: "In Review", slaDays: 30, fee: 2500 },
    { id: "mpcb", name: "MPCB Consent to Establish", authority: "MPCB", status: "Pending", slaDays: 90, fee: 50000 },
    { id: "fssai", name: "FSSAI Central License", authority: "FSSAI", status: "Pending", slaDays: 60, fee: 7500 },
  ];

  const handleSendMessage = () => {
    if (!msgInput.trim()) return;
    addMessage({ sender: 'ca', text: msgInput });
    setMsgInput("");
  };

  const handleSuggestChange = () => {
    addMessage({
      sender: 'ca',
      text: "Suggested Change: Update capacity from 25,000 to 45,000 LPD to remain in the Orange Category threshold."
    });
  };

  if (activeTab === "Client Dashboard" || !activeTab) {
    const mockCases = [
      { id: "PF-2026-102", client: "TechCorp Logistics", type: "Warehousing", status: "Review Complete", action: "Submit to Gov" },
      { id: "PF-2026-145", client: "GreenEnergy Pvt", type: "Solar Farm", status: "Awaiting Docs", action: "Follow up" },
      { id: "PF-2026-180", client: "HealthPlus Pharma", type: "Manufacturing", status: "Under Review", action: "Check Evidence" },
    ];
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Client Dashboard</h2>
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-medium">
                <th className="p-4">Case ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Business Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-blue-50/50 hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-800">{activeCase.id}</td>
                  <td className="p-4 font-semibold text-slate-800">{activeCase.applicantAnswers?.enterpriseName || "New Enterprise"} <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ACTIVE</span></td>
                  <td className="p-4 text-slate-600">{project.subType || project.businessType}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-700">{activeCase.caStatus}</span></td>
                  <td className="p-4 text-right"><button onClick={() => setActiveTab("Document Review")} className="text-xs px-3 py-1 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold">Open Workspace</button></td>
                </tr>
              {mockCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-800">{c.id}</td>
                  <td className="p-4 font-semibold text-slate-700">{c.client}</td>
                  <td className="p-4 text-slate-500">{c.type}</td>
                  <td className="p-4"><span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-600">{c.status}</span></td>
                  <td className="p-4 text-right"><button className="text-xs px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold">{c.action}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const discoveryResult = project;

  if (activeTab === "Project Details") {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Project Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Business Type</span>
            <p className="font-bold text-slate-900 mt-1">{discoveryResult?.businessType || 'Food Processing'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Sub-Type</span>
            <p className="font-bold text-slate-900 mt-1">{discoveryResult?.subType || 'Commercial Dairy Processing'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Location</span>
            <p className="font-bold text-slate-900 mt-1">{discoveryResult?.location || 'Chakan MIDC, Pune'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500">Case ID</span>
            <p className="font-bold text-slate-900 mt-1">{activeCase.id || 'PF-2026-001'}</p>
          </div>
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 sm:col-span-2">
            <span className="text-[10px] font-bold uppercase text-teal-700">Regulatory Roadmap</span>
            <p className="text-sm text-slate-700 mt-1">{approvals.length} approvals are being tracked for this case.</p>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3"><h3 className="font-bold text-slate-900">Approval snapshot</h3><button onClick={() => setActiveTab("Regulatory Roadmap")} className="text-sm font-semibold text-blue-700">Open roadmap</button></div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            {approvals.slice(0, 3).map((approval: any) => <div key={approval.id} className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 last:border-0"><div><p className="font-semibold text-slate-800">{approval.name}</p><p className="mt-1 text-xs text-slate-500">{approval.authority}</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{approval.status}</span></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "Evidence Vault") {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Evidence Vault</h2>
        <div className="space-y-3">
          {activeCase.documents?.map((doc: any) => (
            <div key={doc.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
              <span className="text-sm font-medium text-slate-800">{doc.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${ ['Verified', 'VERIFIED'].includes(doc.status) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700' }`}>{doc.status || 'Required'}</span>
                <button
                  onClick={() => setSelectedDocument(doc)}
                  className="text-xs px-3 py-1 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-bold"
                >View</button>
                <button
                  onClick={() => updateCase({ documents: activeCase.documents.map((d: any) => d.id === doc.id ? { ...d, status: 'Verified' } : d) })}
                  className="text-xs px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold"
                >Verify</button>
              </div>
            </div>
          ))}
          {(!activeCase.documents || activeCase.documents.length === 0) && (
            <p className="text-sm text-slate-500 italic text-center py-8">No documents in vault.</p>
          )}
          {selectedDocument && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Evidence preview</p>
                  <h3 className="mt-1 font-bold text-slate-900">{selectedDocument.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">Document hash: {selectedDocument.hash || 'Pending verification'} · Uploaded: {selectedDocument.uploadedAt ? new Date(selectedDocument.uploadedAt).toLocaleDateString() : 'Demo upload'}</p>
                </div>
                <button onClick={() => setSelectedDocument(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800">Close</button>
              </div>
              <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4 text-sm text-slate-600">Demo evidence is available for CA verification. Use Verify to record the review outcome.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "Document Review") {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Document Verification Queue
        </h2>
        <div className="space-y-4">
          {selectedDocument && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Reviewing evidence</p>
                  <h3 className="mt-1 font-bold text-slate-900">{selectedDocument.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">Status: {selectedDocument.status} · Hash: {selectedDocument.hash || 'Pending verification'}</p>
                </div>
                <button onClick={() => setSelectedDocument(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800">Close</button>
              </div>
              <p className="mt-4 rounded-lg border border-blue-100 bg-white p-4 text-sm text-slate-600">Demo review preview. Confirm the document record with Verify when the evidence is acceptable.</p>
            </div>
          )}
          {activeCase.documents?.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-slate-400" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{doc.name}</h3>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Status: {doc.status}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedDocument(doc)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100">Review</button>
                {doc.status !== 'Verified' ? (
                  <button 
                    onClick={() => {
                      const updatedDocs = activeCase.documents.map(d => 
                        d.id === doc.id ? { ...d, status: 'Verified' as const } : d
                      );
                      updateCase({ documents: updatedDocs });
                    }} 
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100"
                  >
                    Verify
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
          {(!activeCase.documents || activeCase.documents.length === 0) && (
            <p className="text-sm text-slate-500 italic">No documents currently uploaded by the applicant.</p>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "Communication") {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Draft Response / Statutory Report
        </h2>
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Draft an official review report or send requirements to the applicant regarding Case <strong>{activeCase.id}</strong>.
          </p>
          <textarea 
            value={reportDraft}
            onChange={(event) => setReportDraft(event.target.value)}
            className="w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors resize-none"
            placeholder="E.g., Based on the submitted business profile for Food Processing, the following documents require revision before final submission to MPCB..."
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => alert("Draft saved locally.")} className="px-5 py-2.5 rounded-lg font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              Save Draft
            </button>
            <button onClick={() => { if (reportDraft.trim()) { addMessage({ sender: 'ca', text: reportDraft }); setReportDraft(""); } }} disabled={!reportDraft.trim()} className="px-5 py-2.5 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" /> Send Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "Requirements") {
    const requirements = [
      ["Environmental Impact Assessment", "Confirm the noise-monitoring section and effluent mitigation timeline.", "Needs applicant input"],
      ["Factory layout plan", "Provide architect seal and machinery placement schedule.", "Ready to review"],
      ["Land lease deed", "Confirm plot number and MIDC allotment reference.", "Ready to review"],
    ];
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800">Requirements & Additional Information</h2>
        <p className="mt-2 text-sm text-slate-500">Issue and track clarifications required before the CA can recommend submission.</p>
        <div className="mt-6 space-y-3">{requirements.map(([title, detail, status]) => <div key={title} className="rounded-xl border border-slate-200 p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-1 text-sm text-slate-600">{detail}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${status === 'Needs applicant input' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{status}</span></div><button onClick={() => { addMessage({ sender: 'ca', text: `Additional information requested: ${title}. ${detail}` }); setActiveTab("Communication"); }} className="mt-4 text-sm font-bold text-blue-700 hover:text-blue-800">Request clarification</button></div>)}</div>
      </div>
    );
  }

  if (activeTab === "Regulatory Roadmap") {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh]">
        <div className="flex items-start justify-between gap-4 mb-6"><div><h2 className="text-xl font-bold text-slate-800">Regulatory Roadmap</h2><p className="mt-1 text-sm text-slate-500">CA review sequence for Case {activeCase.id}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{approvals.length} approvals</span></div>
        <div className="space-y-3">
          {approvals.map((approval: any, index: number) => <div key={approval.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{index + 1}</span><div className="flex-1"><h3 className="font-bold text-slate-900">{approval.name}</h3><p className="mt-1 text-sm text-slate-500">{approval.authority} · SLA {approval.slaDays || '—'} days · Fee ₹{approval.fee || 0}</p></div><span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{approval.status}</span></div>)}
        </div>
      </div>
    );
  }

  // DEFAULT: Case Review
  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[80vh]">
      {/* LEFT: Case Summary & Navigation */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Active Case</span>
              <span className="font-mono text-sm font-bold text-slate-800">{activeCase.id}</span>
            </div>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase">In Review</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Business Activity</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Building2 className="w-4 h-4 text-slate-400" />
                {discoveryResult?.subType || discoveryResult?.businessType || 'Pending project classification'}
              </div>
            </div>
            
            <div>
              <span className="text-xs text-slate-500 block mb-1">Location</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-slate-400" />
                {discoveryResult?.location || 'Location pending'}{discoveryResult?.district ? `, ${discoveryResult.district}` : ''}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1">Overall Status</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-600">
                <Clock className="w-4 h-4" />
                Pending Applicant Documents
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-sm font-bold text-slate-800 mb-3">Workspace Navigation</h3>
           <nav className="space-y-1">
             <button onClick={() => alert("Switched to Overview.")} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700">Overview</button>
             <button onClick={() => alert("Switched to Regulatory Roadmap.")} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50">Regulatory Roadmap</button>
             <button onClick={() => alert("Switched to Document Vault.")} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 flex justify-between">
               Documents 
               <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">2 Missing</span>
             </button>
           </nav>
        </div>
      </div>

      {/* CENTER: Applicant's Journey / Roadmap Review */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Regulatory Roadmap Review
        </h2>

        {/* Displaying Applicant's answers as context */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Applicant Data Context</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(activeCase.applicantAnswers).slice(0, 6).map(([k, v]) => (
              <div key={k}>
                <span className="text-[10px] text-slate-500 uppercase">{k}</span>
                <p className="text-sm font-medium text-slate-800">{String(v)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Case Documents Vault */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Case Documents ({activeCase.documents.length})</h3>
          
          {activeCase.documents.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No documents uploaded by applicant yet.</p>
          ) : (
            activeCase.documents.map((doc, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{doc.name}</p>
                    <p className="text-xs text-slate-500">Uploaded by {doc.owner}</p>
                  </div>
                </div>
                <button onClick={() => alert(`Opening secure viewer for ${doc.name}...`)} className="text-xs text-blue-600 font-bold hover:underline">View Evidence</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Communication & Actions */}
      <div className="w-full lg:w-96 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Applicant Communication
          </h3>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px] bg-slate-50/50">
          {activeCase.messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'ca' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                msg.sender === 'ca' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))}
          {activeCase.messages.length === 0 && (
            <p className="text-center text-xs text-slate-400 mt-10">No messages yet. Start the conversation.</p>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-3">
          <div className="flex gap-2">
            <button 
              onClick={handleSuggestChange}
              className="flex-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-amber-100 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" /> Suggest Change
            </button>
            <button onClick={() => alert("Document Request Template opened.\nSelect the required document and it will notify the applicant.")} className="flex-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-200 transition-colors">
              <Paperclip className="w-3 h-3" /> Request Doc
            </button>
          </div>
          <div className="flex gap-2">
            <input 
              type="text"
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type message to applicant..."
              className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!msgInput.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
