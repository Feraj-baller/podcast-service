const mongoose = require("mongoose")
//const {nanoid} = require("nanoid")



const CategorySchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    unique: true
    },
  description: String
});



// Each episode has a category via categoryID
const EpisodeSchema = new mongoose.Schema(
  {
    /* id: {
        type: string,
        default : () => nanoid(8) // rather than using the conventional objectID of mongodb
    },*/
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
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);
const Episode = mongoose.model("Episode", EpisodeSchema);
module.exports = { Category, Episode };
