const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 4000;
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schemaValidation.js");
const cors = require('cors');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) throw new ExpressError(400, error.message);
    next();
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);
    if (error) throw new ExpressError(400, error.message);
    next();
}

async function main() {
    await mongoose.connect("mongodb://localhost:27017/airbnb-mern-clone");
}

main().then(() => console.log("Database Connected")).catch(err => console.log(err));


app.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({}).populate("reviews");
    res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.post("/listings", validateListing, async (req, res) => {
    const newListing = req.body;
    await Listing.create({ ...newListing });
    res.redirect("/listings");
})

app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
})

app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})

app.put("/listings/:id", validateListing, async (req, res) => {
    const { id } = req.params;
    const newListing = req.body;
    await Listing.findByIdAndUpdate(id, { ...newListing }, { runValidators: true });
    res.redirect(`/listings/${id}`);
})



app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete({ _id: id });
    res.redirect("/listings");
})

app.listen(port, () => {
    console.log(`Server started at port ${port}, http://localhost:${port}`);
});

app.post("/listings/:id/reviews", validateReview, async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = req.body.review;
    let review = new Review(newReview);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id/:reviewId/reviews", async (req, res) => {
    let id = req.params.id;
    let reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`);

})
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", { status, message });
});