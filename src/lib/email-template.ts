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

            <!-- Badge + heading -->
            <tr>
              <td style="padding:28px 28px 8px 28px;">
                <span style="display:inline-block;background-color:${BRAND.harvestGold}1A;color:${BRAND.harvestGold};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">
                  ${escapeHtml(badgeLabel)}
                </span>
                <h1 style="margin:14px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:22px;color:${BRAND.forestDark};">
                  ${escapeHtml(heading)}
                </h1>
                ${intro ? `<p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND.muted};line-height:1.5;">${escapeHtml(intro)}</p>` : ""}
              </td>
            </tr>

            <!-- Field table -->
            <tr>
              <td style="padding:16px 28px 8px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
                  ${rowsHtml}
                </table>
              </td>
            </tr>

            ${
              adminUrl
                ? `<tr>
              <td style="padding:20px 28px 4px 28px;">
                <a href="${adminUrl}" style="display:inline-block;background-color:${BRAND.agriGreen};color:${BRAND.white};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:10px 20px;border-radius:999px;">
                  Open in Admin Dashboard →
                </a>
              </td>
            </tr>`
                : ""
            }

            <!-- Footer -->
            <tr>
              <td style="padding:24px 28px 28px 28px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${BRAND.muted};line-height:1.6;">
                  Sent automatically by the AgriXpert platform. This record is already saved and visible in the admin dashboard regardless of this email.
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
