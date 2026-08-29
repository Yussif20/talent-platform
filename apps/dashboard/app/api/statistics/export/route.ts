import { NextResponse } from "next/server";

const API_BASE_URL =
  "https://talent1234bridge-001-site1.stempurl.com/api/Reports";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    let url = `${API_BASE_URL}/export-excel`;

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
    });

    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="TalentBridge_Statistics_${
          new Date().toISOString().split("T")[0]
        }.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error downloading Excel report:", error);
    return NextResponse.json(
      { error: "Failed to download report" },
      { status: 500 }
    );
  }
}
