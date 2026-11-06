import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readFile } from "fs/promises";
import path from "path";
import { renderNoticeEmail } from "@/lib/email-template";

type NoticePayload = {
  to: string;
  subject: string;
  name: string;
  badgeLabel: string;
  badgeColor?: "agriGreen" | "harvestGold" | "forest" | "red";
  heading: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
};

function isLikelyEmail(value: string | undefined): value is string {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Generic single-recipient notice email — verification outcomes,
 * marketplace activity (interest expressed, booking requested), and any
 * other one-line event that doesn't need the field-table layout
 * notify-lead's internal/confirmation emails use.
 *
 * Same best-effort contract as notify-lead: the underlying record is
 * already saved by the time this is called, missing SMTP config or a
 * delivery failure here must never surface as an error to the caller.
 */
export async function POST(request: Request) {
  let payload: NoticePayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { to, subject, name, badgeLabel, badgeColor, heading, message, ctaLabel, ctaUrl, footerNote } = payload;
  if (!isLikelyEmail(to) || !subject || !name || !badgeLabel || !heading || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return NextResponse.json({ ok: true, sent: false, reason: "SMTP not configured" });
  }

  const fromAddress = process.env.NOTIFY_FROM_EMAIL || user;

  const html = renderNoticeEmail({ name, badgeLabel, badgeColor, heading, message, ctaLabel, ctaUrl, footerNote });

  try {
    const logoBuffer = await readFile(path.join(process.cwd(), "public", "logo.png"));

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
      attachments: [{ filename: "logo.png", content: logoBuffer, cid: "agrixpert-logo" }],
    });

    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    console.error("SMTP notice error:", err);
    return NextResponse.json({ ok: true, sent: false, reason: "Delivery error" });
  }
}
