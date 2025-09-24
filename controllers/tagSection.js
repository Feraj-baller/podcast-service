const Tag = require("../models/TagModel");

// Admin - Create Tag
const createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({
      success: true,
      data: {
        id: tag._id,
        name: tag.name,
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Public - Get Tags
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().select("name");
    res.json({ success: true, count: tags.length, data: tags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = { createTag, getTags}