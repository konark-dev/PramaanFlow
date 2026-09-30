import { IS_DEMO_MODE } from './config';
import { generateRegulatoryRoadmap, ProjectProfile, ResolvedLocation } from '@/lib/project-state';

export interface RegulatoryService {
  generateRoadmap(profile: any, location: any): Promise<any>;
}

export class DemoRegulatoryService implements RegulatoryService {
  async generateRoadmap(profile: any, location: any): Promise<any> {
    // Deterministic Demo Implementation (Instant/Synchronous mocked as async)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Fallback to internal project-state engine for deterministic demo
        const demoProfile: any = {
          industryType: profile.businessType || 'Food Processing',
          investmentAmount: 50,
          hazardousMaterials: profile.dairy_etp === 'Yes',
          waterUsageKLD: parseInt(profile.dairy_water) || 0,
          powerReqKW: 100
        };
        const demoLocation: any = {
          state: location.loc_state || 'Maharashtra',
          district: location.loc_district || 'Pune',
          taluka: location.loc_taluka || 'Khed',
          industrialArea: location.loc_midc,
          zoning: 'Industrial'
        };
        
        resolve(generateRegulatoryRoadmap(demoProfile as any, demoLocation as any));
      }, 800); // Simulate network latency for demo realism
    });
  }
}

class RealRegulatoryService implements RegulatoryService {
  async generateRoadmap(profile: any, location: any): Promise<any> {
    try {
      const response = await fetch('/api/applicant/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, location })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.roadmap;
    } catch (error) {
      console.error("Regulatory API Failed:", error);
      throw error;
    }
  }
}

export const regulatoryService = IS_DEMO_MODE ? new DemoRegulatoryService() : new RealRegulatoryService();
