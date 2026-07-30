import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-key";

export async function GET(request: NextRequest) {
  const { isValid, response } = verifyApiKey(request);
  if (!isValid) return response;

  const baseTemp = 31.5;
  const baseHumidity = 82;
  const baseWind = 12;
  const baseCo2 = 352;

  return NextResponse.json({
    status: "active",
    sensors: {
      temperature: `${(baseTemp + (Math.random() * 1.5 - 0.75)).toFixed(1)} °C`,
      humidity: `${Math.floor(baseHumidity + (Math.random() * 4 - 2))}%`,
      windSpeed: `${Math.floor(baseWind + (Math.random() * 4 - 2))} km/h`,
      co2Level: `${Math.floor(baseCo2 + (Math.random() * 12 - 6))} ppm`,
    },
    projections: {
      temperatureRise: "+1.5 °C by 2030",
      seaLevelRise: "+0.25 m by 2050",
    },
  });
}
