const Campground = require("../models/campground");

module.exports.index = async function(req,res){

    
    // finding all the campgrounds from database
    const campgrounds =await Campground.find({});
   
    //calling render to display the html page
    res.render("campgrounds/index.ejs",{campgrounds});
}

module.exports.rederNewForm = function(req,res){

    //calling render to display the html page
    res.render("campgrounds/new");   

}

module.exports.createCampground = async function(req, res,next)  {

    

    //if(!req.body.campground) throw new ExpressError("Invalid campground data",400)
    //creating and saving campground
     const campground = new Campground(req.body.campground);
     //set the image to the array created from req.files.map
     campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
     //set author to the logged in user
     campground.author = req.user._id
    await campground.save();
    console.log(campground)
       //setting up flash message
    req.flash("success","successfully made a new campground!")
    //redirecting to the new camground page
    res.redirect(`/campgrounds/${campground._id}`)
       
}

module.exports.showCampground = async function(req,res){
    //look up camground useing id
    const myid= req.params.id;
    const campground = await Campground.findById(myid).populate({
        path:'reviews',
        populate:{
            path: "author"
        }
    }).populate('author');
    
    //if can't find it display error
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    
    //calling render to display the html page
    res.render("campgrounds/show",{campground});



}

module.exports.renderEditForm = async  function(req, res)  {

    //get id from the address pased in
    const myid = req.params.id;
      //look up camground useing id
    const campground = await Campground.findById(myid);

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
     //calling render to display the html page
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async function(req,res){
    //get id from the address pased in
   const myid = req.params.id;
   //find the id and update the campground
   const campground = await Campground.findByIdAndUpdate(myid, { ...req.body.campground });

   //setting up flash message
   req.flash("success","successfully updated campground!")

   //calling redirect  back to the camground show page
   res.redirect(`/campgrounds/${campground._id}`)


}


module.exports.deleteCampground = async function (req, res){
    //get id from the address pased in
    const myid = req.params.id;
    // find id and delete ot from db
    await Campground.findByIdAndDelete(myid);

    //create a flash meassage
    req.flash("success","You successfully deleted a campground")
     //calling redirect to load the campground list
    res.redirect("/campgrounds");
}