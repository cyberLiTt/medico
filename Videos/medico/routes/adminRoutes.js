const express = require('express');
const { loginAdmin, updatePassword } = require('../controllers/adminControllers');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/update-password', updatePassword);

module.exports = router;
