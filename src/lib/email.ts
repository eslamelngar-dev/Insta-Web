import { Resend } from "resend";
import { logger } from "./logger";

const FROM_EMAIL =
  process.env.EMAIL_FROM || "InstaWeb <notifications@instaweb.me>";

interface LeadNotificationData {
  siteName: string;
  leadName: string | null;
  leadEmail: string | null;
  leadPhone: string | null;
  leadMessage: string | null;
  leadSource: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function buildLeadEmailHtml(data: LeadNotificationData): string {
  const fields: { label: string; value: string }[] = [];

  if (data.leadName) fields.push({ label: "Name", value: data.leadName });
  if (data.leadEmail) fields.push({ label: "Email", value: data.leadEmail });
  if (data.leadPhone) fields.push({ label: "Phone", value: data.leadPhone });
  if (data.leadSource) fields.push({ label: "Source", value: data.leadSource });
  if (data.leadMessage)
    fields.push({ label: "Message", value: data.leadMessage });

  if (data.metadata && typeof data.metadata === "object") {
    Object.entries(data.metadata).forEach(([key, value]) => {
      if (value && typeof value === "string") {
        fields.push({ label: key, value });
      }
    });
  }

  const dashboardUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "https://instaweb.me"
  }/dashboard/leads`;

  const fieldsHtml = fields
    .map(
      (f) => `
      <tr>
        <td style="padding:12px 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;vertical-align:top;width:120px;border-bottom:1px solid #f1f5f9;">
          ${f.label}
        </td>
        <td style="padding:12px 16px;font-size:14px;color:#0f172a;border-bottom:1px solid #f1f5f9;">
          ${f.value}
        </td>
      </tr>
    `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:#6366f1;padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:900;letter-spacing:-0.02em;">
        New Lead Received
      </h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
        ${data.siteName}
      </p>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${fieldsHtml}
      </table>
      <div style="margin-top:24px;padding:16px;background:#f8fafc;border-radius:12px;text-align:center;">
        <a href="${dashboardUrl}" style="display:inline-block;padding:12px 32px;background:#6366f1;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;">
          View in Dashboard
        </a>
      </div>
    </div>
    <div style="padding:16px 24px;border-top:1px solid #f1f5f9;text-align:center;">
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        Sent by InstaWeb &middot; ${new Date(data.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendLeadNotification(
  recipientEmail: string,
  data: LeadNotificationData,
): Promise<boolean> {
  const resend = getResendClient();

  if (!resend) {
    logger.warn("Resend API key not configured, skipping email notification");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `New lead from ${data.siteName}: ${data.leadName || data.leadEmail || "Anonymous"}`,
      html: buildLeadEmailHtml(data),
    });

    if (error) {
      logger.error("Failed to send lead notification email", {
        error: error.message,
        recipientEmail,
      });
      return false;
    }

    logger.info("Lead notification email sent", {
      recipientEmail,
      siteName: data.siteName,
    });

    return true;
  } catch (err) {
    logger.error("Lead notification email error", {
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}
