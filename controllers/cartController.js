const Cart = require('../models/Cart');
const Printer = require('../models/Printer');

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


exports.getCartItems = async (req, res) => {
  try {
    // Fetch cart items with populated printer details
    const cartItems = await Cart.find().populate('printerId', 'productTitle rating price HeadImage');
    res.json({ data: cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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