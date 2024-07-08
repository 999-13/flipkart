const Printer = require('../models/Printer');

// Create a new printer
exports.createPrinter = async (req, res) => {
  try {
    const newPrinter = new Printer({
      productTitle: req.body.productTitle,
      rating: req.body.rating,
      price: req.body.price,
      HeadImage: req.body.HeadImage,
      DescriptiveImages: req.body.DescriptiveImages,
      Brand: req.body.Brand,
      productDetails: req.body.productDetails
    });
    const printer = await newPrinter.save();
    res.json(printer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPrinterById = async (req, res) => {
  try {
    const printer = await Printer.findById(req.params.id);
    if (!printer) {
      return res.status(404).json({ message: 'Printer not found' });
    }
    res.json(printer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Printer.distinct('Brand');
    res.json({ data: brands });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dynamic filter and sort printers
exports.filterPrinters = async (req, res) => {
  try {
    const { minPrice, maxPrice, rating, brand, sortField, sortOrder } = req.body;
    let filter = {};
    console.log(req.body, "agfagdgj");

    // Building the filter object for price
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Building the filter object for brand
    if (brand && Array.isArray(brand)) {
      filter.Brand = { $in: brand.map(b => b.toString()) };
    } else if (brand) {
      filter.Brand = brand.toString();
    }

    // Building the filter object for rating

    if (rating && Array.isArray(rating)) {
      const minRating = Math.min(...rating.map(r => parseFloat(r)));
      filter.rating = { $gte: minRating };
    } else if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }


    // Building the sort object
    let sort = {};
    if (sortField && (sortOrder === 'asc' || sortOrder === 'desc')) {
      const order = sortOrder === 'desc' ? -1 : 1;
      sort[sortField] = order;
    } else {
      // Default sort by createdAt in descending order if no sortField is provided
      sort.createdAt = -1;
    }


    // Query the database with filter and sort options
    const printers = await Printer.find(filter).select('_id HeadImage productTitle rating price discountPercentage discountedPrice').sort(sort);
    res.json({ data: printers });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
