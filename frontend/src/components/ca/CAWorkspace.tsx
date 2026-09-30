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
  const { activeCase, updateCase, addMessage, activeTab } = useDemoState();
  const [msgInput, setMsgInput] = useState("");

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

  if (activeTab === "Document Verification") {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Document Verification Queue
        </h2>
        <div className="space-y-4">
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
                <button onClick={() => alert(`Reviewing document: ${doc.name}...`)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100">Review</button>
                {doc.status !== 'Verified' ? (
                  <button 
                    onClick={() => {
                      const updatedDocs = activeCase.documents.map(d => 
                        d.id === doc.id ? { ...d, status: 'Verified' } : d
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

  if (activeTab === "Draft Response") {
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
            className="w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors resize-none"
            placeholder="E.g., Based on the submitted business profile for Food Processing, the following documents require revision before final submission to MPCB..."
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button className="px-5 py-2.5 rounded-lg font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              Save Draft
            </button>
            <button onClick={() => alert("Response sent to Applicant!")} className="px-5 py-2.5 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" /> Send Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "AI Copilot") {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-600 to-emerald-600 text-transparent bg-clip-text">Pramaan AI Copilot</span>
        </h2>
        <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">CA Assistant</span>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">Online</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end space-y-4">
            <div className="self-start max-w-[80%] bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-700">
              Hello! I am your regulatory AI assistant. I have pre-analyzed Case {activeCase.id}. I can help you cross-verify their documents against the Factory Act or check state subsidies. How can I assist?
            </div>
          </div>
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input type="text" placeholder="Ask AI about regulations or this case..." className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Ask</button>
          </div>
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
                {discoveryResult.subType || discoveryResult.businessType}
              </div>
            </div>
            
            <div>
              <span className="text-xs text-slate-500 block mb-1">Location</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-slate-400" />
                {discoveryResult.location}, {discoveryResult.district}
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
