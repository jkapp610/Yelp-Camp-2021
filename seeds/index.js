// requiring files and libaries
const campground = require("../models/campground");
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers'); 
const mongoose = require("mongoose");
//connecting to database
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
   
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//create a function that will return a random item from an array
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async function(){

    // delete all the data currently in database
    await campground.deleteMany({});
     // loop though 50 times to incert new data
   for(let i=0; i<50;i++){

        // creating a random number form 1 to 1000 because there are 1000 cities in the  cities file
        const random1000= Math.floor(Math.random()  * 1000);
        const randprice= Math.floor(Math.random()  *20)+10;
        
        

         //making a new databse campgroung entry
        const camp =  new campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: "https://source.unsplash.com/collection/483251",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus sint cum eaque. Maiores similique vel, sed libero est deserunt quo beatae quibusdam sequi architecto quae ea quas laborum, praesentium necessitatibus.",
        price: randprice
        })
        await camp.save()
    }

}

seedDB().then( function() {
    mongoose.connection.close();
    console.log("Database connection closed")
})