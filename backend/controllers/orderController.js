const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require("../utils/emailService");

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryType, deliveryDetails, paymentMethod } = req.body;

    // Validate products and calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.foodId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Dish not found: ${item.foodId}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity for ${product.name} exceeds availability.`
        });
      }

      orderItems.push({
        foodId: product._id,
        foodName: product.name,
        price: product.price,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;

      // Update dish inventory/availability if stock management is enabled
      // For food courts, stock might represent daily portions
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: totalAmount,
      deliveryType: deliveryType || 'FoodCourt',
      deliveryDetails: deliveryDetails || {},
      orderStatus: 'Preparing',
      paymentMethod: paymentMethod || 'CASH',
      paymentStatus: paymentMethod === 'ONLINE' ? 'Paid' : 'Pending'
    });

    await newOrder.save();

    // Populate user data for email
    const user = await User.findById(req.user._id);

    // Send order confirmation email with Token Number
    try {
      await sendOrderConfirmationEmail(
        user.email,
        user.name,
        {
          orderId: newOrder._id.toString().slice(-8),
          tokenNumber: newOrder.tokenNumber,
          orderDate: newOrder.createdAt,
          total: totalAmount,
          items: orderItems,
          deliveryType: newOrder.deliveryType
        }
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: `Order placed successfully! Your Token Number is ${newOrder.tokenNumber}`,
      data: {
        order: newOrder,
        token: newOrder.tokenNumber
      }
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get orders of logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.foodId", "name price image category isVeg")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    // Send status update email
    const user = await User.findById(order.user);
    if (user) {
      try {
        await sendOrderStatusUpdateEmail(user.email, user.name, order.tokenNumber, orderStatus);
      } catch (err) {
        console.error('Failed to send status update email');
      }
    }

    res.json({ success: true, message: `Order marked as ${orderStatus}`, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.foodId', 'name price image category isVeg');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Optional: Check ownership (if not admin)
    // if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) { ... }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
