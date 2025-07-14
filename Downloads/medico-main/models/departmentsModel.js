const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
    },
    phone: {
        type: String,
        required: true
    }
});

const departmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true
    },
    description:  {
        type: String, 
    },
    doctors: [doctorSchema],
});

module.exports = mongoose.model('Department', departmentSchema);