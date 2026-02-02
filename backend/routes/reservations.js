const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
    createReservation,
    getAllReservations,
    searchReservation,
    cancelReservation
} = require('../controllers/reservationController');

// Routes - Using 'protect' to ensure only authenticated users access the system,
// but the controller logic now returns GLOBAL data as requested.
router.post('/', protect, createReservation);
router.get('/all', protect, getAllReservations); // Changed endpoint to match "View All"
router.get('/search', protect, searchReservation);
router.put('/:id/cancel', protect, cancelReservation);

module.exports = router;
