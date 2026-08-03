const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Create Review
module.exports.createReview = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = req.body.review;
    let review = new Review(newReview);
    listing.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await listing.save();
    req.flash("success", "Review Added successfully!");
    res.redirect(`/listings/${id}`);
}

// Delete Review
module.exports.deleteReview = async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted successfully!");
    res.redirect(`/listings/${id}`);
}