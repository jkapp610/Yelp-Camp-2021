
const express = require("express");
const router = express.Router({mergeParams: true});

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require('../models/review');
const Campground = require("../models/campground");


const{reviewSchema} = require("../schemas.js")

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



//REVIEW ROUTES

router.post('/', validateReview, catchAsync(async function (req, res){
    const myid = req.params.id;
    const campground = await Campground.findById(myid);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success","You successfully added a review  ")
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.delete("/:reviewId",catchAsync(async function(req,res){
    const reviewId = req.params.reviewId;
    const myid = req.params.id;
    await Campground.findByIdAndUpdate(myid,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","You successfully deleted a review")
    res.redirect(`/campgrounds/${myid}`);
   


}))

module.exports = router;