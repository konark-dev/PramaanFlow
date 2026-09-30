export interface Approval {
  id: string;
  name: string;
  description: string;
  authority: string;
  department: string;
  jurisdiction: string;
  sector: string[];
  stage: string;
  applicability_conditions: string[];
  required_documents: string[];
  depends_on: string[];
  source_id: string;
  effective_from?: string;
  effective_to?: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'PROPOSED';
}

export interface Department {
  id: string;
  name: string;
  level: 'CENTRAL' | 'STATE' | 'DISTRICT' | 'LOCAL';
  state?: string;
  portal?: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  source_id: string;
}

export interface RegulatoryRule {
  id: string;
  rule_code: string;
  condition: string;
  effect: string;
  approval_id: string;
  source_id: string;
}

export interface RegulatorySource {
  id: string;
  name: string;
  url: string;
  authority: string;
  source_type: 'ACT' | 'GAZETTE' | 'NOTIFICATION' | 'PORTAL' | 'OTHER';
  retrieved_at: string;
  publication_date?: string;
  effective_date?: string;
  version: string;
  hash: string;
}

export interface ApprovalRecommendation {
  approval_id: string;
  project_id: string;
  status: 'REQUIRED' | 'CONDITIONAL' | 'NOT_REQUIRED';
  reason: string;
  authority: string;
  dependencies: string[];
  required_documents: string[];
  evidence: {
    source: string;
    url: string;
    text: string;
  }[];
  confidence: number;
}
