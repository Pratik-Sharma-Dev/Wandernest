const User = require("../models/user.js")

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

module.exports.signup = async (req, res) => {
    try {
        let {username, password, email} = req.body;
        // Add user to the database here
        let newUser = new User({username, email});
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (error) => {
            if(error) {
                return next(error);
            }
            req.flash("success", "You have successfully registered!");
        res.redirect("/listings");
        })
        console.log(registeredUser);
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.login = async(req, res) => {
    req.flash("success", "You have successfully logged in!");
    res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
    req.logout((error) => {
        if(error) {
            return next(error);
        }
        req.flash("success", "You have successfully logged out!");
        res.redirect("/listings");
    });
};