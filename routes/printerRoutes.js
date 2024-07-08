const express = require('express');
const router = express.Router();
const printerController = require('../controllers/printerController');

// Define specific routes first
router.post('/filter', printerController.filterPrinters); // Ensure this route is defined first
router.get('/brands', printerController.getBrands);

// More general routes should come last
router.post('/', printerController.createPrinter);
router.get('/:id', printerController.getPrinterById);

module.exports = router;
