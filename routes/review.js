const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../util/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../util/ExpressError");
const Listing = require("../models/listing.js");
const path = require("path");
const Review = require("../models/reviews.js");
const {isLoggedIn, IsReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// Validate review

// const validateReview = (req, res, next) => {
//     const {error} = reviewSchema.validate(req.body);
//     if (error) {
//         throw new ExpressError(400, error.details[0].message);
//     } else {
//         next();
//     }
// };

// Review Route Post request

router.post("/",isLoggedIn, reviewController.createReview);


// Review Route Delete request

router.delete("/:reviewId", isLoggedIn, IsReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;
