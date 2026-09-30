import { RegulatorySource, Approval } from '../types';

export interface SourceAdapter {
  sourceName: string;
  fetchData(): Promise<{ sources: RegulatorySource[]; approvals: Partial<Approval>[] }>;
}
