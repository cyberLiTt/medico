const express = require('express');
const router = express.Router();
const { createBooking, rescheduleAppointment, acceptAppointment, markAsAttendedOrCanceled, getAllAppointments, getAppointmentsByStatus } = require('../controllers/bookingController');

// Form submits booking
router.post('/book', createBooking);

// Reschedule appointments
router.post('/update-date/:id', rescheduleAppointment);

// Accept appointments
router.post('/accept/:id', acceptAppointment);

// Admin marks booking as attended
router.post('/:attendedOrCanceled/:id', markAsAttendedOrCanceled);

// Render appointment.ejs with all bookings
router.get('/allAppointments', getAllAppointments);

// Optional filtered views
router.get('/status/:status', getAppointmentsByStatus);

module.exports = router;

