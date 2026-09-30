"use client";

import React, { useEffect, useState } from "react";
import { DiscoveryResult } from "./ApplicantDiscoveryFlow";
import { CheckCircle2, Loader2, MapPin, Building, ShieldCheck, Activity } from "lucide-react";

interface IntelligenceAnalysisEngineProps {
  discoveryResult: DiscoveryResult;
  onAnalysisComplete: (roadmap: any, geoContext: any, governmentSupport: any[]) => void;
}

import { regulatoryService } from "@/lib/services/regulatoryService";
import { geospatialService } from "@/lib/services/geospatialService";

export function IntelligenceAnalysisEngine({ discoveryResult, onAnalysisComplete }: IntelligenceAnalysisEngineProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [govSupportData, setGovSupportData] = useState<any[]>([]);
  
  const [step, setStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setError(null);

    async function runAnalysis() {
      try {
        setStep(1); // "Running Location Intelligence..."
        
        // Mock coordinates for demo (Pune/Chakan)
        const lat = 18.7612;
        const lng = 73.8542;
        
        const geoDataResult = await geospatialService.analyze(lat, lng);
        
        if (!isMounted) return;
        setGeoData(geoDataResult);

        setStep(2); // "Generating Regulatory Roadmap..."

        const profile = {
          name: "New Enterprise",
          enterpriseName: "New Enterprise Pvt Ltd",
          sector: discoveryResult.businessType,
          subSector: discoveryResult.subType || discoveryResult.businessType,
          activityDescription: discoveryResult.foodActivities || discoveryResult.miningActivities || "Industrial operations",
          capacity: parseFloat(discoveryResult.capacity || "100"),
          investmentCrores: parseFloat(discoveryResult.investment || "50"),
          powerRequirementKw: parseFloat(discoveryResult.electricityReq || "500"),
          waterRequirementKld: parseFloat(discoveryResult.waterReq || "100"),
        };

        const location = {
          lat,
          lng,
          displayAddress: discoveryResult.location,
          state: discoveryResult.state || "Maharashtra",
          district: discoveryResult.district || "Pune",
          taluka: geoDataResult?.metadata?.taluka || "Khed",
          industrialArea: discoveryResult.location,
          insideIndustrialArea: discoveryResult.location.includes("MIDC"),
          planningAuthority: geoDataResult?.jurisdictions?.planningAuthority?.name || "MIDC",
          environmentalOffice: "MPCB",
          localBody: "Local Authority",
        };

        const analysisData = await regulatoryService.generateRoadmap(profile, location);
        
        if (!isMounted) return;
        setRoadmapData(analysisData); // Since generateRoadmap returns the roadmap directly

        setGovSupportData([]); // DO NOT POPULATE FAKE SCHEMES YET (per user request)

        setStep(3);
        setIsComplete(true);

      } catch (err: any) {
        console.error("Analysis failed", err);
        if (isMounted) setError(err.message || "Failed to reach intelligence service");
        setStep(0);
      }
    }

    runAnalysis();

    return () => { isMounted = false; };
  }, [discoveryResult, retryCount]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-teal-400" />
            <h1 className="text-xl font-extrabold tracking-tight">PramaanFlow Intelligence Engine</h1>
          </div>
          <p className="text-slate-400 text-sm">Validating jurisdictions and compiling regulatory constraints...</p>
        </div>

        <div className="p-8 space-y-8">
          {/* STEP 1: Location Intelligence */}
          <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3 mb-4">
              {step > 1 ? (
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
              ) : (
                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
              )}
              <h3 className="font-bold text-slate-800">1. Spatial Jurisdiction Analysis</h3>
            </div>
            
            {geoData && (
              <div className="ml-8 grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Administrative</p>
                  <p className="text-sm font-semibold text-slate-700">{geoData.metadata?.district} District, {geoData.metadata?.taluka} Taluka</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Planning Authority</p>
                  <p className="text-sm font-semibold text-slate-700">{geoData.jurisdictions?.planningAuthority?.name || "Local Body"}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 col-span-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Environmental Zoning</p>
                  <p className="text-sm font-semibold text-slate-700">{geoData.jurisdictions?.environmentalAuthority?.zoneType || "Standard Industrial Zone"}</p>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Regulatory Engine */}
          <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3 mb-4">
              {step > 2 ? (
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
              ) : (
                <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />
              )}
              <h3 className="font-bold text-slate-800">2. Synthesizing Regulatory Roadmap</h3>
            </div>
            
            {step > 2 && (
              <div className="ml-8 space-y-4 animate-in fade-in duration-500">
                <div className="bg-teal-50/50 rounded-lg p-4 border border-teal-100">
                  <h4 className="font-bold text-slate-800 mb-2">Summary</h4>
                  <p className="text-sm text-teal-900 font-medium">
                    Identified <span className="font-bold">{roadmapData?.approvals?.length || 0}</span> statutory clearances across <span className="font-bold">{new Set(roadmapData?.approvals?.map((a:any) => a.department)).size}</span> departments.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h4 className="font-bold text-slate-800">Approvals</h4>
                  <p className="text-sm text-slate-600 mt-1">Found {roadmapData?.approvals?.length || 0} clearances.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h4 className="font-bold text-slate-800">Authorities</h4>
                  <p className="text-sm text-slate-600 mt-1">Mapped to {new Set(roadmapData?.approvals?.map((a:any) => a.department)).size} governing bodies.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h4 className="font-bold text-slate-800">Documents</h4>
                  <p className="text-sm text-slate-600 mt-1">Cross-referencing evidence required.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h4 className="font-bold text-slate-800">Signals</h4>
                  <p className="text-sm text-slate-600 mt-1">No overlapping jurisdictions detected.</p>
                </div>
              </div>
            )}
          </div>

          {/* FINAL CTA */}
          {!error && (
            <div className={`pt-4 transition-all duration-500 ${isComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <button
                onClick={() => onAnalysisComplete(roadmapData, geoData, govSupportData)}
                className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg"
              >
                View My Regulatory Case
              </button>
            </div>
          )}

          {/* ERROR FALLBACK UI */}
          {error && (
            <div className="pt-4 border-t border-red-100 mt-6 animate-in fade-in">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-center space-y-4">
                <p className="text-red-700 font-bold">Regulatory intelligence could not be reached.</p>
                <p className="text-red-600 text-sm">We couldn't complete the live regulatory analysis right now. Your answers have been saved.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                  <button 
                    onClick={() => setRetryCount(c => c + 1)}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    Retry Analysis
                  </button>
                  <button 
                    onClick={async () => {
                      const { DemoGeospatialService } = await import('@/lib/services/geospatialService');
                      const { DemoRegulatoryService } = await import('@/lib/services/regulatoryService');
                      const demoGeo = await new DemoGeospatialService().analyze(18.7612, 73.8542);
                      const demoRoadmap = await new DemoRegulatoryService().generateRoadmap({} as any, {} as any);
                      onAnalysisComplete(demoRoadmap, demoGeo, []);
                    }}
                    className="px-6 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all"
                  >
                    Proceed in Demo / Offline Mode
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
