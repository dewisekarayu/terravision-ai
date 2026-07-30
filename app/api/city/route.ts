import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";

export async function GET(request: NextRequest) {
  const { isValid, response } = verifyApiKey(request);
  if (!isValid) return response;

  return NextResponse.json({
    status: "operational",
    city: "Jakarta, Indonesia",
    districts: [
      { id: "jkt-pusat", name: "Jakarta Pusat", population: 1125000, greenCoverage: 0.12 },
      { id: "jkt-selatan", name: "Jakarta Selatan", population: 2280000, greenCoverage: 0.28 },
      { id: "jkt-utara", name: "Jakarta Utara", population: 1800000, greenCoverage: 0.04 },
    ],
    networks: {
      electricity: `${Math.floor(92 + (Math.random() * 4 - 2))}% capacity`,
      water: `${Math.floor(85 + (Math.random() * 4 - 2))}% capacity`,
      internet: "99.1% uptime",
    },
  });
}
