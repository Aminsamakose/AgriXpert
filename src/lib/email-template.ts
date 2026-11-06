// Shared HTML template for transactional/notification emails sent from the
// AgriXpert platform. Built with inline styles and a table-based layout —
// no external CSS or webfonts — because that's what renders consistently
// across Gmail, Outlook and mobile mail clients.
//
// The logo is referenced as cid:agrixpert-logo, so the sending route must
// attach public/logo.png as an inline attachment with that same cid (see
// notify-lead/route.ts). That keeps the logo showing up even when a client
// blocks remote images, which a plain https:// <img> src would not survive.

const BRAND = {
  forest: "#075421",
  forestDark: "#053A17",
  agriGreen: "#69B42E",
  harvestGold: "#C8622C",
  white: "#FFFFFF",
  ink: "#1F2A20",
  muted: "#6B7A6D",
  border: "#E3E8DE",
  bg: "#F4F6F1",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type EmailField = { label: string; value: string };

function fieldTable(fields: EmailField[]) {
  const rowsHtml = fields
    .map(
      (f, i) => `
        <tr>
          <td style="padding:14px 20px;${i > 0 ? `border-top:1px solid ${BRAND.border};` : ""}vertical-align:top;width:170px;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.muted};">
              ${escapeHtml(f.label)}
            </span>
          </td>
          <td style="padding:14px 20px;${i > 0 ? `border-top:1px solid ${BRAND.border};` : ""}vertical-align:top;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${BRAND.ink};line-height:1.5;">
              ${escapeHtml(f.value).replace(/\n/g, "<br />") || "—"}
            </span>
          </td>
        </tr>`
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">${rowsHtml}</table>`;
}

function badgePill(label: string, color: string) {
  return `<span style="display:inline-block;background-color:${color}1A;color:${color};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">
    ${escapeHtml(label)}
  </span>`;
}

function ctaButton(label: string, url: string, color: string) {
  return `<a href="${url}" style="display:inline-block;background-color:${color};color:${BRAND.white};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:10px 20px;border-radius:999px;">
    ${escapeHtml(label)} →
  </a>`;
}

/**
 * Wraps a block of body content (badge, heading, whatever comes next) in the
 * shared card shell: logo header, white card, footer tagline. Callers build
 * their own body HTML and pass it in — this just keeps the outer chrome
 * (and therefore the brand look) identical across every email we send.
 */
function shell(bodyHtml: string, footerNote: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;overflow:hidden;border:1px solid ${BRAND.border};">

            <!-- Header -->
            <tr>
              <td style="background-color:${BRAND.white};padding:22px 28px;border-bottom:3px solid ${BRAND.forest};">
                <img src="cid:agrixpert-logo" alt="AgriXpert" width="156" height="52" style="display:block;" />
              </td>
            </tr>

            ${bodyHtml}

            <!-- Footer -->
            <tr>
              <td style="padding:24px 28px 28px 28px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${BRAND.muted};line-height:1.6;">
                  ${footerNote}
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${BRAND.muted};">
            AgriXpert · a Samakose venture
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Internal, admin-facing notification: "a new X came in", with the full
 * submitted field set and a deep link into the admin dashboard.
 */
export function renderLeadNotificationEmail({
  heading,
  intro,
  fields,
  badgeLabel,
  adminUrl,
}: {
  /** e.g. "New Farmer Registration" */
  heading: string;
  /** one-line context sentence under the heading */
  intro?: string;
  fields: EmailField[];
  /** short category pill, e.g. "FARMER", "BUYER", "ENQUIRY" */
  badgeLabel: string;
  adminUrl?: string;
}) {
  const body = `
    <tr>
      <td style="padding:28px 28px 8px 28px;">
        ${badgePill(badgeLabel, BRAND.harvestGold)}
        <h1 style="margin:14px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:22px;color:${BRAND.forestDark};">
          ${escapeHtml(heading)}
        </h1>
        ${intro ? `<p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.muted};line-height:1.5;">${escapeHtml(intro)}</p>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 8px 28px;">
        ${fieldTable(fields)}
      </td>
    </tr>
    ${
      adminUrl
        ? `<tr>
      <td style="padding:20px 28px 4px 28px;">
        ${ctaButton("Open in Admin Dashboard", adminUrl, BRAND.agriGreen)}
      </td>
    </tr>`
        : ""
    }
  `;

  return shell(
    body,
    "Sent automatically by the AgriXpert platform. This record is already saved and visible in the admin dashboard regardless of this email."
  );
}

/**
 * Submitter-facing confirmation: "we got it, here's what happens next",
 * sent back to the farmer/buyer/supplier/cooperative/enquirer's own email
 * address right after they submit a form.
 */
export function renderConfirmationEmail({
  name,
  heading,
  bodyMessage,
  nextSteps,
  fields,
  badgeLabel,
}: {
  /** the submitter's name or company name, for a personal greeting */
  name: string;
  /** e.g. "Thanks for registering with AgriXpert" */
  heading: string;
  /** 1-2 sentence explanation of what happens next */
  bodyMessage: string;
  /** short bullet list of next steps, e.g. verification timeline */
  nextSteps?: string[];
  /** a condensed copy of what they submitted, for their own records */
  fields: EmailField[];
  badgeLabel: string;
}) {
  const nextStepsHtml =
    nextSteps && nextSteps.length > 0
      ? `<tr>
          <td style="padding:4px 28px 8px 28px;">
            <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.muted};">
              What happens next
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${nextSteps
                .map(
                  (step, i) => `
                <tr>
                  <td style="padding:6px 0;vertical-align:top;width:28px;">
                    <span style="display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;border-radius:50%;background-color:${BRAND.agriGreen}1A;color:${BRAND.agriGreen};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;">
                      ${i + 1}
                    </span>
                  </td>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.ink};line-height:1.5;">
                      ${escapeHtml(step)}
                    </span>
                  </td>
                </tr>`
                )
                .join("")}
            </table>
          </td>
        </tr>`
      : "";

  const body = `
    <tr>
      <td style="padding:28px 28px 8px 28px;">
        ${badgePill(badgeLabel, BRAND.agriGreen)}
        <h1 style="margin:14px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:22px;color:${BRAND.forestDark};">
          ${escapeHtml(heading)}
        </h1>
        <p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${BRAND.ink};line-height:1.6;">
          Hi ${escapeHtml(name)}, ${escapeHtml(bodyMessage)}
        </p>
      </td>
    </tr>
    ${nextStepsHtml}
    <tr>
      <td style="padding:16px 28px 8px 28px;">
        <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.muted};">
          What you submitted
        </p>
        ${fieldTable(fields)}
      </td>
    </tr>
  `;

  return shell(
    body,
    "This is an automated confirmation — no need to reply. If something above looks wrong, just reply to this email and our team will help."
  );
}

/**
 * Generic single-message notice: a badge, a heading, a short message, and
 * an optional CTA button. Used for anything that doesn't need a field
 * table — verification outcomes, marketplace activity (interest expressed,
 * booking requested), cooperative membership changes, and similar one-line
 * events.
 */
export function renderNoticeEmail({
  name,
  badgeLabel,
  badgeColor = "agriGreen",
  heading,
  message,
  ctaLabel,
  ctaUrl,
  footerNote,
}: {
  /** the recipient's name, for a personal greeting */
  name: string;
  badgeLabel: string;
  /** which brand color the badge uses */
  badgeColor?: "agriGreen" | "harvestGold" | "forest" | "red";
  heading: string;
  /** full sentence(s); greeting ("Hi Name,") is NOT prepended automatically here */
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}) {
  const colorMap = { agriGreen: BRAND.agriGreen, harvestGold: BRAND.harvestGold, forest: BRAND.forest, red: "#C0392B" };
  const color = colorMap[badgeColor];

  const body = `
    <tr>
      <td style="padding:28px 28px 8px 28px;">
        ${badgePill(badgeLabel, color)}
        <h1 style="margin:14px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:22px;color:${BRAND.forestDark};">
          ${escapeHtml(heading)}
        </h1>
        <p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${BRAND.ink};line-height:1.6;">
          Hi ${escapeHtml(name)}, ${escapeHtml(message)}
        </p>
      </td>
    </tr>
    ${
      ctaLabel && ctaUrl
        ? `<tr>
      <td style="padding:20px 28px 16px 28px;">
        ${ctaButton(ctaLabel, ctaUrl, BRAND.agriGreen)}
      </td>
    </tr>`
        : `<tr><td style="padding:8px;"></td></tr>`
    }
  `;

  return shell(
    body,
    footerNote ?? "This is an automated notification from the AgriXpert platform."
  );
}
