const sendMail = require('../plugins/sendMail');

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toMultilineHtml(value) {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function formatSubmittedAt(value) {
  try {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(date);
  } catch (_error) {
    return "";
  }
}

async function sendContactMail(data) {
  const {
    name,
    email,
    description,
    adminEmail,
    companyName = "Abel Dang Production",
    source = "unknown",
    submittedAt = new Date().toISOString(),
  } = data;

  const safeName = String(name || "").trim() || "N/A";
  const safeEmail = String(email || "").trim() || "N/A";
  const safeDescription = String(description || "").trim() || "N/A";
  const safeCompanyName = String(companyName || "").trim() || "Abel Dang Production";
  const safeSource = String(source || "unknown").trim();
  const submittedLabel = formatSubmittedAt(submittedAt);

  const subject = `[Contact] ${safeCompanyName} - ${safeName}`;
  const text = `
New contact request from website

Company: ${safeCompanyName}
Submitted at: ${submittedLabel || "N/A"}
Source: ${safeSource || "unknown"}

Name: ${safeName}
Email: ${safeEmail}
Message: ${safeDescription}
  `;
  const html = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f2f4f8;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="width:640px;max-width:94%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e8e8e8;">
            <tr>
              <td style="background:#0f1012;padding:20px 24px;text-align:left;">
                <p style="margin:0;font:700 14px/1.4 Arial,sans-serif;letter-spacing:.08em;color:#d5d7dc;text-transform:uppercase;">
                  New Contact Request
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 10px;">
                <p style="margin:0 0 10px;font:700 18px/1.4 Arial,sans-serif;color:#15181f;">${escapeHtml(safeCompanyName)}</p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eceff5;font:600 13px/1.5 Arial,sans-serif;color:#5b6373;width:130px;">Submitted at</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eceff5;font:400 14px/1.6 Arial,sans-serif;color:#141821;">${escapeHtml(submittedLabel || "N/A")}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eceff5;font:600 13px/1.5 Arial,sans-serif;color:#5b6373;">Source</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eceff5;font:400 14px/1.6 Arial,sans-serif;color:#141821;">${escapeHtml(safeSource || "unknown")}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eceff5;font:600 13px/1.5 Arial,sans-serif;color:#5b6373;">Name</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eceff5;font:400 14px/1.6 Arial,sans-serif;color:#141821;">${escapeHtml(safeName)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eceff5;font:600 13px/1.5 Arial,sans-serif;color:#5b6373;">Email</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eceff5;font:400 14px/1.6 Arial,sans-serif;color:#141821;">
                      <a href="mailto:${escapeHtml(safeEmail)}" style="color:#0a5bd3;text-decoration:none;">${escapeHtml(safeEmail)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 24px 20px;">
                <p style="margin:0 0 8px;font:600 13px/1.5 Arial,sans-serif;color:#5b6373;">Message</p>
                <div style="font:400 14px/1.7 Arial,sans-serif;color:#141821;background:#f7f8fb;border:1px solid #eceff5;border-radius:10px;padding:12px 14px;white-space:normal;">
                  ${toMultilineHtml(safeDescription)}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px 22px;border-top:1px solid #eceff5;">
                <p style="margin:0;font:400 12px/1.6 Arial,sans-serif;color:#7a8190;">This email was sent automatically from the website contact form.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return await sendMail({
    to: adminEmail,
    subject,
    text,
    html,
  });
}

module.exports = { sendContactMail };
