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
    },
    profilePic: { 
        type: String
    },
    role: { 
        type: String, 
        required: true,   // If role must be mandatory
        default: "No role added"
    },
    description: { 
        type: String,    // Doctor’s short bio / summary
        default: "No description yet"
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
    imageUrl: {
        type: String,
    },
    doctors: [doctorSchema],
});

module.exports = mongoose.model('Department', departmentSchema);
