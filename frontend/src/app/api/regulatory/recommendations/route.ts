import { NextRequest, NextResponse } from "next/server";
import { RecommendationEngine } from "@/lib/ai/regulatory/recommendation/recommendation-engine";
import { syncProjectToRegulatoryGraph } from "@/lib/ai/regulatory/sync/project-sync";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId parameter" }, { status: 400 });
  }

  try {
    // Ensure sync to Neo4j graph happens first to simulate the full pipeline
    await syncProjectToRegulatoryGraph(projectId);

    const engine = new RecommendationEngine();
    const recommendations = await engine.generateRecommendations(projectId);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      recommendations
    });
  } catch (error: any) {
    console.error("Regulatory recommendation API error:", error);
    return NextResponse.json(
      { error: "Failed to generate regulatory recommendations.", details: error.message },
      { status: 500 }
    );
  }
}
