const { login, register, authenticateToken, requestPasswordReset, resetPassword, logout,  refreshToken } = require("../controllers/auth")
const {  getSingleUser, updateUser, verifyEmailChange, deleteUser, getAllUsers  } = require("../controllers/userSection")
const { createCategory, getCategories, createEpisode, updateEpisode, deleteEpisode, getEpisodes, getEpisodeById, addEpisodeComment } = require("../controllers/epsSection")
const {  createArticle, updateArticle, deleteArticle, getArticles, getArticleById, addArticleComment } = require("../controllers/articleSection")
const { createTag, getTags } = require("../controllers/tagSection")
const { getArticleComments, getEpisodeComments } = require("../controllers/commentSection")
const { isAdmin } = require("../middleware/isAdmin")
const { authorizeUserOrAdmin } = require("../middleware/authorizeUserOrAdmin")
const express = require("express")
const router = express.Router()





// Endpoints and routes
router.get("/dashboard", authenticateToken, (req,res)=>{
    res.send(`Welcome, ${req.user.name}`)
})


/*POST /api/v1/auth/signup
* POST /api/v1/auth/login
* GET /api/v1/auth/verify-email?token=
* POST /api/v1/auth/forgot-password
* POST /api/v1/auth/reset-password
* POST /api/v1/auth/logout*/

//Auth
router.post("/auth/login", login)
router.post("/auth/register", register)
router.post("/auth/request-password-reset",requestPasswordReset) // sends a mail
router.post("/auth/reset-password", resetPassword) // input 6-digit, then reset (email, code, newpassword)
router.post('/auth/token/refresh', refreshToken)
router.post("/auth/logout", logout)

//User
router.get("/user/:id", authenticateToken, authorizeUserOrAdmin, getSingleUser)
router.get("/admin/users", authenticateToken, isAdmin, getAllUsers)
router.put("/user/:id", authenticateToken, authorizeUserOrAdmin, updateUser);
router.post("/user/:id/verify-email", authenticateToken, authorizeUserOrAdmin, verifyEmailChange)
router.delete("/user/:id", authenticateToken, isAdmin, deleteUser)

//Category and Episodes
router.post("/admin/create-category", authenticateToken, isAdmin, createCategory)
router.get("/categories", authenticateToken, authorizeUserOrAdmin, getCategories)
router.post("/admin/create-episode", authenticateToken, isAdmin, createEpisode)
router.put("/admin/update-episode/:id", authenticateToken, isAdmin, updateEpisode)
router.delete("/admin/delete-episode/:id", authenticateToken, isAdmin, deleteEpisode)
//Specific to users
router.get("/episodes", authenticateToken, authorizeUserOrAdmin, getEpisodes) // query filter searching too        
router.get("/episode/:id", authenticateToken, authorizeUserOrAdmin, getEpisodeById)      
router.post("/episode/:id/comments", authenticateToken, authorizeUserOrAdmin, addEpisodeComment)

//Article
router.post("/api/v1/admin/articles", authenticateToken, isAdmin, createArticle);
router.patch("/api/v1/admin/articles/:id", authenticateToken, isAdmin, updateArticle);
router.delete("/api/v1/admin/articles/:id", authenticateToken, isAdmin, deleteArticle);
//Specific to users
router.get("/articles", authenticateToken, authorizeUserOrAdmin, getArticles)         
router.get("/article/:id", authenticateToken, authorizeUserOrAdmin, getArticleById)      
router.post("/article/:id/comments", authenticateToken, authorizeUserOrAdmin, addArticleComment)


// Tags
router.post("/api/v1/admin/tags", authenticateToken, isAdmin,  createTag); // Admin
router.get("/api/v1/tags", authenticateToken, authorizeUserOrAdmin, getTags); // Public

//Comment
router.get("/articles/:id/comments", authenticateToken, authorizeUserOrAdmin, getArticleComments);
router.get("/episodes/:id/comments",authenticateToken, authorizeUserOrAdmin, getEpisodeComments);


//console.log(createCategory, createEpisode, updateEpisode)


module.exports = router