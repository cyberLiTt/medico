const express = require('express');
const router = express.Router();
const { createBooking, markAsAttendedOrCanceled, getAllAppointments, getAppointmentsByStatus } = require('../controllers/bookingController');

// Form submits booking
router.post('/book', createBooking);

// Admin marks booking as attended
router.post('/:attendedOrCanceled/:id', markAsAttendedOrCanceled);

// Render appointment.ejs with all bookings
router.get('/allAppointments', getAllAppointments);

// Optional filtered views
router.get('/status/:status', getAppointmentsByStatus);

module.exports = router;

