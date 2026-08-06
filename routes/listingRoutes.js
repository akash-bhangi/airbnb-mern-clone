// Listing routes (for handling listing-related operations)
const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, renderNewListingForm, createListing, renderListing, editListing, updateListing, deleteListing } = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudinary.js");
const upload = multer({ storage });


// Route for index and create
router.route("/")
    .get(index)
    .post(isLoggedIn, upload.single("image"), validateListing, createListing);
// New Route: Render the form to create a new listing
router.get("/new", isLoggedIn, renderNewListingForm);

// Route for show, edit, update and delete
router.route("/:id")
    .get(renderListing)
    .put(isLoggedIn, isOwner, upload.single("image"), validateListing, updateListing)
    .delete(isLoggedIn, isOwner, deleteListing);

// Edit Route: Render the form to edit an existing listing's details
router.get("/:id/edit", isLoggedIn, isOwner, editListing);

module.exports = router;