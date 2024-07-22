const express = require("express");
const app = express();
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

// SignUp Routes

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// Login Routes

router.route("/login")
.get(userController.renderLoginForm)
.post(passport.authenticate('local', { failureRedirect: '/login', failureFlash : true }),
    userController.login
);


// Logout Route

router.get("/logout", userController.logout);
    

module.exports = router;