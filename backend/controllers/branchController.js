const Branch = require('../models/Branch');

// @desc    Get all branch depots
// @route   GET /api/branches
// @access  Public
const getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: branches.length,
      data: branches
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBranches
};
