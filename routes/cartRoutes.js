const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route to add an item to the cart
router.post('/add', cartController.addItemToCart);

router.get('/', cartController.getCartItems);

router.get('/:id', cartController.getCartItem);

router.delete('/:id', cartController.removeItemFromCart);

router.put('/:id', cartController.updateCartItemQuantity);

module.exports = router;
