import { NextRequest, NextResponse } from "next/server";
import { syncProjectToRegulatoryGraph } from "@/lib/ai/regulatory/sync/project-sync";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projectId = body.projectId;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const result = await syncProjectToRegulatoryGraph(projectId);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result
    });
  } catch (error: any) {
    console.error("Regulatory sync API error:", error);
    return NextResponse.json(
      { error: "Failed to sync project.", details: error.message },
      { status: 500 }
    );
  }
}
