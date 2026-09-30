const fs = require('fs');
const path = require('path');

const content = `
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronRight, ArrowRight } from "lucide-react";

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
}

type InputType = 'radio' | 'multiselect' | 'input';

interface Option {
  id: string;
  label: string;
}

interface QuestionDef {
  id: string;
  section: string;
  title: string;
  type: InputType;
  options?: Option[];
  condition?: (answers: Record<string, any>) => boolean;
  placeholder?: string;
  unit?: string;
}

const SECTIONS = [
  "BUSINESS INTENT",
  "BUSINESS ACTIVITY",
  "SUB-ACTIVITY",
  "LOCATION",
  "SCALE & CAPACITY",
  "OPERATIONS",
  "REGULATORY JOURNEY"
];

const QUESTIONS: QuestionDef[] = [
  // ---------------------------------------------------------
  // 1. BUSINESS INTENT
  // ---------------------------------------------------------
  {
    id: 'intent',
    section: 'BUSINESS INTENT',
    title: 'What are you planning to do?',
    type: 'radio',
    options: [
      { id: 'Start a new business', label: 'Start a new business' },
      { id: 'Expand an existing business', label: 'Expand an existing business' },
      { id: 'Renew / maintain approvals', label: 'Renew / maintain approvals' },
      { id: 'Apply for government support', label: 'Apply for government support' }
    ]
  },
  {
    id: 'businessStage',
    section: 'BUSINESS INTENT',
    title: 'What stage is your business currently at?',
    type: 'radio',
    condition: (a) => a.intent === 'Start a new business',
    options: [
      { id: 'Only planning', label: 'Only planning' },
      { id: 'Business entity already incorporated', label: 'Business entity already incorporated' },
      { id: 'Site identified', label: 'Site identified' },
      { id: 'Land acquired / leased', label: 'Land acquired / leased' },
      { id: 'Construction started', label: 'Construction started' },
      { id: 'Existing facility being converted or reused', label: 'Existing facility being converted or reused' }
    ]
  },
  {
    id: 'entityType',
    section: 'BUSINESS INTENT',
    title: 'What type of organization will operate the business?',
    type: 'radio',
    condition: (a) => a.intent === 'Start a new business',
    options: [
      { id: 'Proprietorship', label: 'Proprietorship' },
      { id: 'Partnership', label: 'Partnership' },
      { id: 'LLP', label: 'LLP' },
      { id: 'Private Limited Company', label: 'Private Limited Company' },
      { id: 'Public Limited Company', label: 'Public Limited Company' },
      { id: 'Cooperative', label: 'Cooperative' },
      { id: 'Society / Trust', label: 'Society / Trust' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'isRegistered',
    section: 'BUSINESS INTENT',
    title: 'Is the business already registered?',
    type: 'radio',
    condition: (a) => a.intent === 'Start a new business',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Registration in progress', label: 'Registration in progress' }
    ]
  },
  {
    id: 'registeredName',
    section: 'BUSINESS INTENT',
    title: 'Registered business name (optional)',
    type: 'input',
    condition: (a) => a.isRegistered === 'Yes',
    placeholder: 'Enter business name'
  },

  // ---------------------------------------------------------
  // 2. BUSINESS ACTIVITY
  // ---------------------------------------------------------
  {
    id: 'businessType',
    section: 'BUSINESS ACTIVITY',
    title: 'What type of business are you planning?',
    type: 'radio',
    options: [
      { id: 'Food Processing', label: 'Food Processing' },
      { id: 'Mining & Quarrying', label: 'Mining & Quarrying' },
      { id: 'Manufacturing', label: 'Manufacturing' },
      { id: 'Renewable Energy', label: 'Renewable Energy' },
      { id: 'IT / Electronics', label: 'IT / Electronics' },
      { id: 'Logistics / Warehousing', label: 'Logistics / Warehousing' },
      { id: 'Chemicals / Pharmaceuticals', label: 'Chemicals / Pharmaceuticals' },
      { id: 'Construction / Infrastructure', label: 'Construction / Infrastructure' },
      { id: 'Agriculture / Agro-processing', label: 'Agriculture / Agro-processing' },
      { id: 'Other', label: 'Other' }
    ]
  },

  // ---------------------------------------------------------
  // 3. SUB-ACTIVITY (FOOD)
  // ---------------------------------------------------------
  {
    id: 'subType',
    section: 'SUB-ACTIVITY',
    title: 'What kind of food processing?',
    type: 'radio',
    condition: (a) => a.businessType === 'Food Processing',
    options: [
      { id: 'Dairy Processing', label: 'Dairy Processing' },
      { id: 'Grain / Flour Processing', label: 'Grain / Flour Processing' },
      { id: 'Fruit & Vegetable Processing', label: 'Fruit & Vegetable Processing' },
      { id: 'Meat / Poultry Processing', label: 'Meat / Poultry Processing' },
      { id: 'Beverage Processing', label: 'Beverage Processing' },
      { id: 'Packaged Food', label: 'Packaged Food' },
      { id: 'Other Food Processing', label: 'Other Food Processing' }
    ]
  },
  {
    id: 'primaryProduct',
    section: 'SUB-ACTIVITY',
    title: 'What will be your primary product?',
    type: 'input',
    condition: (a) => a.businessType === 'Food Processing',
    placeholder: 'e.g. Pasteurized Milk, Cheese...'
  },
  {
    id: 'foodActivities',
    section: 'SUB-ACTIVITY',
    title: 'What activities will happen at the site?',
    type: 'multiselect',
    condition: (a) => a.businessType === 'Food Processing',
    options: [
      { id: 'Processing / manufacturing', label: 'Processing / manufacturing' },
      { id: 'Packaging', label: 'Packaging' },
      { id: 'Storage', label: 'Storage' },
      { id: 'Cold storage', label: 'Cold storage' },
      { id: 'Laboratory / testing', label: 'Laboratory / testing' },
      { id: 'Material handling', label: 'Material handling' },
      { id: 'Warehouse', label: 'Warehouse' },
      { id: 'Office', label: 'Office' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'foodRawMaterials',
    section: 'SUB-ACTIVITY',
    title: 'What raw materials will you use?',
    type: 'input',
    condition: (a) => a.businessType === 'Food Processing',
    placeholder: 'e.g. Raw milk, Sugar (Separate with commas)'
  },
  {
    id: 'wastewater',
    section: 'SUB-ACTIVITY',
    title: 'Will the process generate wastewater?',
    type: 'radio',
    condition: (a) => a.businessType === 'Food Processing',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'wastewaterQty',
    section: 'SUB-ACTIVITY',
    title: 'Approximate wastewater generation?',
    type: 'input',
    condition: (a) => a.businessType === 'Food Processing' && a.wastewater === 'Yes',
    placeholder: 'e.g. 50',
    unit: 'KLD'
  },
  {
    id: 'airEmissions',
    section: 'SUB-ACTIVITY',
    title: 'Will the process generate air emissions?',
    type: 'radio',
    condition: (a) => a.businessType === 'Food Processing',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'emissionSource',
    section: 'SUB-ACTIVITY',
    title: 'What are the emission sources?',
    type: 'multiselect',
    condition: (a) => a.businessType === 'Food Processing' && a.airEmissions === 'Yes',
    options: [
      { id: 'Boiler', label: 'Boiler' },
      { id: 'Furnace', label: 'Furnace' },
      { id: 'DG set', label: 'DG set' },
      { id: 'Process emissions', label: 'Process emissions' },
      { id: 'Dust', label: 'Dust' },
      { id: 'Other', label: 'Other' }
    ]
  },

  // ---------------------------------------------------------
  // 3. SUB-ACTIVITY (MINING)
  // ---------------------------------------------------------
  {
    id: 'subType',
    section: 'SUB-ACTIVITY',
    title: 'What type of mining or extraction is proposed?',
    type: 'radio',
    condition: (a) => a.businessType === 'Mining & Quarrying',
    options: [
      { id: 'Mining', label: 'Mining' },
      { id: 'Quarrying', label: 'Quarrying' },
      { id: 'Sand / silica sand', label: 'Sand / silica sand' },
      { id: 'Stone / aggregate', label: 'Stone / aggregate' },
      { id: 'Mineral processing', label: 'Mineral processing' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'miningMineral',
    section: 'SUB-ACTIVITY',
    title: 'What mineral/material will be extracted or processed?',
    type: 'input',
    condition: (a) => a.businessType === 'Mining & Quarrying',
    placeholder: 'e.g. Silica Sand'
  },
  {
    id: 'miningActivities',
    section: 'SUB-ACTIVITY',
    title: 'What activities will happen at the project site?',
    type: 'multiselect',
    condition: (a) => a.businessType === 'Mining & Quarrying',
    options: [
      { id: 'Extraction', label: 'Extraction' },
      { id: 'Crushing', label: 'Crushing' },
      { id: 'Screening', label: 'Screening' },
      { id: 'Washing', label: 'Washing' },
      { id: 'Processing', label: 'Processing' },
      { id: 'Stockpiling', label: 'Stockpiling' },
      { id: 'Material handling', label: 'Material handling' },
      { id: 'Dispatch', label: 'Dispatch' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'blasting',
    section: 'SUB-ACTIVITY',
    title: 'Will blasting or other high-risk extraction operations be used?',
    type: 'radio',
    condition: (a) => a.businessType === 'Mining & Quarrying',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'groundwaterExt',
    section: 'SUB-ACTIVITY',
    title: 'Will groundwater be extracted?',
    type: 'radio',
    condition: (a) => a.businessType === 'Mining & Quarrying',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'groundwaterQty',
    section: 'SUB-ACTIVITY',
    title: 'Estimated groundwater extraction quantity?',
    type: 'input',
    condition: (a) => a.businessType === 'Mining & Quarrying' && a.groundwaterExt === 'Yes',
    placeholder: 'e.g. 20',
    unit: 'KLD'
  },
  {
    id: 'mineralWashing',
    section: 'SUB-ACTIVITY',
    title: 'Will the project include mineral processing/washing?',
    type: 'radio',
    condition: (a) => a.businessType === 'Mining & Quarrying',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' }
    ]
  },
  {
    id: 'washingWaterReq',
    section: 'SUB-ACTIVITY',
    title: 'Estimated water requirement for washing?',
    type: 'input',
    condition: (a) => a.businessType === 'Mining & Quarrying' && a.mineralWashing === 'Yes',
    placeholder: 'e.g. 50',
    unit: 'KLD'
  },
  {
    id: 'washingWastewater',
    section: 'SUB-ACTIVITY',
    title: 'Expected wastewater generation from washing?',
    type: 'input',
    condition: (a) => a.businessType === 'Mining & Quarrying' && a.mineralWashing === 'Yes',
    placeholder: 'e.g. 40',
    unit: 'KLD'
  },

  // ---------------------------------------------------------
  // 3. SUB-ACTIVITY (FALLBACK FOR OTHERS)
  // ---------------------------------------------------------
  {
    id: 'subType',
    section: 'SUB-ACTIVITY',
    title: 'Select the primary activity:',
    type: 'radio',
    condition: (a) => a.businessType && !['Food Processing', 'Mining & Quarrying'].includes(a.businessType),
    options: [
      { id: 'Assembly / Packaging', label: 'Assembly / Packaging' },
      { id: 'Heavy Manufacturing', label: 'Heavy Manufacturing' },
      { id: 'Software Development', label: 'Software Development' },
      { id: 'Other Services', label: 'Other Services' }
    ]
  },

  // ---------------------------------------------------------
  // 4. LOCATION
  // ---------------------------------------------------------
  {
    id: 'state',
    section: 'LOCATION',
    title: 'Where will the business operate? (State)',
    type: 'radio',
    options: [
      { id: 'Maharashtra', label: 'Maharashtra' }
    ]
  },
  {
    id: 'district',
    section: 'LOCATION',
    title: 'Select District',
    type: 'radio',
    options: [
      { id: 'Pune', label: 'Pune' }
    ]
  },
  {
    id: 'specificSite',
    section: 'LOCATION',
    title: 'Do you already have a specific site?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' }
    ]
  },
  {
    id: 'location',
    section: 'LOCATION',
    title: 'Where is the site or facility located?',
    type: 'radio',
    options: [
      { id: 'Notified Industrial Estate (e.g., MIDC Chakan)', label: 'Notified Industrial Estate (e.g., MIDC Chakan)' },
      { id: 'Agricultural Land (requires NA conversion)', label: 'Agricultural Land (requires NA conversion)' },
      { id: 'Existing Commercial Facility / Leased Industrial Shed', label: 'Existing Commercial Facility / Leased Industrial Shed' },
      { id: 'Other / Custom Private Land', label: 'Other / Custom Private Land' }
    ]
  },
  {
    id: 'siteNature',
    section: 'LOCATION',
    title: 'What is the nature of the site?',
    type: 'radio',
    options: [
      { id: 'Notified Industrial Estate', label: 'Notified Industrial Estate' },
      { id: 'Industrial development area', label: 'Industrial development area' },
      { id: 'Private industrial land', label: 'Private industrial land' },
      { id: 'Agricultural land', label: 'Agricultural land' },
      { id: 'Existing commercial facility', label: 'Existing commercial facility' },
      { id: 'Existing industrial facility', label: 'Existing industrial facility' },
      { id: 'Government / project land', label: 'Government / project land' },
      { id: 'Mining / project area', label: 'Mining / project area' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'landStatus',
    section: 'LOCATION',
    title: 'What is your current land status?',
    type: 'radio',
    options: [
      { id: 'Owned', label: 'Owned' },
      { id: 'Leased', label: 'Leased' },
      { id: 'Allotted', label: 'Allotted' },
      { id: 'Application submitted', label: 'Application submitted' },
      { id: 'Negotiating / proposed', label: 'Negotiating / proposed' },
      { id: 'Not acquired yet', label: 'Not acquired yet' }
    ]
  },
  {
    id: 'landClassification',
    section: 'LOCATION',
    title: 'What is the current land-use classification?',
    type: 'radio',
    options: [
      { id: 'Industrial', label: 'Industrial' },
      { id: 'Agricultural', label: 'Agricultural' },
      { id: 'Commercial', label: 'Commercial' },
      { id: 'Residential', label: 'Residential' },
      { id: 'Mixed', label: 'Mixed' },
      { id: 'Government / project land', label: 'Government / project land' },
      { id: 'Don\'t know', label: 'Don\'t know' }
    ]
  },
  {
    id: 'landConversion',
    section: 'LOCATION',
    title: 'Has land-use conversion been obtained or applied for?',
    type: 'radio',
    condition: (a) => a.landClassification === 'Agricultural',
    options: [
      { id: 'Obtained', label: 'Obtained' },
      { id: 'Applied', label: 'Applied' },
      { id: 'Not applied', label: 'Not applied' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'projectArea',
    section: 'LOCATION',
    title: 'Approximate project / land area?',
    type: 'input',
    placeholder: 'e.g. 5000',
    unit: 'sq. m.'
  },

  // ---------------------------------------------------------
  // 5. SCALE & CAPACITY
  // ---------------------------------------------------------
  {
    id: 'investment',
    section: 'SCALE & CAPACITY',
    title: 'What is the estimated total project investment?',
    type: 'input',
    placeholder: 'e.g. 5',
    unit: 'Crores'
  },
  {
    id: 'capacity',
    section: 'SCALE & CAPACITY',
    title: 'What is the expected production capacity?',
    type: 'input',
    placeholder: 'e.g. 100',
    unit: 'Units (varies by sector)'
  },
  {
    id: 'operatingDays',
    section: 'SCALE & CAPACITY',
    title: 'How many operating days are expected per year?',
    type: 'input',
    placeholder: 'e.g. 300'
  },
  {
    id: 'shifts',
    section: 'SCALE & CAPACITY',
    title: 'How many shifts will the facility operate?',
    type: 'radio',
    options: [
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'hoursPerDay',
    section: 'SCALE & CAPACITY',
    title: 'How many hours per day?',
    type: 'input',
    placeholder: 'e.g. 8'
  },

  // ---------------------------------------------------------
  // 6. OPERATIONS (UTILITIES, ENV, WORKFORCE, etc)
  // ---------------------------------------------------------
  {
    id: 'electricityReq',
    section: 'OPERATIONS',
    title: 'What is the expected electricity requirement?',
    type: 'input',
    placeholder: 'e.g. 500',
    unit: 'kW'
  },
  {
    id: 'electricityStatus',
    section: 'OPERATIONS',
    title: 'Electricity connection status?',
    type: 'radio',
    options: [
      { id: 'Not applied', label: 'Not applied' },
      { id: 'Application planned', label: 'Application planned' },
      { id: 'Application submitted', label: 'Application submitted' },
      { id: 'Existing connection', label: 'Existing connection' },
      { id: 'Expansion required', label: 'Expansion required' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'waterReq',
    section: 'OPERATIONS',
    title: 'What is the expected water requirement?',
    type: 'input',
    placeholder: 'e.g. 100',
    unit: 'KLD'
  },
  {
    id: 'waterSource',
    section: 'OPERATIONS',
    title: 'What will be the primary water source?',
    type: 'radio',
    options: [
      { id: 'Municipal supply', label: 'Municipal supply' },
      { id: 'Groundwater', label: 'Groundwater' },
      { id: 'Surface water', label: 'Surface water' },
      { id: 'Tanker', label: 'Tanker' },
      { id: 'Recycled water', label: 'Recycled water' },
      { id: 'Other', label: 'Other' },
      { id: 'Not decided', label: 'Not decided' }
    ]
  },
  {
    id: 'fuelSources',
    section: 'OPERATIONS',
    title: 'What energy/fuel sources will be used?',
    type: 'multiselect',
    options: [
      { id: 'Electricity', label: 'Electricity' },
      { id: 'Natural gas', label: 'Natural gas' },
      { id: 'LPG', label: 'LPG' },
      { id: 'Diesel', label: 'Diesel' },
      { id: 'Biomass', label: 'Biomass' },
      { id: 'Coal', label: 'Coal' },
      { id: 'Solar', label: 'Solar' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'majorMachinery',
    section: 'OPERATIONS',
    title: 'Will major machinery/equipment be installed?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not decided', label: 'Not decided' }
    ]
  },
  {
    id: 'solidWaste',
    section: 'OPERATIONS',
    title: 'Will the project generate solid waste?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'hazardousMaterials',
    section: 'OPERATIONS',
    title: 'Will hazardous substances be handled or stored?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'hazType',
    section: 'OPERATIONS',
    title: 'Type/category of hazardous substances?',
    type: 'input',
    condition: (a) => a.hazardousMaterials === 'Yes',
    placeholder: 'e.g. Flammable liquids, Corrosives'
  },
  {
    id: 'hazardousWaste',
    section: 'OPERATIONS',
    title: 'Will hazardous waste be generated?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'noise',
    section: 'OPERATIONS',
    title: 'Will the operation generate significant noise?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'combustible',
    section: 'OPERATIONS',
    title: 'Will combustible or flammable materials be stored?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'pressurized',
    section: 'OPERATIONS',
    title: 'Will pressurized systems / boilers / similar equipment be used?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'workers',
    section: 'OPERATIONS',
    title: 'How many workers are expected?',
    type: 'input',
    placeholder: 'e.g. 50'
  },
  {
    id: 'workerType',
    section: 'OPERATIONS',
    title: 'What type of workforce will you have?',
    type: 'multiselect',
    options: [
      { id: 'Permanent', label: 'Permanent' },
      { id: 'Contract', label: 'Contract' },
      { id: 'Temporary', label: 'Temporary' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'highRiskWorkers',
    section: 'OPERATIONS',
    title: 'Will workers perform hazardous or high-risk operations?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'workerAccommodation',
    section: 'OPERATIONS',
    title: 'Will worker accommodation/residential facilities be provided on site?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' }
    ]
  },
  {
    id: 'projectStatus',
    section: 'OPERATIONS',
    title: 'What is the current project status?',
    type: 'radio',
    options: [
      { id: 'Planning', label: 'Planning' },
      { id: 'Site acquired', label: 'Site acquired' },
      { id: 'Design / planning', label: 'Design / planning' },
      { id: 'Construction not started', label: 'Construction not started' },
      { id: 'Construction underway', label: 'Construction underway' },
      { id: 'Machinery installation', label: 'Machinery installation' },
      { id: 'Trial production', label: 'Trial production' },
      { id: 'Ready for operation', label: 'Ready for operation' }
    ]
  },
  {
    id: 'newBuildings',
    section: 'OPERATIONS',
    title: 'Will new buildings or structures be constructed?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Existing facility', label: 'Existing facility' }
    ]
  },
  {
    id: 'builtupArea',
    section: 'OPERATIONS',
    title: 'Approximate built-up area?',
    type: 'input',
    condition: (a) => a.newBuildings === 'Yes',
    placeholder: 'e.g. 2000',
    unit: 'sq. m.'
  },
  {
    id: 'buildingHeight',
    section: 'OPERATIONS',
    title: 'Approximate building height?',
    type: 'input',
    condition: (a) => a.newBuildings === 'Yes',
    placeholder: 'e.g. 15',
    unit: 'metres'
  },
  {
    id: 'newMachinery',
    section: 'OPERATIONS',
    title: 'Will machinery be newly installed?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' }
    ]
  },
  {
    id: 'market',
    section: 'OPERATIONS',
    title: 'Where will the products/services be sold?',
    type: 'multiselect',
    options: [
      { id: 'Within the state', label: 'Within the state' },
      { id: 'Other Indian states', label: 'Other Indian states' },
      { id: 'Export', label: 'Export' },
      { id: 'Domestic + Export', label: 'Domestic + Export' }
    ]
  },
  {
    id: 'imports',
    section: 'OPERATIONS',
    title: 'Will you import raw materials or equipment?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'exports',
    section: 'OPERATIONS',
    title: 'Will you export?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Planned later', label: 'Planned later' }
    ]
  },
  {
    id: 'fdi',
    section: 'OPERATIONS',
    title: 'Is foreign investment planned?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Not sure', label: 'Not sure' }
    ]
  },
  {
    id: 'existingRegistrations',
    section: 'OPERATIONS',
    title: 'Which registrations or approvals do you already have?',
    type: 'multiselect',
    options: [
      { id: 'Company / LLP registration', label: 'Company / LLP registration' },
      { id: 'PAN', label: 'PAN' },
      { id: 'GST', label: 'GST' },
      { id: 'Udyam / MSME', label: 'Udyam / MSME' },
      { id: 'Startup recognition', label: 'Startup recognition' },
      { id: 'Land allotment / lease', label: 'Land allotment / lease' },
      { id: 'Building approval', label: 'Building approval' },
      { id: 'Environmental approval', label: 'Environmental approval' },
      { id: 'Pollution consent', label: 'Pollution consent' },
      { id: 'Electricity connection', label: 'Electricity connection' },
      { id: 'Fire-related approval', label: 'Fire-related approval' },
      { id: 'Sector-specific licence', label: 'Sector-specific licence' },
      { id: 'None', label: 'None' },
      { id: 'Other', label: 'Other' }
    ]
  },
  {
    id: 'existingApplications',
    section: 'OPERATIONS',
    title: 'Have you already submitted any government applications for this project?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' }
    ]
  },
  {
    id: 'govtSupport',
    section: 'OPERATIONS',
    title: 'Would you like PramaanFlow to identify potentially relevant government support or incentives?',
    type: 'radio',
    options: [
      { id: 'Yes', label: 'Yes' },
      { id: 'No', label: 'No' },
      { id: 'Show me what\\'s relevant', label: 'Show me what\\'s relevant' }
    ]
  },
  {
    id: 'supportType',
    section: 'OPERATIONS',
    title: 'What type of support are you interested in?',
    type: 'multiselect',
    condition: (a) => a.govtSupport === 'Yes' || a.govtSupport === 'Show me what\\'s relevant',
    options: [
      { id: 'Capital subsidy', label: 'Capital subsidy' },
      { id: 'Interest subsidy', label: 'Interest subsidy' },
      { id: 'Tax-related incentive', label: 'Tax-related incentive' },
      { id: 'Electricity / power incentive', label: 'Electricity / power incentive' },
      { id: 'Employment incentive', label: 'Employment incentive' },
      { id: 'Export support', label: 'Export support' },
      { id: 'Startup support', label: 'Startup support' },
      { id: 'MSME support', label: 'MSME support' },
      { id: 'Sector-specific incentive', label: 'Sector-specific incentive' },
      { id: 'Other', label: 'Other' }
    ]
  },
  
  // REVIEW TRIGGER - special ID
  {
    id: 'review',
    section: 'REGULATORY JOURNEY',
    title: 'Review your business profile',
    type: 'radio', // Special handling
  }
];

export function ApplicantDiscoveryFlow({ onComplete }: ApplicantDiscoveryFlowProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // State for multiselect and input temporary values
  const [tempMultiSelect, setTempMultiSelect] = useState<Set<string>>(new Set());
  const [tempInput, setTempInput] = useState<string>('');

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [answers]);

  // Calculate visible questions dynamically
  const visibleQuestions: QuestionDef[] = [];
  let reachedEnd = false;
  
  for (const q of QUESTIONS) {
    if (!q.condition || q.condition(answers)) {
      visibleQuestions.push(q);
      if (answers[q.id] === undefined) {
        reachedEnd = true;
        break; 
      }
    }
  }

  const currentSection = reachedEnd ? visibleQuestions[visibleQuestions.length - 1]?.section : "REGULATORY JOURNEY";

  const handleSelectRadio = (questionId: string, value: string) => {
    commitAnswer(questionId, value);
  };

  const handleMultiToggle = (val: string) => {
    setTempMultiSelect(prev => {
      const next = new Set(prev);
      if (next.has(val)) next.delete(val);
      else next.add(val);
      return next;
    });
  };

  const handleMultiSubmit = (questionId: string) => {
    if (tempMultiSelect.size > 0) {
      commitAnswer(questionId, Array.from(tempMultiSelect).join(', '));
      setTempMultiSelect(new Set());
    }
  };

  const handleInputSubmit = (questionId: string) => {
    if (tempInput.trim()) {
      commitAnswer(questionId, tempInput.trim());
      setTempInput('');
    }
  };

  const commitAnswer = (questionId: string, value: any) => {
    const keysToKeep = new Set<string>();
    for (const vq of visibleQuestions) {
      if (vq.id === questionId) break;
      keysToKeep.add(vq.id);
    }
    
    const finalAnswers: Record<string, any> = {};
    for (const key of Object.keys(answers)) {
      if (keysToKeep.has(key)) {
        finalAnswers[key] = answers[key];
      }
    }
    
    finalAnswers[questionId] = value;
    setAnswers(finalAnswers);
    setTempMultiSelect(new Set());
    setTempInput('');
  };

  const handleEdit = (questionId: string) => {
    const keysToKeep = new Set<string>();
    for (const vq of visibleQuestions) {
      if (vq.id === questionId) break;
      keysToKeep.add(vq.id);
    }
    
    const finalAnswers: Record<string, any> = {};
    for (const key of Object.keys(answers)) {
      if (keysToKeep.has(key)) {
        finalAnswers[key] = answers[key];
      }
    }
    setAnswers(finalAnswers);
    setTempMultiSelect(new Set());
    setTempInput('');
  };

  const submitToJourney = () => {
    onComplete({
      intent: answers.intent || '',
      businessType: answers.businessType || '',
      subType: answers.subType || '',
      state: answers.state || 'Maharashtra',
      district: answers.district || 'Pune',
      location: answers.location || '',
      ...answers
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header / Nav */}
        <header className="flex flex-col items-center space-y-6 pb-6 border-b border-slate-200 sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">PRAMAANFLOW</h1>
          
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {SECTIONS.map((sec, i) => {
              const isActive = sec === currentSection;
              const isPast = SECTIONS.indexOf(sec) < SECTIONS.indexOf(currentSection || "");
              return (
                <React.Fragment key={sec}>
                  <span className={isActive ? "text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100" : isPast ? "text-slate-600" : "text-slate-300"}>
                    {i+1}. {sec}
                  </span>
                  {i < SECTIONS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                </React.Fragment>
              );
            })}
          </div>
        </header>

        {/* Engine: Render completed questions as compact rows */}
        <div className="space-y-4">
          {visibleQuestions.map((q, index) => {
            const answer = answers[q.id];
            const isCurrent = answer === undefined;
            const numberLabel = (index + 1).toString().padStart(2, '0');

            if (q.id === 'review' && isCurrent) {
              return (
                <div key={q.id + index} className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6 pb-12">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center sm:text-left">
                        Review your business profile
                      </h2>
                      <p className="text-sm text-slate-500 mt-2">
                        PramaanFlow uses these facts to determine potential regulatory requirements. No final legal determinations are made here.
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
                      {visibleQuestions.filter(vq => vq.id !== 'review').map((vq) => (
                        <div key={vq.id} className="p-4 flex sm:items-center flex-col sm:flex-row justify-between gap-2 hover:bg-slate-50 transition-colors">
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{vq.section}</p>
                            <p className="text-sm font-semibold text-slate-700">{vq.title}</p>
                            <p className="text-sm font-bold text-teal-900 mt-0.5">{answers[vq.id]}</p>
                          </div>
                          <button onClick={() => handleEdit(vq.id)} className="text-xs font-bold text-slate-400 hover:text-teal-700 self-start sm:self-center transition-colors">
                            [ Change ]
                          </button>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={submitToJourney}
                      className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-lg shadow-md transition-all active:scale-95"
                    >
                      Generate Regulatory Journey <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            }

            if (!isCurrent) {
              // COMPACT ROW FOR COMPLETED ANSWER
              return (
                <div key={q.id + index} className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-1 mb-1.5 flex items-center gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{q.section}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-sm transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-8">{numberLabel}</span>
                      <span className="text-xs sm:text-sm font-medium text-slate-600 line-clamp-1 flex-1">{q.title}</span>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Check className="w-4 h-4 text-teal-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-900 max-w-[200px] truncate">{answer}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleEdit(q.id)}
                      className="text-xs font-bold text-slate-400 hover:text-teal-700 transition-colors cursor-pointer ml-4 opacity-0 group-hover:opacity-100"
                    >
                      Change
                    </button>
                  </div>
                </div>
              );
            }

            // DOMINANT ROW FOR CURRENT QUESTION
            return (
              <div key={q.id + index} className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8 pb-32">
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="bg-teal-50 px-2 py-1 rounded border border-teal-100">{q.section}</span>
                      <span>Question {numberLabel}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      {q.title}
                    </h2>
                    {index === 0 && (
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                        Tell us what you’re trying to accomplish. We’ll build the relevant regulatory journey from your answers.
                      </p>
                    )}
                  </div>

                  {q.type === 'radio' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      {q.options.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectRadio(q.id, opt.label)}
                          className="text-left w-full p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-teal-500 hover:shadow-md transition-all group flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-bold text-slate-700 group-hover:text-teal-900 text-sm">
                            {opt.label}
                          </span>
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-teal-500 flex items-center justify-center transition-colors">
                             <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-teal-500 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'multiselect' && q.options && (
                    <div className="space-y-6 mt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map(opt => {
                          const isSelected = tempMultiSelect.has(opt.label);
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleMultiToggle(opt.label)}
                              className={\`text-left w-full p-4 rounded-xl border-2 transition-all group flex items-center gap-3 cursor-pointer \${isSelected ? 'border-teal-500 bg-teal-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}\`}
                            >
                              <div className={\`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors \${isSelected ? 'border-teal-500 bg-teal-500' : 'border-slate-300'}\`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                              </div>
                              <span className={\`font-bold text-sm \${isSelected ? 'text-teal-900' : 'text-slate-700'}\`}>
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <button
                        disabled={tempMultiSelect.size === 0}
                        onClick={() => handleMultiSubmit(q.id)}
                        className={\`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 \${tempMultiSelect.size > 0 ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}\`}
                      >
                        Confirm Selection <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="space-y-4 mt-6 max-w-md">
                      <div className="relative">
                        <input
                          type="text"
                          value={tempInput}
                          onChange={(e) => setTempInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit(q.id)}
                          placeholder={q.placeholder}
                          className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-none"
                          autoFocus
                        />
                        {q.unit && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                            {q.unit}
                          </div>
                        )}
                      </div>
                      <button
                        disabled={!tempInput.trim()}
                        onClick={() => handleInputSubmit(q.id)}
                        className={\`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 \${tempInput.trim() ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}\`}
                      >
                        Next Step <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'ApplicantDiscoveryFlow.tsx'), content);
console.log('Generated successfully');
