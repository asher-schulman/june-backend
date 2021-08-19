const { Schema, model } = require("mongoose");


const userSchema = new Schema({
    // google id is used like username
    googleId : {
        type : String,
        required: true 
    },
    username : {
        type : String,
        required: true 
    },
    lastZipCode : {
        type : Number,
        required: false 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

//USER MODEL
const User = model("User", userSchema);

//EXPORT MODEL
module.exports = User;