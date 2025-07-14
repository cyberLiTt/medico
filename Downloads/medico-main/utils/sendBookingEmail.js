const nodemailer = require('nodemailer');

const sendEmail = async ({
  name,
  email,
  phone,
  department,
  doctor,
  subject,
  message,
  dateAndTimeBooked
}) => {
  // Create your transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,     // your Gmail
      pass: process.env.MAIL_PASSWORD  // App Password
    }
  });

  const formattedDate = new Date(dateAndTimeBooked).toLocaleString();

  const mailOptions = {
    from: `"Hospital Appointments" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_RECEIVER,
    subject: `New Appointment Booking: ${subject}`,
    
    text: `
      New appointment booking request

      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'N/A'}
      Department: ${department || 'N/A'}
      Doctor: ${doctor || 'N/A'}
      Subject: ${subject}
      Message: ${message}
      Requested Date & Time: ${formattedDate}
    `,

    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #eee;">
        <h2 style="color: #333;">🩺 New Appointment Booking</h2>
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
            <td style="padding: 8px; font-weight: bold;">Phone:</td>
            <td style="padding: 8px;">${phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Department:</td>
            <td style="padding: 8px;">${department || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Doctor:</td>
            <td style="padding: 8px;">${doctor || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Subject:</td>
            <td style="padding: 8px;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 8px; white-space: pre-line;">${message}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Requested Date & Time:</td>
            <td style="padding: 8px;">${formattedDate}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 13px; color: #666;">This appointment was submitted through the hospital booking form.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
