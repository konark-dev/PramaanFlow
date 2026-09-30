const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/applicant/ApplicantDiscoveryFlow.tsx', 'utf-8');

const returnIndex = code.indexOf('  return (');
if (returnIndex === -1) {
  console.log('Could not find return statement');
  process.exit(1);
}

const beforeReturn = code.substring(0, returnIndex);

const newUI = `  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center font-bold text-slate-900">PF</div>
              <div>
                <div className="font-bold leading-none tracking-tight">PramaanFlow</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Statutory Enclave Active</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <a href="#" className="text-teal-400 border-b-2 border-teal-400 py-5">Central Approvals</a>
              <a href="#" className="hover:text-white py-5">State Approvals</a>
              <a href="#" className="hover:text-white py-5">Regulatory Schemes</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <div className="text-xs text-slate-400">Vault</div>
              <div className="font-bold text-sm text-teal-400">2 Documents Reused</div>
            </div>
            <button className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded hover:bg-slate-100">
              Save Assessment
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="text-sm font-bold">OD</span>
            </div>
          </div>
        </div>
      </header>

      {/* STEPPER */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 py-4 shrink-0">
              <div className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1</div>
                <div className="text-sm font-bold text-slate-700">Business Registration</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-4 border-b-2 border-teal-500 shrink-0">
              <div className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center">
                <span className="text-[10px] font-bold">2</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Step 2</div>
                <div className="text-sm font-bold text-teal-900">Business Activity Details</div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4 shrink-0 opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center">
                <span className="text-[10px] font-bold">3</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 3</div>
                <div className="text-sm font-bold text-slate-500">Location & Land</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-4 shrink-0 opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center">
                <span className="text-[10px] font-bold">4</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 4</div>
                <div className="text-sm font-bold text-slate-500">Capacity & Resources</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Form */}
        <div className="flex-1 space-y-6">
          
          {/* Completed Step Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
                <span className="text-xs font-bold">+</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 1</div>
                <div className="font-bold text-slate-800">Business Registration</div>
              </div>
            </div>
            <div className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100">
              Completed
            </div>
          </div>

          {/* Active Step Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-slate-300 text-slate-500 flex items-center justify-center">
                  <span className="text-xs font-bold">-</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step 2</div>
                  <h2 className="text-lg font-bold text-slate-900">Business Activity Details</h2>
                </div>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 hidden sm:flex">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                All statutory rules linked to NIC 2008
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-8 relative">
              {/* Vertical connector line for nested feeling */}
              <div className="absolute top-8 bottom-8 left-[34px] sm:left-[50px] w-px bg-slate-200 z-0 hidden sm:block"></div>

              {visibleQuestions.map((q, index) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = index === visibleQuestions.length - 1 && !isAnswered;
                
                // Determine indentation visually based on condition
                // If it has a condition, we assume it's a sub-question (1.1, 1.1.1 etc)
                const isSub = !!q.condition;
                
                return (
                  <div key={q.id} className={`relative z-10 transition-all duration-500 ${isSub ? 'sm:ml-12' : ''}`}>
                    
                    <div className="flex gap-3 sm:gap-4">
                      {/* Numbering Circle */}
                      <div className="shrink-0 mt-1 hidden sm:block">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white
                          ${isAnswered ? 'border-teal-500 text-teal-600' : isCurrent ? 'border-slate-800 text-slate-800' : 'border-slate-300 text-slate-400'}`}>
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 w-full min-w-0">
                        {/* Question Title */}
                        <div className="flex items-start gap-2">
                           <div className="shrink-0 mt-0.5 sm:hidden">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white
                              ${isAnswered ? 'border-teal-500 text-teal-600' : isCurrent ? 'border-slate-800 text-slate-800' : 'border-slate-300 text-slate-400'}`}>
                              <span className="text-[10px] font-bold">{index + 1}</span>
                            </div>
                           </div>
                          <h3 className={`font-bold text-[15px] ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                            {q.title}
                          </h3>
                        </div>

                        {/* Answered State (Read Only) */}
                        {isAnswered && (
                          <div className="inline-block bg-amber-400 text-amber-950 px-4 py-2 rounded font-bold text-sm border border-amber-500 shadow-sm">
                            {answers[q.id]}
                          </div>
                        )}

                        {/* Active Input State */}
                        {!isAnswered && q.type === 'radio' && q.options && (
                          <div className="space-y-3">
                            {q.options.map(opt => (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() => handleSelectRadio(q.id, opt.label)}
                                className="w-full text-left p-4 rounded-lg border-2 border-slate-200 bg-white hover:border-amber-400 transition-all group flex flex-col gap-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-amber-500 flex items-center justify-center transition-colors">
                                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-amber-500 transition-colors" />
                                  </div>
                                  <span className="font-semibold text-slate-700 group-hover:text-slate-900">
                                    {opt.label}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {!isAnswered && q.type === 'multiselect' && q.options && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                              {q.options.map(opt => {
                                const isSelected = tempMultiSelect.has(opt.label);
                                return (
                                  <button
                                    type="button"
                                    key={opt.id}
                                    onClick={() => handleMultiToggle(opt.label)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all group flex items-center gap-3 
                                      ${isSelected ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200 bg-white hover:border-amber-400'}`}
                                  >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                    </div>
                                    <span className={`font-semibold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                      {opt.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            <button
                              type="button"
                              disabled={tempMultiSelect.size === 0}
                              onClick={() => handleMultiSubmit(q.id)}
                              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 
                                ${tempMultiSelect.size > 0 ? 'bg-amber-400 text-amber-950 hover:bg-amber-500 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                            >
                              Confirm Selection <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {!isAnswered && q.type === 'input' && (
                          <div className="space-y-4 max-w-md">
                            <div className="relative">
                              <input
                                type="text"
                                value={tempInput}
                                onChange={(e) => setTempInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && tempInput.trim()) {
                                    commitAnswer(q.id, tempInput.trim());
                                    setTempInput('');
                                  }
                                }}
                                placeholder={q.placeholder || "Type your answer..."}
                                className="w-full p-4 pr-16 bg-white border-2 border-slate-200 rounded-lg text-slate-900 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all"
                              />
                              {q.unit && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                                  {q.unit}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={!tempInput.trim()}
                              onClick={() => {
                                if (tempInput.trim()) {
                                  commitAnswer(q.id, tempInput.trim());
                                  setTempInput('');
                                }
                              }}
                              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 
                                ${tempInput.trim() ? 'bg-amber-400 text-amber-950 hover:bg-amber-500 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                            >
                              Save & Continue <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={endRef} className="h-4" />
              
              {/* Bottom Actions */}
              {reachedEnd && (
                <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                    ? Previous Step
                  </button>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors hidden sm:block">
                      Save Progress Draft
                    </button>
                    <button
                      onClick={() => {
                        const finalResult: DiscoveryResult = {
                          intent: answers.intent || "Start a new business",
                          businessType: answers.businessType || "Unspecified",
                          subType: answers.subType,
                          state: answers.state || "Maharashtra",
                          district: answers.district || "Pune",
                          location: answers.location || "Unspecified",
                          ...answers
                        };
                        onComplete(finalResult);
                      }}
                      className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      Continue to Generate Regulatory Journey <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Additional Information */}
        <div className="w-80 shrink-0 hidden lg:block">
          <div className="sticky top-28 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Additional Information</h3>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                  <h4 className="font-bold text-sm text-slate-700">Would you be establishing any of the following facilities?</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-4">
                  <strong>Common hazardous waste treatment, storage and disposal facilities (TSDFs):</strong><br/>
                  All integrated facilities having incineration & landfill, or incineration alone.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed pl-4 mt-2">
                  <strong>Notified Food Laboratory:</strong><br/>
                  For being recognized, every food laboratory should have accreditation against ISO/IEC 17025 by the National Accreditation Board for Testing and Calibration (NABL).
                </p>
                <p className="text-xs text-slate-500 leading-relaxed pl-4 mt-2">
                  <strong>Special Economic Zone (SEZ):</strong><br/>
                  A special economic zone is an area in a country that is subject to different economic regulations.
                </p>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 text-white space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-400/20 flex items-center justify-center">
                    <span className="text-amber-400 text-xs font-bold">i</span>
                  </div>
                  <span className="font-bold text-sm">Dedicated Nodal Desk</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Need assistance with NIC mapping or capacity calculations? Connect directly with the Food Processing Sector Desk.
                </p>
                <a href="#" className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors">Request Officer Callback ?</a>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
`;

fs.writeFileSync('update-ui.js', 'const fs = require("fs");\nlet code = fs.readFileSync("frontend/src/components/applicant/ApplicantDiscoveryFlow.tsx", "utf-8");\nconst returnIndex = code.indexOf("  return (");\nconst beforeReturn = code.substring(0, returnIndex);\nfs.writeFileSync("frontend/src/components/applicant/ApplicantDiscoveryFlow.tsx", beforeReturn + `\n` + '  return (' + '`' + newUI.substring(10).replace(/`/g, "\\`") + '`.substring(1)' + `\n`);');

console.log("Script created");
