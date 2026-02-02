const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    reservationId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String, // Explicitly store name for global visibility even for guests
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    peopleCount: {
        type: Number,
        required: true,
        min: 1
    },
    date: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Cancelled', 'Completed'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);
