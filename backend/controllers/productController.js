const Product = require('../models/Product');

// @desc    Get all products (with optional filtering by category or brand)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, brand, search } = req.query;
    let query = {};

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ title: 1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product details by ID or Slug
// @route   GET /api/products/:identifier
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    const product = isObjectId
      ? await Product.findById(identifier)
      : await Product.findOne({ slug: identifier.toLowerCase() });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { title, category, brand, tagline, specifications, description, imageUrl, stockStatus } = req.body;

    if (!title || !category || !brand) {
      return res.status(400).json({ success: false, error: 'Title, category, and brand are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await Product.create({
      title,
      slug,
      category,
      brand,
      tagline: tagline || '',
      specifications: specifications || [],
      description: description || '',
      imageUrl: imageUrl || '',
      stockStatus: stockStatus || 'Wholesale Bulk Available'
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
