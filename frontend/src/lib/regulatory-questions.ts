export type InputType = 'radio' | 'multiselect' | 'input' | 'boolean' | 'location' | 'number';

export interface Option {
  id: string;
  label: string;
  meta?: any;
}

export interface QuestionDef {
  id: string;
  stepIndex: number;
  parentId?: string;
  numbering: string;
  title: string;
  description?: string;
  type: InputType;
  options?: Option[];
  condition?: (answers: Record<string, any>) => boolean;
  apiTrigger?: 'geospatial' | 'analyze' | 'approvals';
  placeholder?: string;
  unit?: string;
  contextInfo?: {
    title: string;
    points: { label: string; desc: string }[];
    highlight?: string;
  };
}

export const DISCOVERY_STEPS = [
  { id: 'intent', title: '01 Intent' },
  { id: 'activity', title: '02 Business Activity' },
  { id: 'profile', title: '03 Project Profile' },
  { id: 'location', title: '04 Location' },
  { id: 'intelligence', title: '05 Regulatory Intelligence' },
  { id: 'support', title: '06 Government Support' },
  { id: 'evidence', title: '07 Evidence' },
  { id: 'readiness', title: '08 Readiness' },
  { id: 'assistance', title: '09 Assistance' },
  { id: 'handoff', title: '10 Government Handoff' }
];

export const REGULATORY_QUESTIONS: QuestionDef[] = [
  // ====================================================
  // STEP 0: INTENT
  // ====================================================
  {
    id: 'intent',
    stepIndex: 0,
    numbering: '1',
    title: 'What are you planning to do?',
    type: 'radio',
    contextInfo: {
      title: 'Business Intent Mapping',
      points: [
        { label: 'Start a new business', desc: 'Initiates standard greenfield project clearances.' },
        { label: 'Expand existing business', desc: 'Triggers brownfield expansion rules.' }
      ]
    },
    options: [
      { id: 'Start a new business', label: 'Start a new business' },
      { id: 'Expand an existing business', label: 'Expand an existing business' },
      { id: 'Renew / maintain approvals', label: 'Renew / maintain approvals' },
      { id: 'Apply for government support', label: 'Apply for government support' }
    ]
  },
  {
    id: 'businessStage',
    stepIndex: 0,
    parentId: 'intent',
    numbering: '1.1',
    title: 'What stage is your business currently at?',
    type: 'radio',
    condition: (a) => a.intent === 'Start a new business',
    options: [
      { id: 'Only planning', label: 'Only planning' },
      { id: 'Business entity already incorporated', label: 'Entity already incorporated' },
      { id: 'Site identified', label: 'Land identified' },
      { id: 'Land acquired / leased', label: 'Land acquired / leased' },
      { id: 'Construction started', label: 'Construction underway' }
    ]
  },
  
  // ====================================================
  // STEP 1: BUSINESS ACTIVITY
  // ====================================================
  {
    id: 'businessType',
    stepIndex: 1,
    numbering: '2',
    title: 'What type of business are you planning?',
    description: 'Select the primary sector.',
    type: 'radio',
    options: [
      { id: 'Food Processing', label: 'Food Processing' },
      { id: 'Mining', label: 'Mining' },
      { id: 'Manufacturing', label: 'Manufacturing' },
      { id: 'Renewable Energy', label: 'Renewable Energy' },
      { id: 'IT / Electronics', label: 'IT / Electronics' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'subType_food',
    stepIndex: 1,
    parentId: 'businessType',
    numbering: '2.1',
    title: 'What kind of food processing?',
    type: 'radio',
    condition: (a) => a.businessType === 'Food Processing',
    options: [
      { id: 'Dairy Processing', label: 'Dairy Processing' },
      { id: 'Grain / Flour Processing', label: 'Grain / Flour Processing' },
      { id: 'Fruit & Vegetable Processing', label: 'Fruit & Vegetable Processing' },
      { id: 'Meat / Poultry Processing', label: 'Meat / Poultry Processing' },
      { id: 'Beverage Processing', label: 'Beverage Processing' }
    ]
  },
  {
    id: 'subType_mining',
    stepIndex: 1,
    parentId: 'businessType',
    numbering: '2.1',
    title: 'What type of mining activity?',
    type: 'radio',
    condition: (a) => a.businessType === 'Mining',
    options: [
      { id: 'Minor Minerals', label: 'Minor Minerals' },
      { id: 'Major Minerals', label: 'Major Minerals' },
      { id: 'Coal / Lignite', label: 'Coal / Lignite' }
    ]
  },
  {
    id: 'subType_mining_mineral',
    stepIndex: 1,
    parentId: 'subType_mining',
    numbering: '2.1.1',
    title: 'Specific mineral:',
    type: 'radio',
    condition: (a) => a.subType_mining === 'Minor Minerals',
    options: [
      { id: 'Silica Sand', label: 'Silica Sand' },
      { id: 'Stone', label: 'Stone' },
      { id: 'Gravel', label: 'Gravel' }
    ]
  },

  // ====================================================
  // STEP 2: PROJECT PROFILE
  // ====================================================
  {
    id: 'investment',
    stepIndex: 2,
    numbering: '3',
    title: 'Proposed Investment',
    type: 'amount_with_unit' as any,
    units: ['Lakhs', 'Crores'] as any,
    placeholder: 'Enter amount'
  },
  {
    id: 'land_area',
    stepIndex: 2,
    numbering: '3.1',
    parentId: 'investment',
    title: 'Total Land Area Required',
    type: 'input',
    placeholder: 'e.g. 2 Acres',
    condition: (a) => !!a.investment
  },
  
  // DAIRY SPECIFIC
  {
    id: 'dairy_capacity',
    stepIndex: 2,
    parentId: 'land_area',
    numbering: '3.2',
    title: 'Daily production / processing capacity (L/day)',
    type: 'radio',
    apiTrigger: 'analyze',
    condition: (a) => a.subType_food === 'Dairy Processing' && !!a.land_area,
    contextInfo: {
      title: 'Dairy Thresholds',
      highlight: 'Regulatory Impact: > 50k LPD triggers central clearance.',
      points: [
        { label: 'Medium (10K - 50K LPD)', desc: 'Requires State Food Authority licensing and MPCB Orange Category CTE.' }
      ]
    },
    options: [
      { id: '10,000 L/day', label: 'Small Scale (< 10,000 L/day)' },
      { id: '25,000 L/day', label: 'Medium Scale (10,000 - 50,000 L/day)', meta: { reqs: ['FSSAI State', 'MPCB Orange'] } },
      { id: '100,000 L/day', label: 'Large Scale (> 50,000 L/day)' }
    ]
  },
  {
    id: 'dairy_water',
    stepIndex: 2,
    parentId: 'dairy_capacity',
    numbering: '3.2.1',
    title: 'Daily Water Requirement (KLD)',
    type: 'input',
    placeholder: 'e.g. 50 KLD',
    condition: (a) => a.subType_food === 'Dairy Processing' && !!a.dairy_capacity
  },
  {
    id: 'dairy_etp',
    stepIndex: 2,
    parentId: 'dairy_water',
    numbering: '3.2.2',
    title: 'Will you establish an Effluent Treatment Plant (ETP)?',
    type: 'boolean',
    condition: (a) => a.subType_food === 'Dairy Processing' && !!a.dairy_water,
    options: [
      { id: 'Yes', label: 'YES' },
      { id: 'No', label: 'NO' }
    ]
  },
  {
    id: 'dairy_boiler',
    stepIndex: 2,
    parentId: 'dairy_etp',
    numbering: '3.2.3',
    title: 'Will you install an industrial boiler?',
    type: 'boolean',
    condition: (a) => a.subType_food === 'Dairy Processing' && !!a.dairy_etp,
    options: [
      { id: 'Yes', label: 'YES' },
      { id: 'No', label: 'NO' }
    ]
  },

  // MINING SPECIFIC
  {
    id: 'mining_lease_area',
    stepIndex: 2,
    parentId: 'land_area',
    numbering: '3.2',
    title: 'Proposed mining lease area',
    type: 'radio',
    apiTrigger: 'analyze',
    condition: (a) => a.businessType === 'Mining' && !!a.land_area,
    options: [
      { id: 'Small (< 5 Ha)', label: 'Small (< 5 Hectares)' },
      { id: 'Medium (5 - 50 Ha)', label: 'Medium (5 - 50 Hectares)' },
      { id: 'Large (> 50 Ha)', label: 'Large (> 50 Hectares)' }
    ]
  },
  {
    id: 'mining_production',
    stepIndex: 2,
    parentId: 'mining_lease_area',
    numbering: '3.2.1',
    title: 'Proposed Annual Production Capacity (TPA)',
    type: 'input',
    placeholder: 'e.g. 100,000 TPA',
    condition: (a) => a.businessType === 'Mining' && !!a.mining_lease_area
  },

  // ====================================================
  // STEP 3: LOCATION
  // ====================================================
  {
    id: 'loc_state',
    stepIndex: 3,
    numbering: '4',
    title: 'State',
    type: 'radio',
    options: [
      { id: 'Maharashtra', label: 'Maharashtra' }
    ]
  },
  {
    id: 'loc_district',
    stepIndex: 3,
    parentId: 'loc_state',
    numbering: '4.1',
    title: 'District',
    type: 'radio',
    condition: (a) => a.loc_state === 'Maharashtra',
    options: [
      { id: 'Pune', label: 'Pune' },
      { id: 'Mumbai', label: 'Mumbai' },
      { id: 'Nagpur', label: 'Nagpur' },
      { id: 'Nashik', label: 'Nashik' }
    ]
  },
  {
    id: 'loc_taluka',
    stepIndex: 3,
    parentId: 'loc_district',
    numbering: '4.1.1',
    title: 'Taluka / Region',
    type: 'radio',
    condition: (a) => a.loc_district === 'Pune',
    options: [
      { id: 'Khed', label: 'Khed' },
      { id: 'Haveli', label: 'Haveli' },
      { id: 'Baramati', label: 'Baramati' },
      { id: 'Shirur', label: 'Shirur' }
    ]
  },
  {
    id: 'loc_midc',
    stepIndex: 3,
    parentId: 'loc_taluka',
    numbering: '4.1.1.1',
    title: 'Industrial Area / Estate',
    type: 'radio',
    apiTrigger: 'geospatial',
    condition: (a) => a.loc_taluka === 'Khed',
    contextInfo: {
      title: 'Geospatial Resolution',
      points: [
        { label: 'MIDC Zone', desc: 'Chakan MIDC exempts certain NA tax and streamlines permissions.' }
      ]
    },
    options: [
      { id: 'Chakan Industrial Area / MIDC', label: 'Chakan Industrial Area / MIDC' },
      { id: 'Non-MIDC Khed', label: 'Non-MIDC / Private Land' }
    ]
  }
];
