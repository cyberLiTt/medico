const nodemailer = require('nodemailer');
const axios = require('axios');
const Department = require('../models/departmentsModel');

async function sendAppointmentApprovedEmailAndWhatsappNotifications({ appointment, newDate }) {
  const formattedDate = new Date(newDate).toLocaleString();

  // ✅ Find the doctor info from Department
  let doctorEmail = '';
  let doctorPhone = '';

  const dept = await Department.findOne({ name: appointment.department });
  if (dept && dept.doctors?.length) {
    const doctorInfo = dept.doctors.find(d => d.name === appointment.doctor);
    if (doctorInfo) {
      doctorEmail = doctorInfo.email;
      doctorPhone = doctorInfo.phone;
    }
  }

  if (!doctorEmail) doctorEmail = process.env.DEFAULT_DOCTOR_EMAIL;
  if (!doctorPhone) doctorPhone = process.env.DEFAULT_DOCTOR_PHONE;

  const patientEmail = appointment.email;
  const patientPhone = appointment.phone;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPhone = process.env.ADMIN_PHONE;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  /** =============== PATIENT MESSAGE =============== */
  const patientSubject = `💙 Appointment Rescheduled — ${formattedDate}`;
  const patientHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
      <h2 style="color: #3b34aa;">Dear ${appointment.name},</h2>
      <p>We’re reaching out from <strong>Hilton Multispecialist Hospital and Fertility Centre, Awka</strong> to let you know that your appointment has been <strong>rescheduled successfully</strong>.</p>

      <p style="margin-top: 10px;"><strong>New Appointment Details:</strong></p>
      <ul>
        <li>📅 <b>Date & Time:</b> ${formattedDate}</li>
        <li>🏥 <b>Department:</b> ${appointment.department}</li>
        <li>👨‍⚕️ <b>Doctor:</b> ${appointment.doctor}</li>
      </ul>

      <p>If this schedule works for you, no action is required.  
      If you need to make any changes, kindly reply to this email or contact our help desk.</p>

      <p style="margin-top:20px;">We look forward to seeing you soon.</p>
      <p style="color:#007bff;"><strong>Hilton Multispecialist Hospital and Fertility Centre</strong><br>Awka, Anambra State</p>
      <hr style="border:none;border-top:1px solid #ccc;margin:20px 0;">
      <p style="font-size:13px;color:#888;">This is an automated message. Please do not reply directly.</p>
    </div>
  `;

  const patientWhatsApp = `✅ *Your appointment has been rescheduled!*\n\n` +
    `📅 *New Date:* ${formattedDate}\n` +
    `🏥 *Department:* ${appointment.department}\n` +
    `👨‍⚕️ *Doctor:* ${appointment.doctor}\n\n` +
    `We look forward to seeing you!`;









  /** =============== DOCTOR MESSAGE =============== */
  const doctorSubject = `📅 Updated Appointment — ${appointment.name}`;
  const doctorHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color:#333;">
      <h2 style="color: #3b34aa;">Appointment Rescheduled</h2>
      <p>The following appointment has been rescheduled:</p>
      <ul>
        <li>👤 <b>Patient:</b> ${appointment.name}</li>
        <li>📞 <b>Contact:</b> ${appointment.phone}</li>
        <li>📧 <b>Email:</b> ${appointment.email}</li>
        <li>📅 <b>New Date:</b> ${formattedDate}</li>
        ${appointment.message ? `<li>📝 <b>Message:</b> ${appointment.message}</li>` : ''}
      </ul>

      <p>Please prepare accordingly and confirm with your department if any conflicts arise.</p>
      <p style="margin-top:20px;color:#007bff;">Hilton Multispecialist Hospital and Fertility Centre, Awka</p>
    </div>
  `;



  const doctorWhatsApp = `📢 *Appointment Rescheduled*\n\n` +
    `👤 Patient: ${appointment.name}\n` +
    `📅 New Date: ${formattedDate}\n` +
    `📝 Message: ${appointment.message || 'N/A'}\n\n` +
    `Kindly take note.`;











  /** =============== ADMIN MESSAGE =============== */
  const adminSubject = `ℹ️ Appointment Rescheduled — ${appointment.name}`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color:#333;">
      <h2 style="color: #3b34aa;">Rescheduled Appointment Notification</h2>
      <p>The following appointment update was made:</p>
      <ul>
        <li>👤 <b>Patient:</b> ${appointment.name} (${appointment.phone})</li>
        <li>🏥 <b>Department:</b> ${appointment.department}</li>
        <li>👨‍⚕️ <b>Doctor:</b> ${appointment.doctor}</li>
        <li>📅 <b>New Date:</b> ${formattedDate}</li>
        ${appointment.message ? `<li>📝 <b>Message:</b> ${appointment.message}</li>` : ''}
      </ul>
      <p>This update has been communicated to both the patient and the assigned doctor.</p>
      <p style="margin-top:20px;color:#007bff;">Hilton Multispecialist Hospital Admin Panel</p>
    </div>
  `;


  const adminWhatsApp = `ℹ️ *Appointment Rescheduled*\n\n` +
    `👤 Patient: ${appointment.name}\n` +
    `👨‍⚕️ Doctor: ${appointment.doctor}\n` +
    `🏥 Department: ${appointment.department}\n` +
    `📅 New Date: ${formattedDate}\n\n` +
    `This update was sent to both the doctor & patient.`;

  // ✅ Send Email Helper
  async function sendEmail(to, subject, html) {
    await transporter.sendMail({
      from: `"Hospital Appointments" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}`);
  }

  // ✅ Send WhatsApp Helper
  async function sendWhatsApp(phone, message) {
    if (!phone) return console.log('⚠️ No phone number provided');
    try {
      await axios.post(
        process.env.WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: phone.replace(/\D/g, ''), // only digits
          text: { body: message }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`✅ WhatsApp message sent to ${phone}`);
    } catch (err) {
      console.error(`❌ WhatsApp failed for ${phone}`, err.response?.data || err.message);
    }
  }

  // ✅ Send tailored notifications
  await sendEmail(patientEmail, patientSubject, patientHtml);
  await sendEmail(doctorEmail, doctorSubject, doctorHtml);
  await sendEmail(adminEmail, adminSubject, adminHtml);

  // await sendWhatsApp(patientPhone, patientWhatsApp);
  // await sendWhatsApp(doctorPhone, doctorWhatsApp);
  // await sendWhatsApp(adminPhone, adminWhatsApp);
}

module.exports = sendAppointmentApprovedEmailAndWhatsappNotifications;
