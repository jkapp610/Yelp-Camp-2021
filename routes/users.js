const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");





//set up a route for rendering register page
router.get("/register",function(req,res){
    //render HTML page NOTE users refers to the folder inside the views
    res.render("users/register")
})

router.post("/register", catchAsync(async function(req,res){
    try{
        //destructer req.body 
        const {email,username,password} =req.body
        //make  user model instance
        const user = User({email, username});
        //call register
        //Convenience method to register a new user instance with a given password. Checks if username is unique.
        const registeredUser = await User.register(user,password);
        console.log(registeredUser);
        req.flash("success","welcome to Yelpcamp");
        res.redirect("/campgrounds");
      
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/register")

    }

}))


//going to export the router so it can be used in app.js
module.exports = router;