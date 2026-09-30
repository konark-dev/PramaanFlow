import { IS_DEMO_MODE } from './config';
import { analyzeMaharashtraLocation } from '@/lib/maharashtra-geospatial';

export interface GeospatialService {
  analyze(lat: number, lng: number, locationName?: string): Promise<any>;
}

export class DemoGeospatialService implements GeospatialService {
  async analyze(lat: number, lng: number, locationName?: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (locationName && locationName.includes('MIDC')) {
          resolve({
            jurisdiction: { state: "Maharashtra", district: "Pune", taluka: "Khed" },
            zones: ["Chakan Industrial Area / MIDC", "Special Economic Zone"],
            authorities: ["MIDC Planning Authority", "MPCB Pune Regional Office"],
            exemptions: ["NA Tax Exempt"]
          });
        } else {
          resolve(analyzeMaharashtraLocation(lat, lng));
        }
      }, 500);
    });
  }
}

class RealGeospatialService implements GeospatialService {
  async analyze(lat: number, lng: number, locationName?: string): Promise<any> {
    try {
      const response = await fetch(`/api/geospatial/analyze?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error(`Geospatial API Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Geospatial API Failed:", error);
      throw error;
    }
  }
}

export const geospatialService = IS_DEMO_MODE ? new DemoGeospatialService() : new RealGeospatialService();
