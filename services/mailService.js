const sendMail = require('../plugins/sendMail');

async function sendContactMail(data) {
  const { name, email, description } = data;

  const subject = 'Liên hệ từ website Abel Dang';
  const text = `
    Name: ${name || 'N/A'}
    Email: ${email || 'N/A'}
    Description: ${description || 'N/A'}
  `;
  const html = `
    <p><strong>Name:</strong> ${name || 'N/A'}</p>
    <p><strong>Email:</strong> ${email || 'N/A'}</p>
    <p><strong>Description:</strong> ${description || 'N/A'}</p>
  `;

  return await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
    html,
  });
}

module.exports = { sendContactMail };
