const Inquiry = require('../models/Inquiry');

// @desc    Submit a new inquiry / quote request
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res, next) => {
  try {
    let { name, phone, email, category, product, branch, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name and phone number.'
      });
    }

    if (!message || !message.trim()) {
      message = `Quote request for ${product || 'Materials'} (${category || 'General Inquiry'})`;
    }

    const inquiry = await Inquiry.create({
      name,
      phone,
      email: email || '',
      category: category || 'General Inquiry',
      product: product || 'All Products',
      branch: branch || 'Kochi (Head Office)',
      message,
      ipAddress: req.ip || req.connection.remoteAddress || ''
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Our sales desk will contact you shortly.',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trade inquiries (Admin)
// @route   GET /api/inquiries
// @access  Private/Admin
const getInquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { product: { $regex: search, $options: 'i' } }
      ];
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inquiry by ID
// @route   GET /api/inquiries/:id
// @access  Private/Admin
const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    if (status) inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    await inquiry.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
};
