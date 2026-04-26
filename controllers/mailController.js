const { sendContactMail } = require('../services/mailService');
const {
  createContactSubmission,
  markContactSubmissionMailResult,
} = require('../src/modules/contacts/contact-submission.service');

async function sendMailController(req, res) {
  try {
    const { name = '', email = '', description = '', source = 'unknown' } = req.body || {};

    if (!email || !String(email).includes('@')) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email khong hop le' },
      });
    }

    const submission = await createContactSubmission({ name, email, description, source });
    const result =
      process.env.MAIL_USER && process.env.MAIL_PASS && process.env.ADMIN_EMAIL
        ? await sendContactMail({ name, email, description })
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
