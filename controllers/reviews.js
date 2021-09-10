const Review = require('../models/review');
const Campground = require("../models/campground");


module.exports.createReview = async function (req, res){
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
}

module.exports.deleteReview = async function(req,res){
    const reviewId = req.params.reviewId;
    const myid = req.params.id;
    await Campground.findByIdAndUpdate(myid,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","You successfully deleted a review")
    res.redirect(`/campgrounds/${myid}`);
   


}