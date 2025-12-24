const Booking = require('../models/bookingModel');
const sendAppointmentApprovedEmailAndWhatsappNotifications = require('../utils/sendAppointmentApprovedEmailAndWhatsappNotifications');
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








// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
  console.log('asjnsakhdbasudbjasdnksah djh')
  const { id } = req.params;
  const { newDate } = req.body;

  try {
    // ✅ Convert both to Date objects
    const selectedDate = new Date(newDate);
    const today = new Date();

    // ✅ Reset today's time to 00:00:00 for clean comparison
    today.setHours(0, 0, 0, 0);

    // ✅ If selected date is before today, reject
    if (selectedDate < today) {
      return res.status(400).json({
        message: 'The selected date has already passed. Please choose a future date.'
      });
    }

    const appointment = await Booking.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // ✅ Update date
    appointment.dateBooked = selectedDate;
    appointment.acceptedOrNot = 'accepted';
    await appointment.save();

    // ✅ Notify doctor, patient, and admin
    await sendAppointmentApprovedEmailAndWhatsappNotifications({
      appointment,
      newDate: selectedDate
    });

    return res.json({ message: 'Appointment date updated and notifications sent.' });

  } catch (err) {
    console.error('Error updating appointment date:', err);
    return res.status(500).json({ message: 'Failed to update appointment date.' });
  }
};






const acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Booking.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Already accepted?
    if (appointment.acceptedOrNot === 'accepted') {
      return res.status(400).json({ message: 'This appointment is already accepted.' });
    }

    // ✅ Mark as accepted
    appointment.acceptedOrNot = 'accepted';
    await appointment.save();

    // ✅ Send notifications (reuse the same function but pass existing date)
    await sendAppointmentApprovedEmailAndWhatsappNotifications({
      appointment,
      newDate: appointment.dateAndTimeBooked // same date, no reschedule
    });

    return res.json({ message: 'Appointment accepted! Notifications sent to doctor, patient & admin.' });

  } catch (err) {
    console.error('Error accepting appointment:', err);
    return res.status(500).json({ message: 'Failed to accept appointment.' });
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const totalCount = await Booking.countDocuments({ status })
    const appointments = await Booking.find({ status })
      .sort({ dateBooked: -1 })
      .skip(skip)
      .limit(limit);


    res.status(200).json({
      message: `${appointments.length} ${status} appointment(s) retrieved successfully.`,
      data: appointments,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
    });
  } catch (error) {
    console.error(`❌ Error fetching ${status} appointments:`, error.message);
    res.status(500).json({
      message: 'Server error while fetching appointments.',
      data: [],
    });
  }
};



module.exports = { createBooking, rescheduleAppointment, acceptAppointment, markAsAttendedOrCanceled, getAllAppointments, getAppointmentsByStatus };
