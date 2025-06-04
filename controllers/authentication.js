//Import modules
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
require("dotenv").config()

const login = async (req, res) => {
  // Email and password info from the body
    const email = req.body.email
    const password = req.body.password
  // requiring email and password
  if (!email || !password) {
    return res.status(404).send("Email and password required")
  }
  try {
    // retriving user from database
    const userExists = await User.findOne({ email })
    if (!userExists) {
      return res.status(401).send("No user exists with the email")
    }
    // user profile
    const userPayload = {
        id : userExists.id,
        name: userExists.fullname,
        email: userExists.email,
    }

    //Password hashing
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).send("Incorrect password");
    }

    //token config
    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    })
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    })

    return res.json({
        message: "User login successful",
        accessToken : accessToken,
        refreshToken : refreshToken,
        user: userPayload,
        password: isMatch
    })
  } catch (error) {
    res.status(500).send("Database error")
  }
}


const register = async (req,res)=>{
  const { fullname, email, password } = req.body
  // getting user by email
  const userExists = await User.findOne({ email })
  try{
    if (!fullname || !email || !password) {
      return res.status(404).send("Name, email and password required")
    }
    
    if (req.body.password.length < 8){
      return res.send("Password must be more than 8 characters")
    }

    if (userExists) {
      return res.send("User already exists, log in")
    }
    // hashed password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    // registered user
    const regUser = {
      fullname: fullname,
      email: email,
      password: hashedPassword
    }
    // saving registered user into the database
    const newUser = await User.create(regUser)
    if (newUser){
      return res.status(200).send("New user created successfully")
    }

  }
    catch (error){ 
        res.status(500).json({
            message : error
        })
    }
}

const refreshToken = (req, res) => {
  // token as a request 
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Refresh token required" })
  }

  try {
    // getting user from token
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)


    const accessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    return res.json({ accessToken })
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" })
  }
};


const authenticateToken = async (req,res,next)=>{
  // accessing authorization header
  authHeader = await req.headers["authorization"]
  const token = await authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
    if (err) return res.sendStatus(403)
    req.user = user

  })
  next()
}
module.exports = {login, register, refreshToken, authenticateToken}


