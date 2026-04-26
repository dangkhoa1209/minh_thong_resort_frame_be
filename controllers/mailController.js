const { sendContactMail } = require('../services/mailService');
const {
  createContactSubmission,
  markContactSubmissionMailResult,
} = require('../src/modules/contacts/contact-submission.service');
const { getSettingValue } = require("../src/modules/settings/setting.service");

function getBaseUrl(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const protocol = forwardedProto || req.protocol || "http";
  const host = req.get("host");
  if (!host) return "";
  return `${protocol}://${host}`;
}

function toAbsoluteUrl(path, baseUrl) {
  const raw = String(path || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw) || /^blob:/i.test(raw)) {
    return raw;
  }
  if (!baseUrl) return raw;
  return raw.startsWith("/") ? `${baseUrl}${raw}` : `${baseUrl}/${raw}`;
}

async function sendMailController(req, res) {
  try {
    const { name = '', email = '', description = '', source = 'unknown' } = req.body || {};

    if (!email || !String(email).includes('@')) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email khong hop le' },
      });
    }

    const contactInfo = await getSettingValue("contact_info", {});
    const logoInfo = await getSettingValue("logo_active", {});
    const adminEmail = String(contactInfo?.email || process.env.ADMIN_EMAIL || "").trim();
    const companyName = String(contactInfo?.company_name || "Abel Dang Production").trim();
    const baseUrl = getBaseUrl(req);
    const logoUrl = toAbsoluteUrl(logoInfo?.logo_light_url, baseUrl);
    const submission = await createContactSubmission({ name, email, description, source });
    const result =
      process.env.MAIL_USER && process.env.MAIL_PASS && adminEmail
        ? await sendContactMail({
            name,
            email,
            description,
            adminEmail,
            logoUrl,
            companyName,
            source,
            submittedAt: submission?.created_at,
          })
        : { success: false, error: 'MAIL_NOT_CONFIGURED' };

    await markContactSubmissionMailResult(submission._id, result);

    return res.json({
      success: true,
      data: { id: submission._id.toString(), mail_sent: Boolean(result.success) },
      message: result.success ? 'Email da gui thanh cong' : 'Yeu cau da duoc luu, email gui thong bao bi loi',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message || 'Loi server' },
    });
  }
}

module.exports = { sendMailController };
