const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

// Render Signup Form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Process Signup Form
router.post("/signup", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Log in the user immediately after signing up
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Airbnb!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

// Render Login Form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Process Login Form
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome back to Airbnb!");
        res.redirect("/listings");
    }
);

// Process Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;
