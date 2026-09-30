import { tool } from 'ai';
import { z } from 'zod';
import { RecommendationEngine } from '../recommendation/recommendation-engine';
import { syncProjectToRegulatoryGraph } from '../sync/project-sync';

export const regulatoryTools = {
  get_required_approvals: tool({
    description: 'Get authoritative, deterministic required regulatory approvals for a project based on its ID.',
    parameters: z.object({
      projectId: z.string().describe('The UUID of the project'),
    }),
    execute: async ({ projectId }) => {
      try {
        // Ensure graph is synced first
        await syncProjectToRegulatoryGraph(projectId);
        
        // Generate recommendations
        const engine = new RecommendationEngine();
        const recommendations = await engine.generateRecommendations(projectId);
        return { success: true, recommendations };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
  }),

  resolve_project_jurisdiction: tool({
    description: 'Resolve the geospatial jurisdiction (State, District) of a project.',
    parameters: z.object({
      projectId: z.string().describe('The UUID of the project'),
    }),
    execute: async ({ projectId }) => {
      try {
        const { state, district } = await syncProjectToRegulatoryGraph(projectId);
        return { success: true, state, district };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }
  })
};
