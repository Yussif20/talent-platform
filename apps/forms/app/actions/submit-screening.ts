"use server";

import { createClient } from "@talent/db/server";
import { toSubmissionRow } from "@talent/db";
import { submissionSchema, type SubmissionInput } from "@talent/domain";

/**
 * Persists a completed screening.
 *
 * Replaces the client-side `fetch` to
 * `https://talent1234bridge-001-site1.stempurl.com/api/SurveyResult/Save`, which posted
 * unvalidated JSON straight from the browser to a .NET service on a free hosting tier.
 * Its predecessor host had already stopped resolving entirely, taking both apps down.
 *
 * Running as a server action puts validation on the server, where it cannot be skipped,
 * and keeps the database out of the browser's reach. The anon role can only INSERT --
 * it cannot read a single row back -- so the caller supplies `id` and `reportToken`,
 * generated with the Web Crypto CSPRNG, and uses them to reach its own report
 * afterwards. See supabase/migrations/20260829000005_report_access.sql.
 */

export interface SubmitResult {
  ok: boolean;
  /** Field-keyed validation messages, when `ok` is false. */
  errors?: Record<string, string>;
  message?: string;
}

export async function submitScreening(
  input: SubmissionInput & { id: string; reportToken: string },
): Promise<SubmitResult> {
  const { id, reportToken, ...payload } = input;

  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f]{32,128}$/i.test(reportToken)) {
    return { ok: false, message: "invalid_identifiers" };
  }

  const parsed = submissionSchema.safeParse(payload);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      errors[key] ??= issue.message;
    }
    return { ok: false, errors, message: "validation_failed" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("submissions")
      .insert(toSubmissionRow(parsed.data, { id, reportToken }) as never);

    if (error) {
      // Never surface raw Postgres text to the browser; it can leak schema details.
      console.error("submitScreening failed:", error);
      return { ok: false, message: "save_failed" };
    }

    return { ok: true };
  } catch (cause) {
    // createClient() throws when NEXT_PUBLIC_SUPABASE_* are absent from the deployment.
    // Those are inlined at build time, so a deployment built before they were set has
    // `undefined` compiled in. Without this catch the action rejects and the respondent
    // sees a generic failure after answering every question, with nothing in the log
    // saying why. Fails closed either way -- the point is that the cause is recoverable
    // from the server log.
    console.error("submitScreening threw before reaching the database:", cause);
    return { ok: false, message: "save_failed" };
  }
}
