const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  printerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Printer',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
