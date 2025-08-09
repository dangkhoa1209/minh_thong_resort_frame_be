const { sendContactMail } = require('../services/mailService');

async function sendMailController(req, res) {
  try {
    const result = await sendContactMail(req.body);
    if (result.success) {
      res.json({ message: 'Email đã gửi thành công!' });
    } else {
      res.status(500).json({ message: 'Gửi email thất bại', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { sendMailController };
