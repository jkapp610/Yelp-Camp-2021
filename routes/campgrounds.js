const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds")


const Campground = require("../models/campground");
const{isLoggedIn,isAuthor,validateCampground} = require("../middlewear")


//NOTE "coampgrounds on the res.render refers to the FOLDER inside views"

router.route("/")
    // setting up a  express get route for index
    .get( catchAsync (campgrounds.index))
     //setting up post route for submiiting a  the form for new campground
    //this route will be ran when the form is submitted and handle updating the database
    .post(isLoggedIn,validateCampground, catchAsync(campgrounds.createCampground))


// setting up express get route for a form for adding new camground
router.get("/new", isLoggedIn, campgrounds.rederNewForm)

router.route("/:id")
    // setting up a  express get route for show route
    .get(catchAsync(campgrounds.showCampground ))
    // setting up a  express put route for edit route
    //this route will actually updat the database based on the form form the edit route
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync( campgrounds.updateCampground))
    // setting up a  express get route for delete route
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


// setting up a  express get route for edit route
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//going to export the router so it can be used in app.js
module.exports = router;