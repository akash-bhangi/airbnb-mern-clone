const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const ExpressError = require("../util/ExpressError.js")
const { reviewSchema } = require("../schemaValidation.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);
    if (error) throw new ExpressError(400, error.message);
    next();
}

// Create Review Route: Add a new review to a specific listing and redirect to its show page
router.post("/", validateReview, async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = req.body.review;
    let review = new Review(newReview);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
});

// Delete Review Route: Delete a review from the database and remove its reference from the listing
router.delete("/:reviewId", async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`);

})

module.exports = router;