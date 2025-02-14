import { NextResponse } from "next/server";

export async function GET() {
  const streamlitURL = "https://lovepop1-emotiai-private-file-owjds1.streamlit.app/";

  try {
    const response = await fetch(streamlitURL, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      return new NextResponse(`Error fetching Streamlit app: ${response.statusText}`, { status: response.status });
    }

    const html = await response.text();

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return new NextResponse(`Server error: ${error}`, { status: 500 });
  }
}
