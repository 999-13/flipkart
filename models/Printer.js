const mongoose = require('mongoose');

const PrinterSchema = new mongoose.Schema({
  productTitle: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  HeadImage: {
    type: String,
    required: true
  },
  DescriptiveImages: {
    type: [String],
    required: true,
    default: []
  },
  Brand: {
    type: String,
    required: true
  },
  productDetails: {
    type: [String],
    required: true,
    default: []
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  discountedPrice: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Printer', PrinterSchema);
