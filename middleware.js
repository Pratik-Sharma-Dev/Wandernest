const Listing = require("./models/listing.js")
const Review = require("./models/reviews.js")



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // Corrected by calling the function
        req.flash("error", "Please login!");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/login');
    }
    next();
};



module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.saveRedirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings');
        }

        if (!res.locals.currentUser || !res.locals.currentUser._id.equals(listing.owner)) {
            req.flash("error", "You are not authorized to edit this listing");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        return res.redirect('/listings');
    }
};



module.exports.IsReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!res.locals.currentUser._id.equals(review.author)) { // Corrected condition
        req.flash("error", "You are not authorized to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
