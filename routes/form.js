const { login, register, authenticateToken, refreshToken } = require("../controllers/authentication")
const express = require("express")
const router = express.Router()

// Endpoints and routes
router.get("/dashboard", authenticateToken, (req,res)=>{
    res.send(`Welcome, ${req.user.name}`)
})
router.post("/login", login)
router.post("/register", register)
router.post('/token/refresh', refreshToken)



module.exports = router