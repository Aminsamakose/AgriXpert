import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { readFile } from "fs/promises";
import path from "path";
import { renderDigestEmail, type DigestTask } from "@/lib/email-template";

type TaskRow = {
  assigned_to: string;
  entity_type: string;
  entity_label: string;
  title: string;
  due_date: string;
};

/**
 * Daily cron (see vercel.json) that emails each staff member a digest of
 * their own open CRM follow-up tasks that are due today or overdue.
 *
 * Triggered by Vercel Cron, which Vercel authenticates automatically by
 * sending `Authorization: Bearer <CRON_SECRET>` whenever a project env var
 * named exactly CRON_SECRET is set — so this route just needs to check
 * that header matches. The same secret is passed on to the
 * get_due_followup_tasks RPC, which needs its own check since it's also
 * reachable directly via Supabase's public REST endpoint.
 *
 * Same best-effort posture as the rest of notify/notify-lead: missing
 * SMTP config degrades to a silent no-op rather than an error, since
 * nothing about task state changes here — this route only reads and
 * sends email.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error: rpcError } = await supabase.rpc("get_due_followup_tasks", { p_secret: cronSecret });
  if (rpcError) {
    console.error("get_due_followup_tasks error:", rpcError);
    return NextResponse.json({ ok: false, error: rpcError.message }, { status: 500 });
  }

  const rows = (data as TaskRow[] | null) ?? [];
  if (rows.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: "No due tasks" });
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) {
    return NextResponse.json({ ok: true, sent: 0, reason: "SMTP not configured" });
  }

  const today = new Date().toISOString().slice(0, 10);
  const byAssignee = new Map<string, DigestTask[]>();
  for (const row of rows) {
    const list = byAssignee.get(row.assigned_to) ?? [];
    list.push({
      entityType: row.entity_type,
      entityLabel: row.entity_label,
      title: row.title,
      dueDate: row.due_date,
      overdue: row.due_date < today,
    });
    byAssignee.set(row.assigned_to, list);
  }

  const fromAddress = process.env.NOTIFY_FROM_EMAIL || user;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agri-xpert.vercel.app";
  const logoBuffer = await readFile(path.join(process.cwd(), "public", "logo.png"));
  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  const results = await Promise.allSettled(
    Array.from(byAssignee.entries()).map(([email, tasks]) =>
      transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: `${tasks.length} follow-up${tasks.length === 1 ? "" : "s"} due — AgriXpert`,
        html: renderDigestEmail({ name: email, tasks, adminUrl: `${siteUrl}/admin?tab=followups` }),
        attachments: [{ filename: "logo.png", content: logoBuffer, cid: "agrixpert-logo" }],
      })
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) console.error("followup-digest partial failure:", failed);

  return NextResponse.json({ ok: true, sent, recipients: byAssignee.size });
}
