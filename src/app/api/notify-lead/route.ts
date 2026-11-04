import { NextResponse } from "next/server";
import { contactEmail } from "@/lib/site-data";

type LeadField = { label: string; value: string };

type LeadPayload = {
  subject: string;
  replyTo?: string;
  fields: LeadField[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends an email notification for a new lead (contact enquiry, farmer,
 * buyer or supplier registration) via Resend.
 *
 * This is intentionally best-effort: the lead has already been saved to its
 * Supabase table by the time this route is called, so a missing API key or
 * a delivery failure here must never surface as an error to the person
 * submitting the form — it only means the notification email didn't go
 * out. The lead is still visible in /admin.
 *
 * Requires a RESEND_API_KEY environment variable (set in Vercel project
 * settings) to actually send. Without one, this route responds 200 and
 * does nothing, so every form keeps working either way.
 */
export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { subject, replyTo, fields } = payload;
  if (!subject || !Array.isArray(fields) || fields.length === 0) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No email provider configured yet — the lead is still saved to the
    // database and visible in the admin dashboard. Nothing to do here.
    return NextResponse.json({ ok: true, sent: false, reason: "RESEND_API_KEY not configured" });
  }

  const notifyEmail = process.env.NOTIFY_EMAIL || contactEmail;
  const fromAddress = process.env.NOTIFY_FROM_EMAIL || "AgriXpert Website <onboarding@resend.dev>";

  const rowsHtml = fields
    .map(
      (f) =>
        `<p><strong>${escapeHtml(f.label)}:</strong> ${escapeHtml(f.value).replace(/\n/g, "<br />")}</p>`
    )
    .join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [notifyEmail],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        html: `
          ${rowsHtml}
          <hr />
          <p style="color:#888;font-size:12px;">Sent automatically from the AgriXpert website. This submission is also saved in the admin dashboard.</p>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend notification failed:", res.status, body);
      return NextResponse.json({
        ok: true,
        sent: false,
        reason: "Email provider error",
        providerStatus: res.status,
        providerDetail: body,
      });
    }

    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    console.error("Resend notification error:", err);
    return NextResponse.json({ ok: true, sent: false, reason: "Network error" });
  }
}
