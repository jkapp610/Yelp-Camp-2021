const express = require("express");

const path = require("path");


const Campground = require("./models/campground");

const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");

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

app.post('/campgrounds', catchAsync( async function(req, res,next)  {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    
    
        
    
}))


// setting up a  express get route for show route
app.get("/campgrounds/:id", catchAsync( async function(req,res){
    //look up camground useing id
    const myid= req.params.id;
    const campground = await Campground.findById(myid)
    
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
app.put("/campgrounds/:id", catchAsync( async function(req,res){
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

//basic error handler will get called if an error is happends
app.use(function(err,req,res,next){
    res.send("oh boy somthing went wrong")
})


app.listen(3000,function() {
    console.log(" APP is listining ON PORT 3000!")
})
