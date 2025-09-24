const { Category, Episode, EpisodeComment } = require("../models/EpisodeModel")


const createCategory = async (req,res) => {
    const { name, description } = req.body
    try{
        const category = {
            name : name,
            description : description
        }
        const createdCategory = await Category.create(category)

        return res.status(200).json({
            success : true,
            message : "Newly created category",
            category: createdCategory
        })

        
    }catch(err){
        res.status(500).json({
            message : err
        })
    }
}


const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.json({ 
        success: true, 
        count: categories.length, 
        data: categories
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

const createEpisode = async (req,res) => {
    const { title, description, tags, audioUrl, externalLinks, categoryId  } = req.body

    
    try{
        const episode = {
            title : title,
            description : description,
            categoryId : categoryId,
            tags: tags,
            audioUrl : audioUrl,
            externalLinks : externalLinks
        }

        

        const createdEpisode = await Episode.create(episode)
        return res.status(200).json({
            success : true,
            message : "Newly created episode",
            episode: createdEpisode
        })

    }catch(err){
        res.status(500).json({
            message : err
        })
    }
}

const updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update episode
    const episode = await Episode.findByIdAndUpdate(id, updates, { 
      new: true,         
      runValidators: true 
    });

    if (!episode) {
      return res.status(404).json({
        success: false,
        message: "Episode not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Episode successfully updated",
      episode
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};


const deleteEpisode = async (req,res) => {
    const { id } = req.params
    const episode = await Episode.findOneAndDelete({_id : id})
    try {
        if (!episode){
            return res.status(404).json({
                message: "Episode not found"
            })}

        return res.status(200).json({
            success : true,
            message : "Episode successfully deleted!",
            episode: episode
        })
    }catch(err){
        res.status(500).json({
            message: "Server error", 
            error : err.message
        })
    }
}


// SPECIFIC TO USERS
// GET /api/v1/episodes

const getEpisodes = async (req, res) => {
  try {
    const { categoryId, name } = req.query;
    let filter = {};

    // filter by categoryId if provided
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // filter by categoryName if provided
    if (name) {
      const category = await Category.findOne({ name: name });

      if (categoryId & categoryId != category.id){
        return res.status(404).json("Mismatched queries")
      }
      if (category) {
        filter.categoryId = category._id;
      } else {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
    }

    const episodes = await Episode.find(filter)
      .populate("categoryId", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: episodes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getEpisodeById = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id)
      .populate("categoryId", "name description");

    if (!episode) {
      return res.status(404).json({ success: false, message: "Episode not found" });
    }

    // fetch comments separately
    const comments = await Comment.find({ episode: episode._id })
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { episode, comments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const addEpisodeComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ success: false, message: "Episode not found" });
    }

    const comment = await EpisodeComment.create({
      text,
      user: req.user.id,   
      episode: episode._id
    });

    await comment.populate("user", "fullname email");

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




module.exports = { createCategory, getCategories, createEpisode, updateEpisode, deleteEpisode, getEpisodes, getEpisodeById, addEpisodeComment}