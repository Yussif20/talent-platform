import { todayLocalISO } from "@talent/domain";

/**
 * Identifiers for a new screening, generated in the browser.
 *
 * Both are created client-side on purpose. The `anon` role holds INSERT on
 * `submissions` and nothing else -- it cannot SELECT, so it cannot read back the row it
 * just wrote to discover its id. Generating both here means no read-back is needed, and
 * the token becomes the capability that lets an account-less parent reopen their own
 * report later without exposing anyone else's.
 *
 * 24 bytes of CSPRNG output, hex-encoded to 48 characters.
 */
export function newScreeningIdentifiers(): { id: string; reportToken: string } {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return {
    id: crypto.randomUUID(),
    reportToken: Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(""),
  };
}

/** Where to send the respondent once their screening is saved. */
export function reportPath(locale: string, id: string, token: string): string {
  return `/${locale}/report/${id}?t=${token}`;
}

/**
 * Today's date as a calendar date in the user's own timezone.
 *
 * The forms used `new Date().toISOString().slice(0, 10)`, which is UTC. In Riyadh
 * (UTC+3) every local time from 00:00 to 02:59 is still the previous day in UTC, so a
 * screening completed just after midnight was filed under yesterday -- landing in the
 * wrong bucket for any date filter on the dashboard.
 */
export const checkupDateToday = todayLocalISO;
