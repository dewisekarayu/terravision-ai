import { NextRequest, NextResponse } from "next/server";

export function verifyApiKey(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key") || request.nextUrl.searchParams.get("apiKey");

  if (!apiKey || apiKey !== "terravision-key-9") {
    return {
      isValid: false,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid or missing API key. Please use 'terravision-key-9' in the 'x-api-key' header or as an 'apiKey' query parameter." },
        { status: 401 }
      ),
    };
  }

  return { isValid: true };
}
