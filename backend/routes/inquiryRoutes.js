const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(createInquiry)
  .get(protect, getInquiries);

router.route('/:id')
  .get(protect, getInquiryById)
  .put(protect, updateInquiryStatus)
  .delete(protect, deleteInquiry);

module.exports = router;
