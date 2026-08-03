const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schemaValidation.js");
const { reviewSchema } = require("./schemaValidation.js");
const ExpressError = require("./util/ExpressError.js");

// Validation for listing
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.message);
    next();
}

// Validation for review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);
    if (error) throw new ExpressError(400, error.message);
    next();
}

// Logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to continue!");
        return res.redirect("/users/login");
    }
    next();
}

// Save redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// Owner
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't own this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Review Author
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't own this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}