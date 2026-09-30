import { useState, useEffect, useCallback, useMemo } from 'react';

export interface UIState {
  activeStepIndex: number;
  activeQuestionId: string | null;
  isAnalyzing: boolean;
  expandedSteps: Set<number>;
}

const STORAGE_KEY_ANSWERS = 'pramaan_discovery_answers';
const STORAGE_KEY_MATCHES = 'pramaan_discovery_matches';
const STORAGE_KEY_STEP = 'pramaan_discovery_step';
const STORAGE_KEY_CASE_ID = 'pramaan_case_id';

function generateCaseId(): string {
  return 'PF-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
}

const DEFAULT_ANSWERS = {
  intent: "Start a new business",
  businessType: "Food Processing & Manufacturing",
  subType_food: "Edible Oil Extraction & Refinery",
  location: "Plot B-42, MIDC Chakan Industrial Area Phase II",
  district: "Pune",
  capacity: "25000",
  capacityUnit: "Liters/Day",
  investment: "8.5",
  investmentUnit: "Crores",
};

export function useDiscoveryEngine() {
  // 1. QUESTION STATE (Persisted)
  const [answers, setAnswersRaw] = useState<Record<string, any>>(DEFAULT_ANSWERS);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 2. REGULATORY STATE
  const [regulatoryMatch, setRegulatoryMatch] = useState<Record<string, any>>({});
  
  // 3. UI STATE
  const [uiState, setUiState] = useState<UIState>({
    activeStepIndex: 0,
    activeQuestionId: null,
    isAnalyzing: false,
    expandedSteps: new Set([0])
  });

  // 4. STABLE CASE ID (persisted, generated once)
  const [caseId, setCaseId] = useState<string>('');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
      const savedMatches = localStorage.getItem(STORAGE_KEY_MATCHES);
      const savedStep = localStorage.getItem(STORAGE_KEY_STEP);
      const savedCaseId = localStorage.getItem(STORAGE_KEY_CASE_ID);
      
      if (savedAnswers) setAnswersRaw(JSON.parse(savedAnswers));
      if (savedMatches) setRegulatoryMatch(JSON.parse(savedMatches));
      if (savedStep) {
        setUiState(prev => ({ ...prev, activeStepIndex: parseInt(savedStep, 10) }));
      }
      if (savedCaseId) {
        setCaseId(savedCaseId);
      } else {
        const newId = generateCaseId();
        setCaseId(newId);
        localStorage.setItem(STORAGE_KEY_CASE_ID, newId);
      }
    } catch (e) {
      console.error("Failed to parse saved state", e);
      // If localStorage is corrupted, generate fresh case
      const newId = generateCaseId();
      setCaseId(newId);
      localStorage.setItem(STORAGE_KEY_CASE_ID, newId);
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(regulatoryMatch));
      localStorage.setItem(STORAGE_KEY_STEP, uiState.activeStepIndex.toString());
    }
  }, [answers, regulatoryMatch, uiState.activeStepIndex, isLoaded]);

  // Wrapped setAnswers that also invalidates stale regulatory matches
  // when upstream answers change
  const setAnswers = useCallback((newAnswers: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => {
    setAnswersRaw(prev => {
      const next = typeof newAnswers === 'function' ? newAnswers(prev) : newAnswers;
      
      // Find which answer keys were deleted (pruned children)
      const removedKeys = Object.keys(prev).filter(k => !(k in next));
      
      // Invalidate regulatory matches for removed answers
      if (removedKeys.length > 0) {
        setRegulatoryMatch(prevMatches => {
          const nextMatches = { ...prevMatches };
          removedKeys.forEach(k => {
            delete nextMatches[k];
          });
          return nextMatches;
        });
      }
      
      return next;
    });
  }, []);

  // Reset entire case (for "Start Fresh" functionality)
  const resetCase = useCallback(() => {
    const newId = generateCaseId();
    setAnswersRaw({});
    setRegulatoryMatch({});
    setUiState({
      activeStepIndex: 0,
      activeQuestionId: null,
      isAnalyzing: false,
      expandedSteps: new Set([0])
    });
    setCaseId(newId);
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_MATCHES);
    localStorage.removeItem(STORAGE_KEY_STEP);
    localStorage.setItem(STORAGE_KEY_CASE_ID, newId);
  }, []);

  const updateUI = useCallback((updates: Partial<UIState>) => {
    setUiState(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleStep = useCallback((stepIndex: number) => {
    setUiState(prev => {
      const nextExpanded = new Set(prev.expandedSteps);
      if (nextExpanded.has(stepIndex)) {
        nextExpanded.delete(stepIndex);
      } else {
        nextExpanded.add(stepIndex);
      }
      return { ...prev, expandedSteps: nextExpanded };
    });
  }, []);

  // Derived intelligence state — never fake
  const intelligenceStatus = useMemo(() => {
    if (uiState.isAnalyzing) return 'analyzing' as const;
    const matchCount = Object.keys(regulatoryMatch).length;
    if (matchCount > 0) return 'ready' as const;
    // Check if we have enough info to analyze but haven't yet
    if (answers.businessType || answers.location) return 'waiting' as const;
    return 'idle' as const;
  }, [uiState.isAnalyzing, regulatoryMatch, answers.businessType, answers.location]);

  return {
    answers,
    setAnswers,
    regulatoryMatch,
    setRegulatoryMatch,
    uiState,
    updateUI,
    toggleStep,
    isLoaded,
    caseId,
    resetCase,
    intelligenceStatus
  };
}
