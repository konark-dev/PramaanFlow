"use client";

import React, { useMemo, useState } from "react";
import { Check, CheckCircle, ChevronLeft, ChevronRight, HelpCircle, ArrowRight, Save, Shield, Info, AlertTriangle, Loader2 } from "lucide-react";
import { useDiscoveryEngine } from "@/lib/hooks/useDiscoveryEngine";
import { JourneyStepper } from '@/components/JourneyStepper';
import { DISCOVERY_STEPS, REGULATORY_QUESTIONS, QuestionDef } from "@/lib/regulatory-questions";

import { GovernmentSupportView } from "./GovernmentSupportView";

export interface DiscoveryResult {
  intent: string;
  businessType: string;
  subType?: string;
  state: string;
  district: string;
  location: string;
  [key: string]: any;
}

interface ApplicantDiscoveryFlowProps {
  onComplete: (result: DiscoveryResult) => void;
  onChange?: (answers: Record<string, any>) => void;
  onStepChange?: (stepIndex: number) => void;
}

export function ApplicantDiscoveryFlow({ onComplete, onChange, onStepChange }: ApplicantDiscoveryFlowProps) {
  const { 
    answers, 
    setAnswers, 
    regulatoryMatch, 
    setRegulatoryMatch, 
    uiState, 
    updateUI, 
    isLoaded 
  } = useDiscoveryEngine();

  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  const [tempInput, setTempInput] = useState<string>("");
  const [tempUnit, setTempUnit] = useState<string>("");
  const [tempMultiSelect, setTempMultiSelect] = useState<Set<string>>(new Set());
  const [isSimulatingAPI, setIsSimulatingAPI] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (onChange) {
      onChange(answers);
    }
  }, [answers, onChange]);

  React.useEffect(() => {
    if (onStepChange) {
      onStepChange(uiState.activeStepIndex);
    }
  }, [uiState.activeStepIndex, onStepChange]);

  const visibleQuestions = useMemo(() => {
    return REGULATORY_QUESTIONS.filter(q => {
      if (q.condition && !q.condition(answers)) return false;
      return true;
    });
  }, [answers]);

  const activeStepQuestions = useMemo(() => {
    return visibleQuestions.filter(q => q.stepIndex === uiState.activeStepIndex);
  }, [visibleQuestions, uiState.activeStepIndex]);

  const allPreviousAnswered = useMemo(() => {
    if (uiState.activeStepIndex === 0) return true;
    const prevQuestions = visibleQuestions.filter(q => q.stepIndex < uiState.activeStepIndex && !q.condition);
    return prevQuestions.every(q => answers[q.id] !== undefined);
  }, [visibleQuestions, uiState.activeStepIndex, answers]);

  const handleSelectRadio = async (q: QuestionDef, value: string) => {
    const newAnswers = { ...answers };
    
    newAnswers[q.id] = value;
    
    // Iteratively prune downstream answers whose conditions are no longer met
    let pruned;
    do {
      pruned = false;
      REGULATORY_QUESTIONS.forEach(cq => {
        if (newAnswers[cq.id] !== undefined && cq.condition && !cq.condition(newAnswers)) {
          delete newAnswers[cq.id];
          pruned = true;
        }
      });
    } while (pruned);
    setAnswers(newAnswers);
    setLastSaved(new Date());
    updateUI({ activeQuestionId: q.id });

    if (q.apiTrigger === 'geospatial') {
      setIsSimulatingAPI(prev => ({ ...prev, [q.id]: true }));
      import('@/lib/services/geospatialService').then(({ geospatialService }) => {
        geospatialService.analyze(18.7612, 73.8542, value).then((result) => {
          setIsSimulatingAPI(prev => ({ ...prev, [q.id]: false }));
          if (result.zones?.includes("Special Economic Zone") || value.includes('MIDC')) {
             setRegulatoryMatch(prev => ({
               ...prev,
               [q.id]: {
                 category: 'Special Economic Zone',
                 licenseType: 'MIDC Land Allotment & Building Plan'
               }
             }));
          }
        }).catch(err => {
          setIsSimulatingAPI(prev => ({ ...prev, [q.id]: false }));
          console.error(err);
        });
      });
    } else if (q.apiTrigger === 'analyze') {
      setIsSimulatingAPI(prev => ({ ...prev, [q.id]: true }));
      import('@/lib/services/regulatoryService').then(({ regulatoryService }) => {
        regulatoryService.generateRoadmap(newAnswers, newAnswers).then((roadmap) => {
          setIsSimulatingAPI(prev => ({ ...prev, [q.id]: false }));
          if (value.includes('Medium Scale') || value.includes('25,000')) {
            setRegulatoryMatch(prev => ({
              ...prev,
              [q.id]: {
                category: 'MPCB Orange Category',
                licenseType: 'FSSAI State License Form B'
              }
            }));
          }
        }).catch(err => {
          setIsSimulatingAPI(prev => ({ ...prev, [q.id]: false }));
          console.error(err);
        });
      });
    }
  };

  const submitInput = (qId: string) => {
    if (!tempInput.trim()) return;
    const newAnswers = { ...answers };
    newAnswers[qId] = tempInput.trim();
    let pruned;
    do {
      pruned = false;
      REGULATORY_QUESTIONS.forEach(cq => {
        if (newAnswers[cq.id] !== undefined && cq.condition && !cq.condition(newAnswers)) {
          delete newAnswers[cq.id];
          pruned = true;
        }
      });
    } while (pruned);
    setAnswers(newAnswers);
    setTempInput("");
    setLastSaved(new Date());
  };

  const submitToJourney = () => {
    onComplete({
      intent: answers.intent || 'Start a new business',
      businessType: answers.businessType || 'Food Processing',
      subType: answers.subType_food || answers.subType_mining || '',
      state: answers.loc_state || 'Maharashtra',
      district: answers.loc_district || 'Pune',
      location: answers.loc_midc || answers.loc_taluka || 'Pune',
      ...answers
    });
  };

  const goNext = () => {
    if (uiState.activeStepIndex < 3) {
      updateUI({ activeStepIndex: uiState.activeStepIndex + 1 });
    } else {
      submitToJourney();
    }
  };

  const goPrev = () => {
    if (uiState.activeStepIndex > 0) {
      updateUI({ activeStepIndex: uiState.activeStepIndex - 1 });
    }
  };

  const currentContext = useMemo(() => {
    if (!uiState.activeQuestionId) return null;
    const activeQ = REGULATORY_QUESTIONS.find(q => q.id === uiState.activeQuestionId);
    return activeQ?.contextInfo;
  }, [uiState.activeQuestionId]);

  if (!isLoaded) return <div className="min-h-screen bg-transparent flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  return (
    <div className="flex flex-col bg-transparent min-h-screen text-slate-900 font-sans">
      
      

      

      <div className="flex flex-1 overflow-hidden max-w-[1400px] mx-auto w-full">
        {/* CENTER FLOW */}
        <div className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto pb-32">
          
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6">
            {DISCOVERY_STEPS[uiState.activeStepIndex].title}
          </h2>

          <div className="space-y-6">
            {activeStepQuestions.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No additional information is required for this stage.</p>
              </div>
            ) : activeStepQuestions.map(q => {
              const isNested = !!q.parentId;
              const indentClass = isNested ? "ml-4 sm:ml-12 pl-4 sm:pl-6 border-l-[3px] border-slate-200/60" : "";
              const answer = answers[q.id];

              return (
                <div 
                  key={q.id} 
                  className={`group animate-in fade-in slide-in-from-bottom-4 duration-300 ${indentClass}`}
                  onClick={() => updateUI({ activeQuestionId: q.id })}
                >
                  <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center border border-slate-200">
                        {q.numbering}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{q.title}</h3>
                        {q.description && <p className="text-sm text-slate-500 mt-1">{q.description}</p>}
                      </div>
                    </div>

                    <div className="ml-12">
                      {/* Render inputs based on type */}
                      {q.type === 'radio' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map(opt => {
                            const isSelected = answer === opt.label;
                            return (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() => handleSelectRadio(q, opt.label)}
                                className={`text-left w-full p-4 rounded-lg border-2 transition-all flex items-start justify-between cursor-pointer ${
                                  isSelected 
                                    ? 'border-teal-500 bg-teal-50/50' 
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                                    isSelected ? 'border-teal-600' : 'border-slate-300'
                                  }`}>
                                    <div className={`w-2.5 h-2.5 rounded-full bg-teal-600 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                  </div>
                                  <div>
                                    <span className={`font-bold text-sm block ${isSelected ? 'text-teal-900' : 'text-slate-700'}`}>
                                      {opt.label}
                                    </span>
                                    {opt.meta?.reqs && isSelected && (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {opt.meta.reqs.map((req: string) => (
                                          <span key={req} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                                            {req}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'input' && (
                        <div className="flex gap-2 max-w-md">
                          <input
                            type="text"
                            placeholder={q.placeholder}
                            onClick={e => e.stopPropagation()}
                            className={`flex-1 p-3 border-2 rounded-lg outline-none transition-colors ${
                              answer !== undefined ? 'border-teal-500 bg-teal-50/50 text-teal-900 font-bold' : 'border-slate-200 focus:border-teal-500'
                            }`}
                            value={answer !== undefined ? answer : tempInput}
                            onChange={e => !answer && setTempInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !answer && submitInput(q.id)}
                            disabled={answer !== undefined}
                          />
                          {!answer && (
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); submitInput(q.id); }}
                              disabled={!tempInput.trim()}
                              className="bg-slate-800 text-white px-6 py-3 rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-slate-900 transition-colors"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      )}

                      {(q as any).type === 'amount_with_unit' && (
                        <div className="flex flex-col sm:flex-row gap-3 max-w-xl items-start sm:items-center">
                          <input
                            type="number"
                            placeholder={q.placeholder}
                            onClick={e => e.stopPropagation()}
                            className={`p-3 border-2 rounded-lg outline-none transition-colors w-full sm:w-[200px] ${
                              answer !== undefined ? 'border-teal-500 bg-teal-50/50 text-teal-900 font-bold' : 'border-slate-200 focus:border-teal-500'
                            }`}
                            value={answer !== undefined ? answer.split(' ')[0] : tempInput}
                            onChange={e => !answer && setTempInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !answer && tempInput && tempUnit && handleSelectRadio(q, `${tempInput} ${tempUnit}`)}
                            disabled={answer !== undefined}
                          />
                          
                          {/* Unit Toggle Buttons */}
                          <div className={`flex bg-slate-100 p-1 rounded-lg border ${answer !== undefined ? 'border-teal-200 bg-teal-50/50' : 'border-slate-200'}`}>
                            {(q as any).units?.map((u: string) => {
                              const isSelected = answer !== undefined ? answer.includes(u) : tempUnit === u;
                              return (
                                <button
                                  key={u}
                                  type="button"
                                  disabled={answer !== undefined}
                                  onClick={(e) => { 
                                    e.preventDefault(); 
                                    e.stopPropagation(); 
                                    if (!answer) setTempUnit(u); 
                                  }}
                                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                                    isSelected 
                                      ? 'bg-white shadow-sm text-teal-700 border border-slate-200/50' 
                                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
                                  }`}
                                >
                                  {u}
                                </button>
                              );
                            })}
                          </div>

                          {!answer && (
                            <button 
                              type="button"
                              onClick={(e) => { 
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                handleSelectRadio(q, `${tempInput} ${tempUnit}`); 
                              }}
                              disabled={!tempInput.trim() || !tempUnit}
                              className="bg-slate-800 text-white px-6 py-3 rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-slate-900 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      )}

                      {q.type === 'boolean' && q.options && (
                        <div className="flex gap-4">
                          {q.options.map(opt => {
                            const isSelected = answer === opt.label;
                            return (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() => handleSelectRadio(q, opt.label)}
                                className={`flex-1 p-3 rounded-lg border-2 font-bold text-sm text-center transition-all ${
                                  isSelected ? 'border-teal-500 bg-teal-50/50 text-teal-900' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {isSimulatingAPI[q.id] && (
                        <div className="mt-4 text-sm font-semibold text-slate-500 flex items-center gap-2 animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
                          Analyzing response and consulting rules engine...
                        </div>
                      )}

                      {/* Inline Match Result */}
                      {regulatoryMatch[q.id] && !isSimulatingAPI[q.id] && (
                        <div className="mt-4 p-4 bg-blue-50 border-l-[3px] border-blue-500 rounded-r-lg animate-in slide-in-from-top-2">
                          <div className="flex items-start gap-2">
                            <Info className="text-blue-600 mt-0.5 shrink-0" size={16} />
                            <p className="text-sm text-blue-900 leading-relaxed">
                              <strong>Regulatory Impact:</strong> Based on your input, 
                              the system identified an <strong>{regulatoryMatch[q.id].category} pathway</strong> and 
                              <strong> {regulatoryMatch[q.id].licenseType}</strong> requirement.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* EMPTY STATE OR SPECIAL VIEWS */}
            {activeStepQuestions.length === 0 && DISCOVERY_STEPS[uiState.activeStepIndex].id === 'support' && (
              <div className="animate-in fade-in">
                <GovernmentSupportView />
              </div>
            )}

            {activeStepQuestions.length === 0 && DISCOVERY_STEPS[uiState.activeStepIndex].id !== 'support' && (
              <div className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-800 font-bold text-lg">Nothing additional is required for this project at this stage.</p>
                <p className="text-sm text-slate-500 mt-2">Based on your previous answers, no further details are needed here.</p>
              </div>
            )}


          </div>
          
          <div className="flex items-center justify-between mt-8 max-w-4xl">
            <button 
              onClick={goPrev}
              disabled={uiState.activeStepIndex === 0}
              className="text-slate-600 font-bold text-sm px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
            >
              ← Previous Step
            </button>
            <button 
              onClick={goNext}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm px-8 py-3 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              {uiState.activeStepIndex === 3 ? 'Generate Regulatory Journey' : 'Continue'} 
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - INTELLIGENCE */}
        <div className="hidden lg:block w-[400px] bg-white border-l border-slate-200 shadow-xl z-20 overflow-y-auto">
          <div className="p-6 sticky top-0">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-teal-600" />
              LIVE INTELLIGENCE
            </h3>

            {/* LIVE CONTEXT ACCUMULATION */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6 space-y-4 shadow-sm">
               
               {answers.intent && (
                 <div className="border-b border-slate-200 pb-3">
                   <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Intent</span>
                   <span className="text-sm font-bold text-slate-800 block">{answers.intent}</span>
                   {answers.businessStage && <span className="text-xs font-semibold text-slate-600 block mt-0.5">Stage: {answers.businessStage}</span>}
                   <span className="text-xs font-semibold text-teal-700 block mt-1 bg-teal-50 px-2 py-1 rounded inline-block">
                     Pathway: {answers.intent === 'Start a new business' ? 'Greenfield Project' : 'Brownfield / Operational'}
                   </span>
                 </div>
               )}

               <div className="border-b border-slate-200 pb-3">
                 <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Activity</span>
                 <span className="text-sm font-bold text-slate-800">{answers.businessType || <span className="text-slate-400 font-normal italic">Not provided yet</span>}</span>
                 {(answers.subType_food || answers.subType_mining) && (
                   <span className="text-xs font-bold text-slate-700 block mt-1">
                     ↳ {answers.subType_food || answers.subType_mining}
                     {answers.subType_mining_mineral && <span className="text-slate-500"> ({answers.subType_mining_mineral})</span>}
                   </span>
                 )}
               </div>

               <div>
                 <span className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Location</span>
                 <span className="text-sm font-bold text-slate-800">
                   {[answers.loc_state, answers.loc_district, answers.loc_taluka, answers.loc_midc].filter(Boolean).join(' / ') || <span className="text-slate-400 font-normal italic">Not provided yet</span>}
                 </span>
               </div>
            </div>

            {/* PROGRESSIVE REGULATORY IMPACT */}
            {answers.businessType && (
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-amber-600" />
                   Regulatory Impact
                 </h4>
                 
                 <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Regulatory Domains Identified</span>
                      <ul className="space-y-1.5">
                        <li className="text-xs font-bold text-slate-700 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Land / Industrial Location</li>
                        <li className="text-xs font-bold text-slate-700 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Environmental / Pollution</li>
                        {answers.businessType === 'Mining' && <li className="text-xs font-bold text-slate-700 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Mining / Mineral Permissions</li>}
                        {answers.businessType === 'Food Processing' && <li className="text-xs font-bold text-slate-700 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>Food Safety / FSSAI</li>}
                      </ul>
                    </div>

                    {Object.keys(regulatoryMatch).length > 0 ? (
                       <div className="pt-3 border-t border-slate-100">
                         <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Potential Requirements Matched</span>
                         {Object.entries(regulatoryMatch).map(([qid, match]) => (
                           <div key={qid} className="mb-2 last:mb-0 bg-slate-50 p-2 rounded border border-slate-100 flex gap-2 items-start">
                             <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                             <div>
                               <p className="text-xs font-bold text-slate-900">{match.licenseType}</p>
                               <p className="text-[10px] font-medium text-slate-500 mt-0.5">Category: {match.category}</p>
                             </div>
                           </div>
                         ))}
                       </div>
                    ) : (
                       <div className="pt-3 border-t border-slate-100">
                         <p className="text-[11px] text-slate-500 italic">Project scale and location parameters will determine specific permissions.</p>
                       </div>
                    )}
                 </div>
              </div>
            )}

            {/* LIVE SCHEMES & SUBSIDIES */}
            {answers.businessType && (
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                 <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Shield className="w-4 h-4 text-emerald-600" />
                   Eligible Schemes & Subsidies
                 </h4>
                 
                 <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                   {answers.businessType === 'Food Processing' && (
                     <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                       <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">Central Scheme</span>
                       <p className="text-xs font-bold text-slate-900">PMFME Subsidy</p>
                       <p className="text-[11px] text-slate-600 mt-1">Up to 35% credit-linked subsidy for food processing units.</p>
                     </div>
                   )}
                   {(answers.businessType === 'Manufacturing' || answers.businessType === 'Food Processing') && (
                     <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                       <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">State Incentive</span>
                       <p className="text-xs font-bold text-slate-900">Package Scheme of Incentives (PSI)</p>
                       <p className="text-[11px] text-slate-600 mt-1">SGST refund and electricity duty exemption based on location.</p>
                     </div>
                   )}
                   {answers.businessType === 'Mining' && (
                     <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                       <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">Sector Policy</span>
                       <p className="text-xs font-bold text-slate-900">State Mineral Policy Concession</p>
                       <p className="text-[11px] text-slate-600 mt-1">Rebate on mechanized mining setups ensuring zero-waste.</p>
                     </div>
                   )}
                   {answers.intent === 'Start a new business' && (
                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                       <span className="text-[10px] uppercase font-bold text-blue-700 block mb-1">Startup Benefit</span>
                       <p className="text-xs font-bold text-slate-900">Startup India Seed Fund</p>
                       <p className="text-[11px] text-slate-600 mt-1">Early-stage funding support for recognized greenfield startups.</p>
                     </div>
                   )}
                   
                   {!answers.businessType && !answers.intent && (
                     <p className="text-[11px] text-slate-500 italic">Complete the intent and activity profile to unlock subsidies.</p>
                   )}
                 </div>
              </div>
            )}

            {/* Dynamic Question Context */}
            {currentContext ? (
              <div className="animate-in fade-in duration-300 mb-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">WHY WE ASK</h4>
                </div>
                
                <h5 className="font-bold text-slate-900 mb-2 text-sm">{currentContext.title}</h5>
                <ul className="space-y-3 mt-3">
                  {currentContext.points.map((pt, i) => (
                    <li key={i} className="flex gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{pt.label}</span>
                        <span className="text-[11px] text-slate-600 mt-0.5 block leading-relaxed">{pt.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {currentContext.highlight && (
                  <div className="mt-4 p-3 bg-slate-800 rounded-lg text-white shadow-sm">
                     <span className="text-[10px] font-bold text-teal-400 block mb-1 uppercase tracking-wider">Regulatory Impact</span>
                     <p className="text-[11px] leading-relaxed text-slate-300">
                      {currentContext.highlight.replace('Regulatory Impact:', '')}
                     </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
                Select a question to view regulatory context, statutory guidance, and impact on your approval journey.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
