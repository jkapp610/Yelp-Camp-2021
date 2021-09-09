const express = require("express");
const router = express.Router();
const User = require("../models/user");



//set up a route for rendering register page
router.get("/register",function(req,res){
    //render HTML page NOTE users refers to the folder inside the views
    res.render("users/register")
})

router.post("/register", async function(req,res){

    res.send(req.body);

})


//going to export the router so it can be used in app.js
module.exports = router;