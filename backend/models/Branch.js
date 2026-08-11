const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    badge: {
      type: String,
      trim: true
    },
    badgeClass: {
      type: String,
      default: 'hq'
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ''
    },
    embedUrl: {
      type: String,
      required: true
    },
    directUrl: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Branch', branchSchema);
