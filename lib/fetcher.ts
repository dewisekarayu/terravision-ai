export const API_KEY = "terravision-key-9";

export async function fetchWithApiKey<T>(url: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const separator = url.includes("?") ? "&" : "?";
  
  const response = await fetch(`${baseUrl}${url}${separator}apiKey=${API_KEY}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Ensure real-time telemetry is fetched fresh
  });

  if (!response.ok) {
    throw new Error(`API fetch error on ${url}: Status ${response.status}`);
  }

  return response.json();
}
