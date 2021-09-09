const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");






//set up a route for rendering register page
router.get("/register",function(req,res){
    //render HTML page NOTE users refers to the folder inside the views
    res.render("users/register")
})

router.post("/register", catchAsync(async function(req,res,next){
    try{
        //destructer req.body 
        const {email,username,password} =req.body
        //make  user model instance
        const user = User({email, username});
        //call register
        //Convenience method to register a new user instance with a given password. Checks if username is unique.
        const registeredUser = await User.register(user,password);
        //log user in
        req.login(registeredUser,err=>{
            if(err)return next(err)
            //dispy success flash message to userof the app(website)
            req.flash("success","welcome to Yelpcamp");
            //redirecting backto camgrounds
            res.redirect("/campgrounds");

        })
        console.log(registeredUser);
        
      
    }
    catch(e){
         //dispy error flash message to userof the app(website)
        req.flash("error",e.message);
        //redirect to regiter(stay on the same page)
        res.redirect("/register")

    }

}));

router.get("/login", function(req,res){
    res.render("users/login")

});

router.post("/login", passport.authenticate("local",{failureFlash: true,failureRedirect:"/login"}), function(req,res){

      //dispy success flash message to userof the app(website)
      req.flash("success","welcome back");

      const redirectUrl = req.session.returnTo || '/campgrounds';
      //redirecting backto camgrounds
    
      delete req.session.returnTo;
      res.redirect(redirectUrl);
      

});


//set up logout route
router.get("/logout", function (req,res){

    req.logout();
    req.flash("success","Goodbye");
    res.redirect("/campgrounds");




})

//going to export the router so it can be used in app.js
module.exports = router;