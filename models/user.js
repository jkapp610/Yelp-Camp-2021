const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema;



//set up user schema
const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});


// adds am username and a password to User Schema
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User",UserSchema)