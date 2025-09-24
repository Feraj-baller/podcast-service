const { Article, ArticleComment } = require("../models/ArticleModel")


const createArticle = async (req,res) => {
  try {
    const article = await Article.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        id: article._id,
        title: article.title,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


const updateArticle = async (req,res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!article)
      return res.status(404).json({ success: false, message: "Article not found" });

    res.json({
      success: true,
      data: {
        id: article._id,
        title: article.title,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


const deleteArticle = async (req,res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);

    if (!article)
      return res.status(404).json({ success: false, message: "Article not found" });

    res.json({ success: true, message: "Article deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// User Endpoints
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ published: true }).select("title tags createdAt");

    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article || !article.published) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const addArticleComment = async (req, res) => {
  try {
    const { id } = req.params; // article ID
    const { userId, text } = req.body;

    const comment = await ArticleComment.create({
      articleId: id,
      userId,
      text
    });

    res.status(201).json({
      success: true,
      data: {
        id: comment._id,
        articleId: comment.articleId,
        text: comment.text
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};




module.exports = { createArticle, updateArticle, deleteArticle, getArticles, getArticleById, addArticleComment}