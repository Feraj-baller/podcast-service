const mongoose = require("mongoose");
const User = require("./UserModel")

// CATEGORY 
const CategorySchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    unique: true
  },
  description: String
});

// EPISODE 
const EpisodeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    audioUrl: {
      type: String,
      required: true,
    },
    externalLinks: {
      type: Map,
      of: String, // allows dynamic key/value pairs
    },
    published: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// COMMENT 
const CommentSchema = new mongoose.Schema(
  {
    text: { 
      type: String, 
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    episode: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Episode", 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }
);

const Category = mongoose.model("Category", CategorySchema);
const Episode = mongoose.model("Episode", EpisodeSchema);
const EpisodeComment = mongoose.model("Episode-Comment", CommentSchema);

module.exports = { Category, Episode, EpisodeComment };
