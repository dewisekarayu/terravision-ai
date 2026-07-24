import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";

export async function GET(request: NextRequest) {
  const { isValid, response } = verifyApiKey(request);
  if (!isValid) return response;

  return NextResponse.json({
    status: "tracking",
    metrics: [
      {
        goal: 9,
        title: "Industry, Innovation, and Infrastructure",
        indicators: { resilientGridRatio: 0.82, smartSensingDeployRate: 0.9 },
      },
      {
        goal: 11,
        title: "Sustainable Cities and Communities",
        indicators: { greenCoverageIndex: 0.64, wasteRecyclingRate: 0.58 },
      },
      {
        goal: 13,
        title: "Climate Action",
        indicators: { carbonEmissionReduction: 0.75, disasterResponseReadiness: 0.88 },
      },
    ],
  });
}
