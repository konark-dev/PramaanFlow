"use client";

import React, { useMemo, useState } from "react";
import { useDemoState } from "@/lib/context/DemoStateContext";
import {
  Shield, FileCheck2, Upload, AlertCircle, Loader2, CheckCircle, PackageCheck,
  Send, FileSearch, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, FileText,
  Activity, Check, ArrowRight, Eye, XCircle, RefreshCw
} from "lucide-react";

interface AIAnalysis {
  score: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
  flaws: string[];
  passedChecks: string[];
}

interface PrevalidationResult {
  status: 'pending' | 'running' | 'passed' | 'failed';
  checks: { label: string; passed: boolean; detail: string }[];
  overallScore: number;
}

export function EvidenceVaultChecklist() {
  const { activeCase, updateCase } = useDemoState();
  const [view, setView] = useState<'review' | 'prevalidation' | 'verification'>('review');
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AIAnalysis>>({});
  const [packaging, setPackaging] = useState(false);

  // Prevalidation state
  const [prevalidationResults, setPrevalidationResults] = useState<Record<string, PrevalidationResult>>({});
  const [runningPrevalidation, setRunningPrevalidation] = useState<string | null>(null);

  // Extract all required documents from the generated roadmap
  const requiredDocs = useMemo(() => {
    const docs = new Map<string, { id: string; name: string; requiredFor: string[] }>();

    if (activeCase.roadmap?.approvals) {
      activeCase.roadmap.approvals.forEach((approval: any) => {
        approval.requirements?.forEach((req: string) => {
          if (!docs.has(req)) {
            docs.set(req, { id: req, name: req, requiredFor: [approval.name] });
          } else {
            docs.get(req)!.requiredFor.push(approval.name);
          }
        });
      });
    }

    if (docs.size === 0) {
      docs.set("site_plan", { id: "site_plan", name: "Approved Site/Layout Plan", requiredFor: ["Building Plan Approval"] });
      docs.set("id_proof", { id: "id_proof", name: "Director ID Proof (Aadhaar/PAN)", requiredFor: ["Company Incorporation", "Tax Registration"] });
      docs.set("land_registry", { id: "land_registry", name: "Land Ownership/Lease Deed", requiredFor: ["Land Use Clearance", "Fire NOC"] });
      docs.set("gst_cert", { id: "gst_cert", name: "GST Registration Certificate", requiredFor: ["Tax Registration"] });
      docs.set("env_clearance", { id: "env_clearance", name: "Environmental Impact Assessment", requiredFor: ["CPCB Clearance", "State Pollution Board"] });
    }

    return Array.from(docs.values());
  }, [activeCase.roadmap]);

  // Mock prevalidation checks per doc
  const generatePrevalidation = (docId: string): PrevalidationResult => {
    if (docId.includes("site_plan") || docId.includes("layout")) {
      return {
        status: 'passed',
        overallScore: 96,
        checks: [
          { label: "File Format", passed: true, detail: "PDF/A-1b compliant" },
          { label: "File Size", passed: true, detail: "2.4 MB (under 10 MB limit)" },
          { label: "Resolution", passed: true, detail: "300 DPI — meets minimum 150 DPI" },
          { label: "Architect Seal Present", passed: true, detail: "Digital seal detected on page 1" },
          { label: "Page Count", passed: true, detail: "3 pages — within acceptable range" },
        ]
      };
    } else if (docId.includes("id_proof") || docId.includes("aadhaar")) {
      return {
        status: 'failed',
        overallScore: 62,
        checks: [
          { label: "File Format", passed: true, detail: "JPEG — accepted format" },
          { label: "File Size", passed: true, detail: "890 KB (under 5 MB limit)" },
          { label: "Resolution", passed: false, detail: "72 DPI — below minimum 150 DPI required" },
          { label: "Name Extraction", passed: true, detail: "Name extracted: Rajesh Kumar Agarwal" },
          { label: "Address Format", passed: false, detail: "Address missing PIN code — required by portal" },
        ]
      };
    } else if (docId.includes("gst")) {
      return {
        status: 'passed',
        overallScore: 91,
        checks: [
          { label: "File Format", passed: true, detail: "PDF — accepted" },
          { label: "File Size", passed: true, detail: "320 KB" },
          { label: "GSTIN Pattern", passed: true, detail: "22AAAAA0000A1Z5 — valid 15-digit format" },
          { label: "Certificate Validity", passed: true, detail: "Valid from 01/04/2025 — not expired" },
          { label: "Digital Signature", passed: true, detail: "DSC detected and integrity verified" },
        ]
      };
    } else if (docId.includes("env")) {
      return {
        status: 'passed',
        overallScore: 85,
        checks: [
          { label: "File Format", passed: true, detail: "PDF — accepted" },
          { label: "File Size", passed: true, detail: "4.8 MB (under 10 MB limit)" },
          { label: "Mandatory Sections", passed: true, detail: "All 8 required sections found" },
          { label: "Signature Page", passed: true, detail: "Authorized signatory page present" },
          { label: "Date of Assessment", passed: true, detail: "Dated 2026-02-14 — within 1 year validity" },
        ]
      };
    } else {
      return {
        status: 'passed',
        overallScore: 88,
        checks: [
          { label: "File Format", passed: true, detail: "PDF — accepted format" },
          { label: "File Size", passed: true, detail: "1.1 MB (under 10 MB limit)" },
          { label: "Text Extractable", passed: true, detail: "OCR layer present — text is searchable" },
          { label: "Required Fields", passed: true, detail: "All mandatory fields detected" },
          { label: "Document Integrity", passed: true, detail: "No signs of tampering detected" },
        ]
      };
    }
  };

  const handleRunPrevalidation = (docId: string) => {
    setRunningPrevalidation(docId);
    // Simulate delay
    setTimeout(() => {
      const result = generatePrevalidation(docId);
      setPrevalidationResults(prev => ({ ...prev, [docId]: result }));
      setRunningPrevalidation(null);
    }, 1500);
  };

  const handleRunAllPrevalidation = () => {
    let delay = 0;
    requiredDocs.forEach((doc) => {
      setTimeout(() => {
        setRunningPrevalidation(doc.id);
        setTimeout(() => {
          const result = generatePrevalidation(doc.id);
          setPrevalidationResults(prev => ({ ...prev, [doc.id]: result }));
          setRunningPrevalidation(null);
        }, 1200);
      }, delay);
      delay += 1600;
    });
  };

  const generateMockAnalysis = (docId: string): AIAnalysis => {
    if (docId.includes("site_plan") || docId.includes("layout")) {
      return {
        score: 94,
        status: 'PASS',
        flaws: ["Legend text is slightly small but readable (Sec 12.4 violation risk)"],
        passedChecks: ["Dimensions clearly marked", "Architect seal detected & verified", "Matches GIS plot boundaries"]
      };
    } else if (docId.includes("id_proof") || docId.includes("aadhaar")) {
      return {
        score: 82,
        status: 'WARNING',
        flaws: ["Address string format differs from portal standard", "Photo is slightly underexposed"],
        passedChecks: ["Government ID format valid", "Name perfectly matches applicant profile", "Not expired"]
      };
    } else if (docId.includes("gst")) {
      return {
        score: 97,
        status: 'PASS',
        flaws: [],
        passedChecks: ["GSTIN validated against GST portal", "Business name matches company registration", "Active status confirmed", "Certificate seal intact"]
      };
    } else if (docId.includes("env")) {
      return {
        score: 79,
        status: 'WARNING',
        flaws: ["Noise pollution section (Section 5.3) has incomplete data", "Mitigation plan lacks timeline for effluent treatment"],
        passedChecks: ["EIA format compliant with MoEFCC guidelines", "Impact assessment methodology validated", "Public consultation records present"]
      };
    } else {
      return {
        score: 88,
        status: 'PASS',
        flaws: ["Document scanned at slight angle (3 degrees) - auto-corrected"],
        passedChecks: ["Digital signature verified", "Required clauses present", "Date of issuance is valid"]
      };
    }
  };

  const handleUploadAndVerify = (docId: string) => {
    const pre = prevalidationResults[docId];
    if (!pre || pre.status !== 'passed') {
      return; // Should not happen as button is disabled
    }
    setVerifyingDocId(docId);

    // Simulate AI verification delay
    setTimeout(() => {
      const analysis = generateMockAnalysis(docId);
      setAnalysisResults(prev => ({ ...prev, [docId]: analysis }));

      const updatedDocs = [
        ...(activeCase.documents || []),
        {
          id: docId,
          name: docId,
          requiredFor: [],
          type: docId,
          status: "VERIFIED" as const,
          url: "/mock-doc.pdf",
          hash: "0x" + Math.random().toString(16).substring(2, 10).toUpperCase(),
          uploadedAt: new Date().toISOString()
        }
      ];

      updateCase({ documents: updatedDocs });
      setVerifyingDocId(null);
      setExpandedDocId(docId); // Auto-expand to show results
    }, 2500);
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

  const allPrevalidated = requiredDocs.every(doc => {
    const r = prevalidationResults[doc.id];
    return r && r.status === 'passed';
  });

  const prevalidatedCount = requiredDocs.filter(doc => {
    const r = prevalidationResults[doc.id];
    return r && (r.status === 'passed' || r.status === 'failed');
  }).length;

  // --- VIEW 1: CASE REVIEW ---
  if (view === 'review') {
    const dr = activeCase.discoveryResult;
    return (
      <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Pre-Submission Case Review
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Review your application summary before proceeding to document prevalidation.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Application Facts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Enterprise Type</p>
              <p className="text-slate-900 font-medium text-lg">{dr?.subType || dr?.businessType || "Industrial Manufacturing"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Project Location</p>
              <p className="text-slate-900 font-medium text-lg">{dr?.location || "MIDC Chakan, Pune"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Scale / Capacity</p>
              <p className="text-slate-900 font-medium text-lg">{dr?.capacity || dr?.scale || "Large Scale"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Regulatory Intent</p>
              <p className="text-slate-900 font-medium text-lg">{dr?.intent || "New Setup"}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900">Next: Document Prevalidation</h3>
              <p className="text-blue-800 mt-1">
                Before AI verification, we&apos;ll run quick prevalidation checks on your {requiredDocs.length} documents — verifying file format, size, resolution, required fields, and basic compliance rules. This catches obvious issues <strong>before</strong> the deep AI scan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setView('prevalidation')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Proceed to Prevalidation <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: PREVALIDATION ---
  if (view === 'prevalidation') {
    return (
      <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Eye className="w-7 h-7 text-blue-600" />
              Document Prevalidation
            </h1>
            <p className="text-slate-500 mt-2">
              Quick automated checks before AI deep scan — file format, size, resolution, required fields, and basic government portal rules.
            </p>
          </div>
          <button onClick={() => setView('review')} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
            &larr; Back to Case Review
          </button>
        </div>

        {/* Run All Button */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">{prevalidatedCount}</span> / {requiredDocs.length} documents checked
          </div>
          <button
            onClick={handleRunAllPrevalidation}
            disabled={runningPrevalidation !== null}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {runningPrevalidation ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Running...</>
            ) : (
              <><RefreshCw className="w-4 h-4" /> Run All Prevalidation</>
            )}
          </button>
        </div>

        {/* Document Cards */}
        <div className="space-y-4 mb-8">
          {requiredDocs.map(doc => {
            const pre = prevalidationResults[doc.id];
            const isRunning = runningPrevalidation === doc.id;

            return (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Header Row */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      pre?.status === 'passed' ? 'bg-emerald-100 text-emerald-600' :
                      pre?.status === 'failed' ? 'bg-rose-100 text-rose-600' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {pre?.status === 'passed' ? <CheckCircle className="w-5 h-5" /> :
                       pre?.status === 'failed' ? <XCircle className="w-5 h-5" /> :
                       <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Required for: {doc.requiredFor.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Score Badge */}
                    {pre && pre.status !== 'pending' && (
                      <div className="text-right">
                        <div className="flex items-end gap-1">
                          <span className={`text-2xl font-black leading-none ${
                            pre.overallScore >= 85 ? 'text-emerald-600' :
                            pre.overallScore >= 65 ? 'text-amber-500' : 'text-rose-600'
                          }`}>
                            {pre.overallScore}
                          </span>
                          <span className="text-xs font-bold text-slate-400 mb-0.5">/ 100</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${
                          pre.status === 'passed' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {pre.status === 'passed' ? 'PREVALIDATION PASSED' : 'NEEDS ATTENTION'}
                        </span>
                      </div>
                    )}

                    {/* Action Button */}
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-blue-600 font-medium text-sm px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Checking...
                      </div>
                    ) : !pre ? (
                      <button
                        onClick={() => handleRunPrevalidation(doc.id)}
                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        <Eye className="w-4 h-4" /> Run Check
                      </button>
                    ) : (
                      <button
                        onClick={() => setExpandedDocId(expandedDocId === doc.id ? null : doc.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        {expandedDocId === doc.id ? 'Hide' : 'Details'}
                        {expandedDocId === doc.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Check Details */}
                {expandedDocId === doc.id && pre && (
                  <div className="border-t border-slate-100 bg-slate-50 p-5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Prevalidation Checks</h4>
                    <div className="space-y-2">
                      {pre.checks.map((check, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${
                          check.passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {check.passed ? (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <span className="font-semibold text-sm text-slate-800">{check.label}</span>
                          </div>
                          <span className={`text-xs font-medium ${check.passed ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {check.detail}
                          </span>
                        </div>
                      ))}
                    </div>

                    {pre.status === 'failed' && (
                      <div className="mt-4 bg-rose-100 border border-rose-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                        <div className="text-sm text-rose-800">
                          <strong>Action Required:</strong> Fix the flagged issues and re-upload the document. You can still proceed to AI verification for other documents.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Proceed to AI Verification */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-500/20">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
              <FileSearch className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Ready for AI Deep Verification?</h3>
              <p className="text-indigo-200/70 text-sm mt-1">
                {allPrevalidated
                  ? "All documents passed prevalidation. Proceed to AI-powered deep scan."
                  : `${prevalidatedCount} of ${requiredDocs.length} documents checked. Complete all prevalidation first.`}
              </p>
            </div>
          </div>

          <button
            disabled={!allPrevalidated}
            onClick={() => { setView('verification'); setExpandedDocId(null); }}
            className={`shrink-0 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              allPrevalidated
                ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            Proceed to AI Verification <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 3: PACKAGE CREATED ---
  if (activeCase.isPackaged) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-center max-w-2xl mx-auto animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50">
          <PackageCheck className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Submission Package Ready</h2>
        <p className="text-slate-600 mb-8 text-lg">
          All documents have been prevalidated, AI-verified, scored, and bound into a tamper-proof digital package.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 w-full text-left mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10" />
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

  // --- VIEW 4: AI VERIFICATION CHECKLIST ---
  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <FileSearch className="w-7 h-7 text-emerald-600" />
            AI Document Verification
          </h1>
          <p className="text-slate-500 mt-2">
            All documents passed prevalidation. Now our AI will deep-scan each one, score compliance (out of 100), and flag flaws based on government guidelines.
          </p>
        </div>
        <button onClick={() => setView('prevalidation')} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
          &larr; Back to Prevalidation
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-5">Required Document</div>
          <div className="col-span-3">AI Score</div>
          <div className="col-span-4 text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          {requiredDocs.map(doc => {
            const uploadedDoc = activeCase.documents?.find(d => d.type === doc.id);
            const isVerified = uploadedDoc?.status === "VERIFIED";
            const isVerifying = verifyingDocId === doc.id;
            const analysis = analysisResults[doc.id];
            const isExpanded = expandedDocId === doc.id;
            const pre = prevalidationResults[doc.id];

            return (
              <div key={doc.id} className="flex flex-col">
                <div className={`grid grid-cols-12 items-center py-5 px-6 transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}>

                  <div className="col-span-5 pr-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {isVerified ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">For: {doc.requiredFor.join(", ")}</p>
                      {pre && (
                        <span className={`text-[10px] font-bold uppercase mt-1 inline-block px-1.5 py-0.5 rounded ${
                          pre.status === 'passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          Preval: {pre.overallScore}/100
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 pr-4">
                    {isVerified && analysis ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-end gap-1">
                          <span className={`text-2xl font-bold leading-none ${analysis.score >= 90 ? 'text-emerald-600' : analysis.score >= 75 ? 'text-amber-500' : 'text-rose-600'}`}>
                            {analysis.score}
                          </span>
                          <span className="text-xs font-bold text-slate-400 mb-0.5">/ 100</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                          analysis.status === 'PASS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          analysis.status === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {analysis.status}
                        </span>
                      </div>
                    ) : isVerifying ? (
                      <span className="inline-flex items-center gap-2 text-indigo-600 font-medium text-sm">
                        <Activity className="w-4 h-4 animate-pulse" /> Scanning...
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate-400">Pending</span>
                    )}
                  </div>

                  <div className="col-span-4 flex justify-end items-center gap-3">
                    {isVerified ? (
                      <button
                        onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        {isExpanded ? 'Hide Report' : 'View Report'}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    ) : isVerifying ? (
                      <div className="w-28 h-8 bg-slate-100 rounded animate-pulse" />
                    ) : (
                      <button
                        onClick={() => handleUploadAndVerify(doc.id)}
                        disabled={!pre || pre.status !== 'passed'}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                          pre?.status === 'passed'
                            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        <Upload className="w-4 h-4" /> AI Verify
                      </button>
                    )}
                  </div>
                </div>

                {/* EXPANDED AI REPORT */}
                {isExpanded && analysis && (
                  <div className="bg-slate-900 text-white p-6 rounded-b-xl mx-4 mb-4 shadow-inner">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        AI Deep Scan Report
                      </h4>
                      <div className="font-mono text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded">
                        HASH: {uploadedDoc?.hash}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Flaws Section */}
                      <div>
                        <h5 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Detected Flaws / Warnings
                        </h5>
                        {analysis.flaws.length > 0 ? (
                          <ul className="space-y-2">
                            {analysis.flaws.map((flaw, idx) => (
                              <li key={idx} className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-200 p-3 rounded-lg text-sm">
                                <span className="mt-0.5 shrink-0 text-rose-400">•</span>
                                {flaw}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-lg text-sm flex items-center gap-2">
                            <Check className="w-4 h-4" /> No flaws detected. Perfect match.
                          </div>
                        )}
                      </div>

                      {/* Passed Checks Section */}
                      <div>
                        <h5 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          Guidelines Verified
                        </h5>
                        <ul className="space-y-2">
                          {analysis.passedChecks.map((check, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-slate-800 border border-slate-700 text-slate-300 p-3 rounded-lg text-sm">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                              {check}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-900/20 border border-indigo-500/20">
        <div className="flex items-center gap-4 text-white">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
            <PackageCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Sovereign Package Generation</h3>
            <p className="text-indigo-200/70 text-sm mt-1">
              {isAllVerified
                ? "All documents passed AI verification. Ready to seal."
                : "Verify all documents above to unlock packaging."}
            </p>
          </div>
        </div>

        <button
          disabled={!isAllVerified || packaging}
          onClick={handleCreatePackage}
          className={`shrink-0 px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            isAllVerified
              ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5"
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
