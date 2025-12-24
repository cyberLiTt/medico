const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    dateAndTimeBooked: { 
        type: Date, 
        required: true 
    }, // user's chosen appointment time
    department: { 
        type: String, 
    },
    doctor: { 
        type: String, 
    },
    message: { 
        type: String, 
        required: true 
    },
    dateBooked: { 
        type: Date, 
        default: Date.now 
    },
    acceptedOrNot: { 
        type: String, 
        enum: ['notaccepted', 'accepted'], 
        default: 'notaccepted'
    },
    status: {
        type: String, 
        enum: ['pending', 'attended', 'canceled'], 
        default: 'pending'
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
