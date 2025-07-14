const nodemailer = require('nodemailer');

const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Contact Form" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_RECEIVER,
    subject: `Contact Inquiry: ${subject}`,
    text: `
      New contact message received:

      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `,
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #eee;">
            <h2 style="color: #333;">📩 New Contact Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Name:</td>
                    <td style="padding: 8px;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Email:</td>
                    <td style="padding: 8px;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold;">Subject:</td>
                    <td style="padding: 8px;">${subject}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
                    <td style="padding: 8px; white-space: pre-line;">${message}</td>
                </tr>
            </table>
            <p style="margin-top: 20px; font-size: 13px; color: #666;">Sent from the contact form on your website.</p>
        </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendContactEmail;
