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
    from: `"Hilton Multispecialist Hospital" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_RECEIVER,
    subject: `New Website Inquiry — ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
        <h2 style="color: #3b34aa; margin-bottom: 15px;">New Contact Message</h2>
        <p style="color: #333;">You have received a new inquiry through your hospital website:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Full Name:</td>
            <td style="padding: 8px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Email Address:</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Subject:</td>
            <td style="padding: 8px;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
            <td style="padding: 8px; white-space: pre-line; color: #333;">${message}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          This message was automatically sent from the contact form on 
          <strong>Hilton Multispecialist Hospital & Fertility Centre, Awka</strong>.
        </p>

        <p style="margin-top: 10px; font-size: 12px; color: #999;">
          Please do not reply directly to this email. Use the contact details provided above.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendContactEmail;
