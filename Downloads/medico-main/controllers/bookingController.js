const Booking = require('../models/bookingModel');
const sendEmail = require('../utils/sendBookingEmail');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { name, email, phone, department, doctor, subject, message, dateAndTimeBooked } = req.body;

    if (!name || !email || !phone || !message || !dateAndTimeBooked) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    await sendEmail({ name, email, phone, department, doctor, subject, message, dateAndTimeBooked });

    const booking = await Booking.create({
      name,
      email,
      phone,
      department,
      doctor,
      message,
      dateAndTimeBooked,
    });

    res.status(200).json({ message: 'Appointment booked and email sent', booking });
  } catch (error) {
    console.error('❌ Booking error:', error.message);
    res.status(500).json({ message: 'Something went wrong while booking appointment' });
  }
};




// Mark appointment as attended
const markAsAttendedOrCanceled = async (req, res) => {
  try {
    const { id, attendedOrCanceled } = req.params;

    // Only allow 'attended' or 'rejected' to prevent invalid updates
    const validStatuses = ['attended', 'rejected'];
    const statusToUpdate = validStatuses.includes(attendedOrCanceled) ? attendedOrCanceled : null;

    if (!statusToUpdate) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status: statusToUpdate }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: `Booking marked as ${statusToUpdate}`,
      booking
    });
  } catch (error) {
    console.error('❌ Status update error:', error.message);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};





// ✅ Render appointment.ejs with all bookings
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Booking.find().sort({ dateBooked: -1 });
    res.render('appointment', { appointments });
  } catch (error) {
    console.error('❌ Error fetching appointments:', error.message);
    res.status(500).send('Server error');
  }
};




// ✅ Get only pending appointments
const getAppointmentsByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const appointments = await Booking.find({ status }).sort({ dateBooked: -1 });

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        message: `No ${status} appointments found.`,
        data: [],
      });
    }

    res.status(200).json({
      message: `${appointments.length} ${status} appointment(s) retrieved successfully.`,
      data: appointments,
    });
  } catch (error) {
    console.error(`❌ Error fetching ${status} appointments:`, error.message);
    res.status(500).json({
      message: 'Server error while fetching appointments.',
      data: [],
    });
  }
};


module.exports = { createBooking, markAsAttendedOrCanceled, getAllAppointments, getAppointmentsByStatus };
