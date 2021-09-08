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

const campgrounds = require("./routes/campgrounds");

const reviews = require("./routes/reviews");




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
app.use(express.static(path.join(__dirname, 'public')));





app.use("/campgrounds",campgrounds);

app.use("/campgrounds/:id/reviews", reviews);

app.get("/", function(req,res){

    res.render("home");

})
















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
