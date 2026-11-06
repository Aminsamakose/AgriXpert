import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readFile } from "fs/promises";
import path from "path";
import { contactEmail } from "@/lib/site-data";
import { renderLeadNotificationEmail, type EmailField } from "@/lib/email-template";

type EntityType = "farmer" | "buyer" | "supplier" | "cooperative" | "enquiry";

type LeadPayload = {
  subject: string;
  entityType?: EntityType;
  replyTo?: string;
  fields: EmailField[];
};

const presentation: Record<EntityType, { badge: string; heading: string; intro: string; adminTab: string }> = {
  farmer: {
    badge: "FARMER",
    heading: "New Farmer Registration",
    intro: "A farmer just registered on the AgriXpert platform and is awaiting verification.",
    adminTab: "farmers",
  },
  buyer: {
    badge: "BUYER",
    heading: "New Buyer Sourcing Request",
    intro: "A buyer submitted a sourcing request and is awaiting verification.",
    adminTab: "buyers",
  },
  supplier: {
    badge: "SUPPLIER",
    heading: "New Supplier / Partner Registration",
    intro: "A supplier or service partner just registered and is awaiting verification.",
    adminTab: "suppliers",
  },
  cooperative: {
    badge: "COOPERATIVE",
    heading: "New Cooperative Registration",
    intro: "A cooperative lead just registered and is awaiting verification.",
    adminTab: "cooperatives",
  },
  enquiry: {
    badge: "ENQUIRY",
    heading: "New Website Enquiry",
    intro: "Someone submitted an enquiry through the AgriXpert contact form.",
    adminTab: "enquiries",
  },
};

/**
 * Sends an email notification for a new lead (contact enquiry, farmer,
 * buyer, supplier or cooperative registration) over plain SMTP, using our
 * own mailbox rather than a third-party email API.
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
 * For a Google Workspace / Gmail mailbox: SMTP_HOST=smtp.gmail.com,
 * SMTP_PORT=465, SMTP_USER=the sending address, SMTP_PASS=an app password
 * generated for that account (Google Account > Security > App passwords;
 * requires 2-Step Verification to be on).
 */
export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { subject, entityType, replyTo, fields } = payload;
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agri-xpert.vercel.app";

  const preset = entityType ? presentation[entityType] : undefined;

  const html = renderLeadNotificationEmail({
    heading: preset?.heading ?? subject,
    intro: preset?.intro,
    badgeLabel: preset?.badge ?? "NOTIFICATION",
    fields,
    adminUrl: `${siteUrl}/admin${preset ? `?tab=${preset.adminTab}` : ""}`,
  });

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
      to: notifyEmail,
      ...(replyTo ? { replyTo } : {}),
      subject,
      html,
      attachments: [
        {
          filename: "logo.png",
          content: logoBuffer,
          cid: "agrixpert-logo",
        },
      ],
    });

    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    console.error("SMTP notification error:", err);
    return NextResponse.json({ ok: true, sent: false, reason: "Delivery error" });
  }
}
