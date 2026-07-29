// Listing routes (for handling listing-related operations)

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../util/ExpressError.js")
const { listingSchema } = require("../schemaValidation.js");


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.review);
    if (error) throw new ExpressError(400, error.message);
    next();
}

// Index Route: Retrieve and display all listings from the database
router.get("/", async (req, res) => {
    const allListings = await Listing.find({}).populate("reviews");
    res.render("listings/index.ejs", { allListings });
});

// New Route: Render the form to create a new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

// Create Route: Add a new listing to the database and redirect to the listings page
router.post("/", validateListing, async (req, res) => {
    const newListing = req.body;
    await Listing.create({ ...newListing });
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
})

// Show Route: Retrieve and display details of a specific listing by its ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
})

// Edit Route: Render the form to edit an existing listing's details
router.get("/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
})

// Update Route: Save edits made to a listing's details and redirect to its show page
router.put("/:id", validateListing, async (req, res) => {
    const { id } = req.params;
    const newListing = req.body;
    await Listing.findByIdAndUpdate(id, { ...newListing }, { runValidators: true });
    req.flash("success", "Listing Updated successfully!");
    res.redirect(`/listings/${id}`);
})

// Delete Route: Remove a listing from the database and redirect to the listings page
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete({ _id: id });
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listings");
})

module.exports = router;