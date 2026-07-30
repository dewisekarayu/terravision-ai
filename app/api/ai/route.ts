import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";

export async function GET(request: NextRequest) {
  const { isValid, response } = verifyApiKey(request);
  if (!isValid) return response;

  return NextResponse.json({
    status: "online",
    model: "TerraVision AI Prediction Core",
    predictions: {
      flood: 0.82,
      heatwave: 0.35,
      pollution: 0.78,
    },
    mitigation: "Activate flood barriers in Pluit; redirect traffic routing to elevated sections of inner ring road.",
  });
}
