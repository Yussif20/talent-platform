/**
 * Emails a screening report link to a parent.
 *
 * Deployed as a Supabase Edge Function (Deno):
 *   supabase functions deploy send-report
 *   supabase secrets set RESEND_API_KEY=... REPORT_BASE_URL=https://...
 *
 * Why a link rather than an attachment
 * ------------------------------------
 * The PDF is generated in the browser, because that is the only way to get correctly
 * shaped Arabic without a headless-Chrome runtime (see components/ReportView.tsx).
 * Uploading that blob just so the server can attach it back to an email would add a
 * storage bucket, a signed-URL flow and a few hundred kB of upload for no benefit: the
 * recipient can download the same PDF from the report page itself, in whichever
 * language they prefer, and can return to it later.
 *
 * Security: the caller must present the report's own capability token. This function
 * verifies it against the database before sending, so possession of an id alone cannot
 * be used to spray mail at arbitrary addresses. It also never echoes the report's
 * contents into the request response.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

interface SendRequest {
  id: string;
  token: string;
  email: string;
  locale?: "ar" | "en";
}

const COPY = {
  en: {
    subject: "Your TalentBridge screening report",
    heading: "Your screening report is ready",
    body:
      "Thank you for completing the TalentBridge screening. You can view the full " +
      "result, and download it as a PDF, using the link below.",
    cta: "View the report",
    caution:
      "Anyone with this link can view the report, so please share it only with people " +
      "you trust. This is an educational screening result, not a medical or " +
      "psychological diagnosis.",
  },
  ar: {
    subject: "تقرير الفحص الخاص بك من جسر المواهب",
    heading: "تقرير الفحص جاهز",
    body:
      "شكراً لإكمالك فحص جسر المواهب. يمكنك الاطلاع على النتيجة كاملة وتحميلها بصيغة PDF " +
      "من خلال الرابط أدناه.",
    cta: "عرض التقرير",
    caution:
      "يمكن لأي شخص لديه هذا الرابط الاطلاع على التقرير، لذا يُرجى مشاركته مع من تثق بهم " +
      "فقط. هذه نتيجة فحص تربوي وليست تشخيصاً طبياً أو نفسياً.",
  },
} as const;

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const baseUrl = Deno.env.get("REPORT_BASE_URL");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!resendKey || !baseUrl) {
    // Email is an optional add-on. Without it configured the app still works; the
    // report page and its PDF download are unaffected.
    return json({ error: "email_not_configured" }, 501);
  }
  if (!supabaseUrl || !serviceKey) {
    return json({ error: "server_misconfigured" }, 500);
  }

  let payload: SendRequest;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { id, token, email, locale = "ar" } = payload;

  if (!isUuid(id) || !isToken(token) || !isEmail(email)) {
    return json({ error: "invalid_request" }, 400);
  }

  // Verify the caller actually holds this report's capability token. Without this the
  // endpoint would send mail to any address on request.
  const verify = await fetch(`${supabaseUrl}/rest/v1/rpc/get_report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ p_id: id, p_token: token }),
  });

  if (!verify.ok) return json({ error: "verification_failed" }, 502);
  const report = await verify.json();
  if (!report) return json({ error: "not_found" }, 404);

  const copy = COPY[locale === "en" ? "en" : "ar"];
  const link = `${baseUrl.replace(/\/$/, "")}/${locale}/report/${id}?t=${token}`;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const sent = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: Deno.env.get("REPORT_FROM_ADDRESS") ?? "TalentBridge <onboarding@resend.dev>",
      to: [email],
      subject: copy.subject,
      html: renderEmail({ copy, link, dir }),
    }),
  });

  if (!sent.ok) {
    console.error("resend rejected the message:", sent.status, await sent.text());
    return json({ error: "send_failed" }, 502);
  }

  return json({ ok: true });
});

function renderEmail({
  copy,
  link,
  dir,
}: {
  copy: (typeof COPY)["en"];
  link: string;
  dir: "rtl" | "ltr";
}) {
  return `<!doctype html>
<html dir="${dir}">
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:system-ui,-apple-system,'Segoe UI',Tahoma,sans-serif;">
    <table role="presentation" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
      <tr><td>
        <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">${escapeHtml(copy.heading)}</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">${escapeHtml(copy.body)}</p>
        <p style="margin:0 0 24px;">
          <a href="${escapeHtml(link)}"
             style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:15px;">
            ${escapeHtml(copy.cta)}
          </a>
        </p>
        <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">${escapeHtml(copy.caution)}</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const isUuid = (v: unknown) =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const isToken = (v: unknown) => typeof v === "string" && /^[0-9a-f]{32,128}$/i.test(v);
const isEmail = (v: unknown) =>
  typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
