const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    category: {
      type: String,
      trim: true,
      default: 'General Inquiry'
    },
    product: {
      type: String,
      trim: true,
      default: 'All Products'
    },
    branch: {
      type: String,
      trim: true,
      default: 'Kochi (Head Office)'
    },
    message: {
      type: String,
      required: [true, 'Inquiry details / message required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'quote_sent', 'closed'],
      default: 'pending'
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
