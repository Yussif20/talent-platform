import { NextResponse } from "next/server";

const API_BASE_URL =
  "https://talent1234bridge-001-site1.stempurl.com/api/Reports";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    let url = `${API_BASE_URL}/summary`;

    // Add date filters if provided
    if (fromDate && toDate) {
      const params = new URLSearchParams({
        fromDate,
        toDate,
      });
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        Accept: "*/*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
