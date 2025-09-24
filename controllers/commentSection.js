const { ArticleComment } = require("../models/ArticleModel.js");
const { EpisodeComment } = require("../models/EpisodeModel.js");


// Get all comments for an article
const getArticleComments = async (req, res) => {
  try {
    const { id } = req.params; // article ID
    const comments = await ArticleComment.find({ articleId: id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all comments for an episode
const getEpisodeComments = async (req, res) => {
  try {
    const { id } = req.params; // episode ID
    const comments = await EpisodeComment.find({ episodeId: id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getArticleComments, getEpisodeComments}
