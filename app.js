const express = require("express");

const path = require("path");


const Campground = require("./models/campground");

const mongoose = require("mongoose");
const campground = require("./models/campground");

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

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));


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

app.post('/campgrounds', async function(req, res)  {

    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})


// setting up a  express get route for show route
app.get("/campgrounds/:id", async function(req,res){

    const myid= req.params.id;
    const campground = await Campground.findById(myid)
    
    //calling render to display the html page
    res.render("campgrounds/show",{campground});



})





app.listen(3000,function() {
    console.log(" APP is listining ON PORT 3000!")
})