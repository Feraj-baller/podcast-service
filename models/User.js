const mongoose = require("mongoose")

//Creating model called User with UserSchema as model schema
const UserSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: [true, "must provide email"],
        maxlength: 200
    },
    email:{
        type: String,
        required: [true, "must provide email"],
        trim: true,
        maxlength: [65, "must not be more than 65 characters "]
    },
    password:{
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    }
})

module.exports = mongoose.model("User", UserSchema)