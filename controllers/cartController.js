const Cart = require('../models/Cart');
const Printer = require('../models/Printer');
const asyncHandler = require('express-async-handler');

exports.addItemToCart = async (req, res) => {
  try {
    const { printerId, quantity } = req.body;

    // Check if the printer exists
    const printer = await Printer.findById(printerId);
    if (!printer) {
      return res.status(404).json({ message: 'Printer not found' });
    }

    // Check if the item is already in the cart
    let cartItem = await Cart.findOne({ printerId });
    if (cartItem) {
      // Update the quantity if the item is already in the cart
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      // Create a new cart item
      cartItem = new Cart({ printerId, quantity: quantity || 1 });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all cart items with price details
exports.getCartItems = asyncHandler(async (req, res) => {
  // Find all cart items and populate printer details
  const cartItems = await Cart.find().populate('printerId', '_id HeadImage productTitle rating price discountPercentage discountedPrice');

  // Calculate total price and discount
  let totalPrice = 0;
  let totalDiscount = 0;

  // Iterate through each item in the cart
  cartItems.forEach(item => {
    // Calculate price for each item
    const itemPrice = item.quantity * item.printerId.price;
    totalPrice += itemPrice;

    // Calculate discount for each item
    // For demonstration purposes, assuming a fixed discount per item
    const itemDiscount = 0; // Replace with your discount calculation logic if applicable
    totalDiscount += itemDiscount;
  });

  // Calculate total amount
  const totalAmount = totalPrice - totalDiscount;

  // Construct response object
  const response = {
    data: cartItems,
    totalPrice: totalPrice.toFixed(2), // Ensure price is formatted to 2 decimal places
    totalDiscount: totalDiscount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
  };

  res.json(response);
});


exports.getCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the cart item with fully populated printer details
    const cartItem = await Cart.findOne({ printerId: id }).populate('printerId');
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ data: cartItem });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove the cart item by its ID
    const cartItem = await Cart.findByIdAndDelete(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate the quantity input
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    // Find the cart item by ID and update its quantity
    const cartItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ data: cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
