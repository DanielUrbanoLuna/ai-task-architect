import { NextRequest, NextResponse } from "next/server";
import { generateProjectPlan } from "@/src/application/useCases/generateProjectPlan";
import { DEMO_PLAN } from "@/src/application/demo/demoData";

export async function POST(req: NextRequest) {
  const { description } = await req.json();

  if (!description?.trim()) {
    return NextResponse.json(
      { error: "La descripción no puede estar vacía." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ...DEMO_PLAN, isDemo: true });
  }

  try {
    const plan = await generateProjectPlan(description);
    return NextResponse.json({ ...plan, isDemo: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[generate-plan] Error:", message);
    return NextResponse.json({ ...DEMO_PLAN, isDemo: true });
  }
}
