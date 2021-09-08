const express = require("express");

const path = require("path");


const Campground = require("./models/campground");

const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const joi = require("joi");
const{campgroundSchema,reviewSchema} = require("./schemas.js")
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Review = require('./models/review');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
   
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();
app.engine("ejs",ejsMate)
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

function validateReview(req,res,next){
    const result=reviewSchema.validate(req.body);
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


app.get("/", function(req,res){

    res.render("home");

})

// setting up a  express get route for index
app.get("/campgrounds", async function(req,res){
    // finding all the campgrounds from database
    const campgrounds =await Campground.find({});
    //calling render to display the html page
    res.render("campgrounds/index.ejs",{campgrounds});



})

// setting up express get route for a form for adding new camground
app.get("/campgrounds/new",function(req,res){

    //calling render to display the html page
    res.render("campgrounds/new")

})

//setting up post route for submiiting a  the form for new campground
//this route will be ran when the form is submitted and handle updating the database

app.post('/campgrounds',validateCampground, catchAsync( async function(req, res,next)  {

    //if(!req.body.campground) throw new ExpressError("Invalid campground data",400)

    
   
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    
    
        
    
}))


// setting up a  express get route for show route
app.get("/campgrounds/:id", catchAsync( async function(req,res){
    //look up camground useing id
    const myid= req.params.id;
    const campground = await Campground.findById(myid).populate('reviews');
    
    
    
    
    //calling render to display the html page
    res.render("campgrounds/show",{campground});



}))


// setting up a  express get route for edit route
app.get('/campgrounds/:id/edit',catchAsync( async  function(req, res)  {
      //look up camground useing id
    const campground = await Campground.findById(req.params.id)
     //calling render to display the html page
    res.render('campgrounds/edit', { campground });
}))


// setting up a  express put route for edit route
//this route will actually updat the database based on the form form the edit route
app.put("/campgrounds/:id", validateCampground, catchAsync( async function(req,res){
    //get id from the address pased in
   const myid = req.params.id;
   //find the id and update the campground
   const campground = await Campground.findByIdAndUpdate(myid, { ...req.body.campground });
   //calling redirect  back to the camground
   res.redirect(`/campgrounds/${campground._id}`)


}))


// setting up a  express get route for delete route
app.delete("/campgrounds/:id", async function (req, res){
    //get id from the address pased in
    const myid = req.params.id;
    // find id and delete ot from db
    await Campground.findByIdAndDelete(myid);
     //calling redirect to load the campground list
    res.redirect("/campgrounds");
})


//REVIEW ROUTES

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async function (req, res){
    const myid = req.params.id;
    const campground = await Campground.findById(myid);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))


app.delete("/campgrounds/:id/reviews/:reviewId",catchAsync(async function(req,res){
    const reviewId = req.params.reviewId;
    const myid = req.params.id;
    await Campground.findByIdAndUpdate(myid,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${myid}`);
   


}))












//will only run if no other route matched
app.all("*",function(req,res,next){

    next(new ExpressError("page not found",404));
    

    

})

//basic error handler will get called if an error is happends
app.use(function(err,req,res,next){

    //destructure from err and set defult values to 500 and "somthing went wrong if err does not have anything"
    const {statusCode =500,}=err;
    if(!err.message){
        err.message="somthing went worng"
    }

    res.status(statusCode);
    //render error template (by defult it goes to views folder that is why ut us not included in file path)
    res.render("error",{err})
})


app.listen(3000,function() {
    console.log(" APP is listining ON PORT 3000!")
})
