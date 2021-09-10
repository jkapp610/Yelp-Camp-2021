
const express = require("express");
const router = express.Router({mergeParams: true});

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require('../models/review');
const Campground = require("../models/campground");

const{validateReview,isLoggedIn,isReviewAuthor} = require("../middlewear")


//REVIEW ROUTES

router.post('/', isLoggedIn, validateReview, catchAsync(async function (req, res){
    const myid = req.params.id;
    const campground = await Campground.findById(myid);
    const review = new Review(req.body.review);
    //set the author of the review to current logged in user
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success","You successfully added a review  ")
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(async function(req,res){
    const reviewId = req.params.reviewId;
    const myid = req.params.id;
    await Campground.findByIdAndUpdate(myid,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","You successfully deleted a review")
    res.redirect(`/campgrounds/${myid}`);
   


}))

module.exports = router;