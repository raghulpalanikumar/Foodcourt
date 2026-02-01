const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById
} = require('../controllers/orderController');

// Routes
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/all', protect, getAllOrders); // Removed admin check temporarily if needed, or add admin middleware
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus); // Should be admin only typically

module.exports = router;