import { NextRequest, NextResponse } from "next/server";
import { generateFileRoadmap } from "@/src/application/useCases/generateFileRoadmap";
import { DEMO_ROADMAP } from "@/src/application/demo/demoData";
import type { ProjectPlan } from "@/src/application/useCases/generateProjectPlan";

export async function POST(req: NextRequest) {
  const plan: ProjectPlan = await req.json();

  if (!plan?.projectName) {
    return NextResponse.json(
      { error: "Se requiere un plan de proyecto válido." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ...DEMO_ROADMAP, isDemo: true });
  }

  try {
    const roadmap = await generateFileRoadmap(plan);
    return NextResponse.json({ ...roadmap, isDemo: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[generate-roadmap] Error:", message);
    return NextResponse.json({ ...DEMO_ROADMAP, isDemo: true });
  }
}
