"use client";

import React, { useState } from "react";
import { useDemoState } from "@/lib/context/DemoStateContext";
import { MessageSquare, Send, User, Building2, Landmark, Shield } from "lucide-react";

const SENDER_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  applicant: { label: "You (Applicant)", color: "bg-blue-600", bgColor: "bg-blue-50 border-blue-200", icon: <User className="w-3 h-3" /> },
  ca: { label: "CA / Consultant", color: "bg-amber-600", bgColor: "bg-amber-50 border-amber-200", icon: <Building2 className="w-3 h-3" /> },
  government: { label: "Government Officer", color: "bg-teal-600", bgColor: "bg-teal-50 border-teal-200", icon: <Landmark className="w-3 h-3" /> },
  inspector: { label: "Inspector", color: "bg-rose-600", bgColor: "bg-rose-50 border-rose-200", icon: <Shield className="w-3 h-3" /> },
};

export function ApplicantCommunication() {
  const { activeCase, addMessage } = useDemoState();
  const [msgInput, setMsgInput] = useState("");

  const handleSend = () => {
    if (!msgInput.trim()) return;
    addMessage({ sender: "applicant", text: msgInput });
    setMsgInput("");
  };

  return (
    <div className="max-w-3xl mx-auto py-8 flex flex-col h-full min-h-[70vh]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <MessageSquare className="w-7 h-7 text-blue-600" />
          Communication Center
        </h1>
        <p className="text-slate-500 mt-1">
          Messages between you, your CA/Consultant, and Government authorities.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[55vh]">
          {activeCase.messages.map((msg) => {
            const config = SENDER_CONFIG[msg.sender] || SENDER_CONFIG.applicant;
            const isMe = msg.sender === "applicant";

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isMe ? "order-2" : ""}`}>
                  {/* Sender Label */}
                  <div className={`flex items-center gap-1.5 mb-1 ${isMe ? "justify-end" : ""}`}>
                    <span className={`w-5 h-5 rounded-full ${config.color} text-white flex items-center justify-center`}>
                      {config.icon}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{config.label}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {" "}
                      {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {/* Message Bubble */}
                  <div className={`p-3.5 rounded-xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : `border ${config.bgColor} text-slate-800 rounded-tl-sm`
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex gap-3">
            <input
              type="text"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={handleSend}
              disabled={!msgInput.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
