const express = require("express");

const path = require("path");


const campground = require("./models/campground");

const mongoose = require("mongoose");

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


app.get("/", function(req,res){

    res.render("home");

})

app.get("/makecampground",  async function(req,res){

   const camp = new campground({title:"My Backyard"});
   await camp.save()
   res.send(camp);

})

app.listen(3000,function() {
    console.log(" APP is listining ON PORT 3000!")
})