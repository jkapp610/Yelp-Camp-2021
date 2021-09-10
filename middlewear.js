const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');




module.exports.isLoggedIn= function(req,res,next){
    //if user is not authenticated 
    if(!req.isAuthenticated()){
        //store url in session
        req.session.returnTo = req.originalUrl
        //display flah error message
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}


 module.exports.validateCampground = function(req,res,next){

   
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

module.exports.isAuthor = async function(req,res,next){
    //get id from the address pased in
   const myid = req.params.id;
   const campground = await Campground.findById(myid);
   //find the id and update the campground
   if(!campground.author.equals(req.user._id)){
        req.flash("error","you do not have permission")
     
        return res.redirect(`/campgrounds/${myid}`)
    }
    next();

}

 module.exports.validateReview = function(req,res,next){
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


module.exports.isReviewAuthor = async function(req,res,next){
    //get camground id from the address pased in
    const myid = req.params.id;
    //get review id from the address pased in
   const reviewId= req.params.reviewId;
   const review= await Review.findById(reviewId);
   //find the id and update the campground
   if(!review.author.equals(req.user._id)){
        req.flash("error","you do not have permission")
     
        return res.redirect(`/campgrounds/${myid}`)
    }
    next();

}