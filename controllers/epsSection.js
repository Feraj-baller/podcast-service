const { Category, Episode } = require("../models/EpisodeModel")


const createCategory = async (req,res) => {
    const { name, description } = req.body

    const categoryExists = Category.findOne(name)

    if (categoryExists){
        return res.status(200).json({
            message: "This category exists!"
        })
    }
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

const updateEpisode = async (req,res) => {
    const { id } = req.params
    const { title, description, tags, audioUrl, externalLinks  } = req.body


    try{
        const episode = await Episode.findById(id)
        if (!title || !description || !tags || !audioUrl || !externalLinks){
            // no operation is needed
        }
        episode.title = title
        episode.description = description
        episode.tags = tags
        episode.audioUrl = audioUrl
        episode.externalLinks = externalLinks

        return res.status(200).json({
            success : True,
            message : "Successfully updated",
            Ep: episode
        })

    }catch(err){
        res.status(500).json({
            message : err
        })
    }
    
}

const deleteEpisode = async (req,res) => {
    const { id } = req.params
    const episode = Episode.findOneAndDelete(id)
    try {
        if (!episode){
            return res.status(403).json({
                message: "Invalid token/id"
            })}

        return res.status(200).json({
            status : True,
            message : "Episode successfully deleted!",
            episode: episode
        })
    }catch(err){
        res.status(500).json({
            message: "Server error", 
            error : error.message
        })
    }
}



module.exports = { createCategory, createEpisode, updateEpisode, deleteEpisode}