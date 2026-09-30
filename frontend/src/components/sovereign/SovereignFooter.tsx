"use client";

import React from "react";

export function SovereignFooter(): React.ReactElement {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-4 px-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <span className="text-xs font-bold text-slate-700">© 2026 PramaanFlow</span>
          <span className="text-xs text-slate-500">
            Sovereign National Regulatory Intelligence Platform
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-0.5 text-xs text-slate-600">
            MeitY &amp; DPIIT Compliant
          </span>
        </div>

        {/* Right side */}
        <div className="flex flex-col md:items-end gap-1 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a
              href="#security-protocol"
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Sovereign Data Security Protocol
            </a>
            <a
              href="#data-governance"
              className="text-slate-600 hover:text-slate-900 underline"
            >
              National Data Governance Framework
            </a>
            <a
              href="#dpdp-act"
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Digital Personal Data Protection Act
            </a>
          </div>
          <div>
            <a
              href="#audit-registry"
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Statutory Audit Registry
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
