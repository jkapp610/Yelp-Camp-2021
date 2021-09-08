const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");

const{campgroundSchema} = require("../schemas.js")

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
router.get("/new",function(req,res){

    //calling render to display the html page
    res.render("campgrounds/new")

})

//setting up post route for submiiting a  the form for new campground
//this route will be ran when the form is submitted and handle updating the database

router.post('/',validateCampground, catchAsync( async function(req, res,next)  {

    //if(!req.body.campground) throw new ExpressError("Invalid campground data",400)

    
   
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    
    
        
    
}))


// setting up a  express get route for show route
router.get("/:id", catchAsync( async function(req,res){
    //look up camground useing id
    const myid= req.params.id;
    const campground = await Campground.findById(myid).populate('reviews');
    
    
    
    
    //calling render to display the html page
    res.render("campgrounds/show",{campground});



}))


// setting up a  express get route for edit route
router.get('/:id/edit',catchAsync( async  function(req, res)  {
      //look up camground useing id
    const campground = await Campground.findById(req.params.id)
     //calling render to display the html page
    res.render('campgrounds/edit', { campground });
}))


// setting up a  express put route for edit route
//this route will actually updat the database based on the form form the edit route
router.put("/:id", validateCampground, catchAsync( async function(req,res){
    //get id from the address pased in
   const myid = req.params.id;
   //find the id and update the campground
   const campground = await Campground.findByIdAndUpdate(myid, { ...req.body.campground });
   //calling redirect  back to the camground
   res.redirect(`/campgrounds/${campground._id}`)


}))


// setting up a  express get route for delete route
router.delete("/:id", async function (req, res){
    //get id from the address pased in
    const myid = req.params.id;
    // find id and delete ot from db
    await Campground.findByIdAndDelete(myid);
     //calling redirect to load the campground list
    res.redirect("/campgrounds");
})

//going to export the router so it can be used in app.js
module.exports = router;