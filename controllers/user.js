const User = require("../models/user.js");

//signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

//signup process
module.exports.signUp = async (req, res, next) => {
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
        res.redirect("/users/signup");
    }
}

// login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

//login process
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Airbnb!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}