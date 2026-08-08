const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudinary.js");
const { getCoordinates } = require("../util/getCoordinates.js");

// Function to get all listings
module.exports.index = async (req, res) => {
    if (!req.query.category && !req.query.search) {
        let allListings = await Listing.find({}).populate("reviews");
        return res.render("listings/index.ejs", { allListings });
    }
    if (!req.query.search) {
        const { category } = req.query;
        // Capitalize category (e.g. 'home' -> 'Home') to match the DB/schema values
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        let allListings = await Listing.find({ category: formattedCategory }).populate("reviews");
        if (allListings.length === 0) {
            req.flash("error", "No listings found for this category!");
            return res.redirect("/listings");
        }
        return res.render("listings/index.ejs", { allListings });
    }
    const { search } = req.query;
    let allListings = await Listing.find({ $text: { $search: search } }).populate("reviews");
    if (allListings.length === 0) {
        req.flash("error", "No listings found for this category!");
        return res.redirect("/listings");
    }
    return res.render("listings/index.ejs", { allListings });
}

// Function to render new listing form
module.exports.renderNewListingForm = (req, res) => {
    res.render("listings/new.ejs");
}

// Function to create a new listing
module.exports.createListing = async (req, res) => {
    const response = await getCoordinates(req.body.location);
    const newListing = new Listing(req.body);
    newListing.geometry.coordinates = [response.data[0].lon, response.data[0].lat];
    newListing.owner = req.user._id;
    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        newListing.image = { filename, url };
    }
    await newListing.save();
    console.log(newListing);
    req.flash("success", "Listing Created!");
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
    const updateData = { ...req.body };
    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        updateData.image = { filename, url };
    }
    const response = await getCoordinates(updateData.location);
    updateData.geometry = { coordinates: [response.data[0].lon, response.data[0].lat] };
    await Listing.findByIdAndUpdate(id, updateData, { runValidators: true });
    req.flash("success", "Listing Updated successfully!");
    res.redirect(`/listings/${id}`);
}

// Function to delete a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    await Listing.findByIdAndDelete({ _id: id });
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listings");
}