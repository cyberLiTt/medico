const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    url: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['carousel', 'gallery'], 
        required: true 
    },
    dateUploaded: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Image', imageSchema);
