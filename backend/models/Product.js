const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true
    },
    tagline: {
      type: String,
      default: ''
    },
    specifications: [
      {
        key: String,
        value: String
      }
    ],
    description: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Wholesale Bulk Available', 'Import On Demand'],
      default: 'Wholesale Bulk Available'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
