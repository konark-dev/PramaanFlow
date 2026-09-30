import { SourceAdapter } from './source-adapter';
import { RegulatorySource, Approval } from '../types';

export class NSWSAdapter implements SourceAdapter {
  sourceName = 'NSWS / National Single Window System';

  async fetchData(): Promise<{ sources: RegulatorySource[]; approvals: Partial<Approval>[] }> {
    // Note: In a production environment, this would call the NSWS API.
    // For this demo, we document the limitation and return empty arrays.
    // Real data will be seeded via seed files.
    return { sources: [], approvals: [] };
  }
}
