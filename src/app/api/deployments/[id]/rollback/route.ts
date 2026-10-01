import { NextRequest, NextResponse } from "next/server";
import { INITIAL_DEPLOYMENTS } from "@/lib/data/mock-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deployment = INITIAL_DEPLOYMENTS.find((d) => d.id === id);

    if (!deployment) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
    }

    // Mark as rolled back in the demo store
    deployment.status = "ROLLED_BACK";
    if (deployment.buildLogs) {
      deployment.buildLogs.push(
        `[${new Date().toLocaleTimeString()}] ⚠️ Automated rollback executed by on-call operator.`
      );
      deployment.buildLogs.push(
        `[${new Date().toLocaleTimeString()}] ✅ Previous stable container revision restored. Traffic shifted.`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rollback completed successfully (Simulated Operation)",
      deployment,
      isSimulated: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Rollback failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
