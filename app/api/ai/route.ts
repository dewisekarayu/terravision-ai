import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "online",
    model: "TerraVision AI Prediction Core",
    predictions: {
      flood: 0.74,
      heatwave: 0.28,
      pollution: 0.65,
    },
    mitigation: "Activate flood barriers in Lowlands Zone-B; redirect traffic routing.",
  });
}
