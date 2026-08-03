const Listing = require("../models/listing.js");

// Function to get all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}).populate("reviews");
    res.render("listings/index.ejs", { allListings });
}

// Function to render new listing form
module.exports.renderNewListingForm = (req, res) => {
    res.render("listings/new.ejs");
}

// Function to create a new listing
module.exports.createListing = async (req, res) => {
    const newListing = req.body;
    newListing.owner = req.user._id;
    await Listing.create({ ...newListing });
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

// Function to render listing show page
module.exports.renderListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

// Function to render edit listing form
module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

// Function to update a listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body }, { runValidators: true });
    req.flash("success", "Listing Updated successfully!");
    res.redirect(`/listings/${id}`);
}

// Function to delete a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete({ _id: id });
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listings");
}