const Reservation = require('../models/Reservation');

// Shared Data via Database (MongoDB acts as the centralized repository)
// This ensures "All users see the same reservation data" and "consistency across sessions".

// Table Configuration
const TABLES = [
    { id: 1, capacity: 2 }, { id: 2, capacity: 2 }, { id: 3, capacity: 2 },
    { id: 4, capacity: 4 }, { id: 5, capacity: 4 }, { id: 6, capacity: 4 },
    { id: 7, capacity: 6 }, { id: 8, capacity: 6 },
    { id: 9, capacity: 8 }, { id: 10, capacity: 10 }
];

const generateReservationId = () => {
    return 'RES-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
};

// Create Reservation
exports.createReservation = async (req, res) => {
    try {
        const { name, contact, peopleCount, date, timeSlot } = req.body;

        if (!name || !contact || !peopleCount || !date || !timeSlot) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Double Booking Prevention: Check database for any "Active" reservation on matched table
        // 1. Get all booked tables for this slot
        const existingReservations = await Reservation.find({
            date,
            timeSlot,
            status: 'Active'
        });
        const reservedTableIds = existingReservations.map(r => r.tableNumber);

        // 2. Filter eligible tables (Capacity >= Request)
        const eligibleTables = TABLES
            .filter(t => t.capacity >= peopleCount)
            .sort((a, b) => a.capacity - b.capacity); // Smart Assign: Smallest fit first

        if (eligibleTables.length === 0) {
            return res.status(400).json({ success: false, message: 'No table exists for this group size.' });
        }

        // 3. Find first free table
        const freeTable = eligibleTables.find(t => !reservedTableIds.includes(t.id));

        if (!freeTable) {
            return res.status(400).json({ success: false, message: 'All tables are fully booked for this slot.' });
        }

        // 4. Create and Save (Global Persistence)
        const newReservation = new Reservation({
            user: req.user ? req.user._id : null,
            reservationId: generateReservationId(),
            name,
            contact,
            peopleCount,
            date,
            timeSlot,
            tableNumber: freeTable.id,
            status: 'Active'
        });

        await newReservation.save();

        res.status(201).json({
            success: true,
            message: 'Table reserved successfully!',
            data: newReservation
        });

    } catch (error) {
        console.error('Reservation Error:', error);
        res.status(500).json({ success: false, message: 'Server error processing reservation.' });
    }
};

// Get All Reservations (Shared View)
// Changed from getUserReservations to satisfy "View ALL existing reservations in real time" requirement
exports.getAllReservations = async (req, res) => {
    try {
        // Return all active reservations regardless of user, to act as a public ledger/booking sheet if desired.
        // Or filter by visibility rules. For this specific request "All users see the same data", we return all.
        // We will return only necessary fields for privacy if needed, but here we return full data for transparency as requested.
        const reservations = await Reservation.find({ status: 'Active' })
            .sort({ date: 1, timeSlot: 1 });

        res.json({ success: true, data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search Reservation
exports.searchReservation = async (req, res) => {
    try {
        const { query } = req.query;
        const reservations = await Reservation.find({
            $or: [
                { reservationId: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } }
            ]
        });
        res.json({ success: true, data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel Reservation
exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findOne({ reservationId: id });

        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found.' });
        }

        // Allow users to cancel their own, or anyone to cancel via ID if "Shared System" implies trust/admin mode?
        // Usually we restrict this, but request says "Any user should be able to... Cancel a reservation".
        // We will keep basic security: Only owner or admin, UNLESS it's a guest system.
        // For now, let's allow it if they have the ID (to support the "Search and Cancel" workflow).

        reservation.status = 'Cancelled';
        await reservation.save();

        res.json({ success: true, message: 'Reservation cancelled successfully.', data: reservation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
