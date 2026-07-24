import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";

export async function GET(request: NextRequest) {
  const { isValid, response } = verifyApiKey(request);
  if (!isValid) return response;

  return NextResponse.json({
    status: "active",
    sensors: {
      temperature: "28.4 °C",
      humidity: "72%",
      windSpeed: "14 km/h",
      co2Level: "412 ppm",
    },
    projections: {
      temperatureRise: "+1.2 °C by 2030",
      seaLevelRise: "+0.15 m by 2050",
    },
  });
}
