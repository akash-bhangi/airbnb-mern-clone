// Listing routes (for handling listing-related operations)
const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, renderNewListingForm, createListing, renderListing, editListing, updateListing, deleteListing } = require("../controllers/listing.js");

// Route for index and create
router.route("/")
    .get(index)
    .post(validateListing, createListing);

// Route for show, edit, update and delete
router.route("/:id")
    .get(renderListing)
    .put(isLoggedIn, isOwner, validateListing, updateListing)
    .delete(isLoggedIn, isOwner, deleteListing);

// New Route: Render the form to create a new listing
router.get("/new", isLoggedIn, renderNewListingForm);

// Edit Route: Render the form to edit an existing listing's details
router.get("/:id/edit", isLoggedIn, isOwner, editListing);

module.exports = router;