import { NextResponse } from "next/server";
import { createClient } from "@talent/db/server";

/**
 * Statistics proxy.
 *
 * The route survives the backend swap unchanged from the outside: same path, same query
 * parameters, same response body. Only its internals moved from forwarding to a .NET
 * service on a free hosting tier to calling a Postgres function. `lib/api.ts` and all
 * twelve chart components underneath it needed no edits at all.
 *
 * It stays a route handler rather than becoming a direct client-side `supabase.rpc()`
 * call for two reasons: it keeps the API-proxy shape the original architecture document
 * described, and it means an unauthenticated request gets a clean 401 here instead of a
 * raw Postgres permission error surfacing in the browser.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const supabase = await createClient();

    // getUser() revalidates the JWT against the auth server; getSession() would trust
    // whatever the cookie claims.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // undefined rather than null: the generated arg types are optional strings, and
    // omitting a parameter lets the function's own SQL default (null) apply.
    const { data, error } = await supabase.rpc("get_statistics_summary", {
      from_date: fromDate ?? undefined,
      to_date: toDate ?? undefined,
    });

    if (error) {
      // 42501 is Postgres' insufficient_privilege: a signed-in user without a staff role.
      if (error.code === "42501") {
        return NextResponse.json({ error: "Not authorised" }, { status: 403 });
      }
      throw error;
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}
