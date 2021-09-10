const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users")


router.route("/register")
    //set up a route for rendering register page
    .get(users.renderRegister)
   .post(catchAsync(users.registerUser))

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local",{failureFlash: true,failureRedirect:"/login"}), users.login)



//set up logout route
router.get("/logout",users.logout)

//going to export the router so it can be used in app.js
module.exports = router;