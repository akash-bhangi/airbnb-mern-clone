const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 4000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js")
const cors = require('cors');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local").Strategy;
const userRoutes = require("./routes/user.js");


// Setting view engine and views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Overriding method and body
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());


// Session and flash (for handling sessions and flashes)
const sessionOption = {
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
app.use(flash());
// Passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// Database connection (for connecting to MongoDB)
async function main() {
    await mongoose.connect("mongodb://localhost:27017/airbnb-mern-clone");
}
main().then(() => console.log("Database Connected")).catch(err => console.log(err));

// Routes (for handling routes)
app.use("/", userRoutes);
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Error handling (for handling errors)
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error middleware (for handling errors)
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.render("error.ejs", { status, message });
});

// Start server (for starting the server)
app.listen(port, () => {
    console.log(`Server started at port ${port}, http://localhost:${port}/listings`);
});