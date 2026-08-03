// Review routes (for handling review-related operations)
const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schemaValidation.js");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/review.js")

// Create Review Route: Add a new review to a specific listing and redirect to its show page
router.post("/", isLoggedIn, validateReview, createReview);

// Delete Review Route: Delete a review from the database and remove its reference from the listing
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;