const Charity = require('../models/Charity');

// @desc    Get all active charities (public)
// @route   GET /api/charities
const getCharities = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const charities = await Charity.find(filter).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, charities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured charities
// @route   GET /api/charities/featured
const getFeaturedCharities = async (req, res) => {
  try {
    const charities = await Charity.find({ isFeatured: true, isActive: true });
    res.json({ success: true, charities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single charity
// @route   GET /api/charities/:id
const getCharityById = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }
    res.json({ success: true, charity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create charity (admin only)
// @route   POST /api/charities
const createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json({ success: true, charity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update charity (admin only)
// @route   PUT /api/charities/:id
const updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }
    res.json({ success: true, charity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete charity (admin only)
// @route   DELETE /api/charities/:id
const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }
    res.json({ success: true, message: 'Charity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCharities,
  getFeaturedCharities,
  getCharityById,
  createCharity,
  updateCharity,
  deleteCharity,
};