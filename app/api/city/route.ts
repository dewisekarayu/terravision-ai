import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";

export async function GET(request: NextRequest) {
  const { isValid, response } = verifyApiKey(request);
  if (!isValid) return response;

  return NextResponse.json({
    status: "operational",
    city: "Metropolis-DX1",
    districts: [
      { id: "downtown", name: "Downtown Core", population: 24500, greenCoverage: 0.14 },
      { id: "residential-a", name: "Residential North", population: 12200, greenCoverage: 0.38 },
      { id: "industrial-west", name: "Industrial Zone", population: 1800, greenCoverage: 0.05 },
    ],
    networks: {
      electricity: "98% capacity",
      water: "100% capacity",
      internet: "99.2% uptime",
    },
  });
}
