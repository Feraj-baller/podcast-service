const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ArticleCommentSchema = new mongoose.Schema(
  {
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        required: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const ArticleComment = mongoose.model("Article-Comment", ArticleCommentSchema);
const Article = mongoose.model("Article", ArticleSchema);

module.exports = { Article, ArticleComment }
