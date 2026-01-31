const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    foodName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  orderStatus: {
    type: String,
    enum: ['Preparing', 'Ready', 'OutForDelivery', 'Delivered', 'Cancelled'],
    default: 'Preparing'
  },
  deliveryType: {
    type: String,
    enum: ['FoodCourt', 'Classroom'],
    required: [true, 'Please specify if pickup is at FoodCourt or Classroom delivery'],
    default: 'FoodCourt'
  },
  deliveryDetails: {
    tableNumber: { type: String },
    classroomInfo: { type: String },
    department: { type: String },
    block: { type: String }
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'ONLINE', 'WALLETPAY'],
    default: 'CASH'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  tokenNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate a random token number for the order before saving
orderSchema.pre('save', async function (next) {
  if (!this.tokenNumber) {
    this.tokenNumber = 'KEC-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);