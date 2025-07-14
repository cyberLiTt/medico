const express = require('express');
const { submitContactForm } = require('../controllers/contactController');

const router = express.Router();

router.post('/sendEmailAndSave', submitContactForm);

module.exports = router;
