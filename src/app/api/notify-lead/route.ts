import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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
 * buyer or supplier registration) over plain SMTP, using our own mailbox
 * rather than a third-party email API.
 *
 * This is intentionally best-effort: the lead has already been saved to its
 * Supabase table by the time this route is called, so missing SMTP config
 * or a delivery failure here must never surface as an error to the person
 * submitting the form — it only means the notification email didn't go
 * out. The lead is still visible in /admin.
 *
 * Requires SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS environment
 * variables (set in Vercel project settings) to actually send. Without
 * them, this route responds 200 and does nothing, so every form keeps
 * working either way.
 *
 * For a Google Workspace mailbox (samakose.com's current MX): SMTP_HOST=
 * smtp.gmail.com, SMTP_PORT=465, SMTP_USER=the sending address, SMTP_PASS=
 * an app password generated for that account (Google Account > Security >
 * App passwords; requires 2-Step Verification to be on).
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

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    // No mailbox configured yet — the lead is still saved to the database
    // and visible in the admin dashboard. Nothing to do here.
    return NextResponse.json({ ok: true, sent: false, reason: "SMTP not configured" });
  }

  const notifyEmail = process.env.NOTIFY_EMAIL || contactEmail;
  const fromAddress = process.env.NOTIFY_FROM_EMAIL || user;

  const rowsHtml = fields
    .map(
      (f) =>
        `<p><strong>${escapeHtml(f.label)}:</strong> ${escapeHtml(f.value).replace(/\n/g, "<br />")}</p>`
    )
    .join("");

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: fromAddress,
      to: notifyEmail,
      ...(replyTo ? { replyTo } : {}),
      subject,
      html: `
        ${rowsHtml}
        <hr />
        <p style="color:#888;font-size:12px;">Sent automatically from the AgriXpert website. This submission is also saved in the admin dashboard.</p>
      `,
    });

    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    console.error("SMTP notification error:", err);
    return NextResponse.json({ ok: true, sent: false, reason: "Delivery error" });
  }
}
