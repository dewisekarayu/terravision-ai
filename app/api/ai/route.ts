import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";

export async function GET(request: NextRequest) {
  const { isValid, response } = verifyApiKey(request);
  if (!isValid) return response;

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
