const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { renderSignupForm, signUp, renderLoginForm, login, logout } = require("../controllers/user.js");

// Signup Routes
router.route("/signup")
    .get(renderSignupForm)
    .post(signUp);

// Login Routes
router.route("/login")
    .get(renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: true,
        }),
        login
    );

// Process Logout
router.get("/logout", logout);

module.exports = router;
