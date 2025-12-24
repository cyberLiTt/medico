const Contact = require('../models/contactModel');
const sendContactEmail = require('../utils/sendContactEmail');

const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    await sendContactEmail({ name, email, subject, message });

    const contact = await Contact.create({ name, email, subject, message });

    res.status(200).json({ message: 'Your message has been sent.', contact });
  } catch (error) {
    console.error('❌ Contact error:', error.message);
    res.status(500).json({ message: 'Failed to send message.' });
  }
};

module.exports = { submitContactForm };
