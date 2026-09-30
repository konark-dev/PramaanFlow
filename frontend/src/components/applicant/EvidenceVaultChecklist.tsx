"use client";

import React, { useMemo, useState } from "react";
import { useDemoState } from "@/lib/context/DemoStateContext";
import { Shield, FileCheck2, Upload, AlertCircle, Loader2, CheckCircle, PackageCheck, Send } from "lucide-react";

export function EvidenceVaultChecklist() {
  const { activeCase, updateCase } = useDemoState();
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
  const [packaging, setPackaging] = useState(false);

  // Extract all required documents from the generated roadmap
  const requiredDocs = useMemo(() => {
    const docs = new Map<string, { id: string; name: string; requiredFor: string[] }>();
    
    if (activeCase.roadmap?.approvals) {
      activeCase.roadmap.approvals.forEach(approval => {
        approval.requirements?.forEach(req => {
          if (!docs.has(req)) {
            docs.set(req, { id: req, name: req, requiredFor: [approval.name] });
          } else {
            docs.get(req)!.requiredFor.push(approval.name);
          }
        });
      });
    }
    
    // Add some common fallbacks if roadmap is empty or missing requirements
    if (docs.size === 0) {
      docs.set("site_plan", { id: "site_plan", name: "Approved Site/Layout Plan", requiredFor: ["Building Plan Approval"] });
      docs.set("id_proof", { id: "id_proof", name: "Director ID Proof (Aadhaar/PAN)", requiredFor: ["Company Incorporation", "Tax Registration"] });
      docs.set("land_registry", { id: "land_registry", name: "Land Ownership/Lease Deed", requiredFor: ["Land Use Clearance", "Fire NOC"] });
    }
    
    return Array.from(docs.values());
  }, [activeCase.roadmap]);

  const handleUploadAndVerify = (docId: string) => {
    // 1. Mark as uploading/verifying
    setVerifyingDocId(docId);
    
    // 2. Simulate AI verification delay
    setTimeout(() => {
      const updatedDocs = [
        ...(activeCase.documents || []),
        {
          id: docId,
          type: docId,
          status: "VERIFIED" as const,
          url: "/mock-doc.pdf",
          hash: "0x" + Math.random().toString(16).substring(2, 10).toUpperCase(),
          uploadedAt: new Date().toISOString()
        }
      ];
      
      updateCase({ documents: updatedDocs });
      setVerifyingDocId(null);
    }, 2000);
  };

  const handleCreatePackage = () => {
    setPackaging(true);
    setTimeout(() => {
      setPackaging(false);
      updateCase({
        isPackaged: true,
        packageHash: "PKG-" + Math.random().toString(36).substring(2, 10).toUpperCase()
      });
    }, 3000);
  };

  const isAllVerified = requiredDocs.every(doc => 
    activeCase.documents?.some(d => d.type === doc.id && d.status === "VERIFIED")
  );

  if (activeCase.isPackaged) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-center max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <PackageCheck className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Submission Package Ready</h2>
        <p className="text-slate-600 mb-8 text-lg">
          All documents have been successfully verified by PramaanFlow Sovereign AI and bound into a tamper-proof digital package.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 w-full text-left mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-slate-700">Sovereign Package ID</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">{activeCase.packageHash}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-slate-700">Documents Included</span>
            <span className="text-slate-900 font-medium">{requiredDocs.length} Verified Files</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700">Timestamp</span>
            <span className="text-slate-500 text-sm">{new Date().toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={() => alert("Dispatching package to all relevant statutory authorities... (Demo End)")}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-colors shadow-lg"
        >
          <Send className="w-5 h-5" />
          Submit to Government Portals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <FileCheck2 className="w-7 h-7 text-emerald-600" />
          Pre-Submission Evidence Checklist
        </h1>
        <p className="text-slate-500 mt-2">
          Upload your required documents below. PramaanFlow AI will verify the contents against statutory rules before allowing you to create the final submission package.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">Document Requirement</div>
          <div className="col-span-4">Needed For</div>
          <div className="col-span-4 text-right">Verification Status</div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {requiredDocs.map(doc => {
            const uploadedDoc = activeCase.documents?.find(d => d.type === doc.id);
            const isVerified = uploadedDoc?.status === "VERIFIED";
            const isVerifying = verifyingDocId === doc.id;

            return (
              <div key={doc.id} className="grid grid-cols-12 items-center py-5 px-6 hover:bg-slate-50/50 transition-colors">
                <div className="col-span-4 pr-4">
                  <p className="font-semibold text-slate-900">{doc.name}</p>
                </div>
                
                <div className="col-span-4 pr-4">
                  <div className="flex flex-wrap gap-1.5">
                    {doc.requiredFor.map(req => (
                      <span key={req} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-4 flex justify-end items-center gap-4">
                  {isVerified ? (
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded text-xs font-bold border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> VERIFIED BY AI
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">Hash: {uploadedDoc.hash}</span>
                    </div>
                  ) : isVerifying ? (
                    <span className="inline-flex items-center gap-2 text-amber-600 font-medium text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleUploadAndVerify(doc.id)}
                      className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      <Upload className="w-4 h-4" /> Upload & Verify
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-900/10">
        <div className="flex items-center gap-4 text-white">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Sovereign Package Generation</h3>
            <p className="text-slate-400 text-sm mt-1">
              {isAllVerified 
                ? "All documents verified. Ready to seal." 
                : "Complete all AI verifications above to unlock packaging."}
            </p>
          </div>
        </div>

        <button
          disabled={!isAllVerified || packaging}
          onClick={handleCreatePackage}
          className={`shrink-0 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            isAllVerified 
              ? "bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {packaging ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Sealing Package...</>
          ) : (
            <><PackageCheck className="w-5 h-5" /> Create Submission Package</>
          )}
        </button>
      </div>
    </div>
  );
}
