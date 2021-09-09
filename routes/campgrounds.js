const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");
const{isLoggedIn} = require("../middlewear")
const{campgroundSchema} = require("../schemas.js");
const campground = require("../models/campground");

//NOTE "coampgrounds on the res.render refers to the FOLDER inside views"



function validateCampground(req,res,next){

   
    //validate the camground
    const result = campgroundSchema.validate(req.body);
    //if there is an error
    if(result.error){
        //create error message by maping over details array 
        const msg= result.error.details.map(el=>el.message).join(", ")
        //throw new express error
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }


}



// setting up a  express get route for index
router.get("/", catchAsync (async function(req,res){

    
    // finding all the campgrounds from database
    const campgrounds =await Campground.find({});
   
    //calling render to display the html page
    res.render("campgrounds/index.ejs",{campgrounds});



}))

// setting up express get route for a form for adding new camground
router.get("/new", isLoggedIn, function(req,res){

    //calling render to display the html page
    res.render("campgrounds/new");   

})

//setting up post route for submiiting a  the form for new campground
//this route will be ran when the form is submitted and handle updating the database

router.post('/',isLoggedIn,validateCampground, catchAsync( async function(req, res,next)  {

    //if(!req.body.campground) throw new ExpressError("Invalid campground data",400)
    //creating and saving campground
     const campground = new Campground(req.body.campground);
    await campground.save();
       //setting up flash message
    req.flash("success","successfully made a new campground!")
    //redirecting to the new camground page
    res.redirect(`/campgrounds/${campground._id}`)
    
    
        
    
}))


// setting up a  express get route for show route
router.get("/:id", catchAsync( async function(req,res){
    //look up camground useing id
    const myid= req.params.id;
    const campground = await Campground.findById(myid).populate('reviews');
    
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    
    //calling render to display the html page
    res.render("campgrounds/show",{campground});



}))


// setting up a  express get route for edit route
router.get('/:id/edit',isLoggedIn,catchAsync( async  function(req, res)  {
      //look up camground useing id
    const campground = await Campground.findById(req.params.id)

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
     //calling render to display the html page
    res.render('campgrounds/edit', { campground });
}))


// setting up a  express put route for edit route
//this route will actually updat the database based on the form form the edit route
router.put("/:id",isLoggedIn, validateCampground, catchAsync( async function(req,res){
    //get id from the address pased in
   const myid = req.params.id;
   //find the id and update the campground
   const campground = await Campground.findByIdAndUpdate(myid, { ...req.body.campground });

   //setting up flash message
   req.flash("success","successfully updated campground!")

   //calling redirect  back to the camground show page
   res.redirect(`/campgrounds/${campground._id}`)


}))


// setting up a  express get route for delete route
router.delete("/:id",isLoggedIn, catchAsync(async function (req, res){
    //get id from the address pased in
    const myid = req.params.id;
    // find id and delete ot from db
    await Campground.findByIdAndDelete(myid);

    //create a flash meassage
    req.flash("success","You successfully deleted a campground")
     //calling redirect to load the campground list
    res.redirect("/campgrounds");
}));




//going to export the router so it can be used in app.js
module.exports = router;