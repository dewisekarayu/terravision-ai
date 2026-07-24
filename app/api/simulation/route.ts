import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "active",
    scenarios: ["normal", "rainfall", "flood", "heatwave", "pollution", "earthquake"],
    activeAlerts: [
      {
        id: "alert-1",
        type: "flood",
        severity: "critical",
        message: "River basin level exceeds 1.8 meters.",
      },
    ],
  });
}
