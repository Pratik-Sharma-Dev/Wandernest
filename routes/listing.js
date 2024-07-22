const express = require("express");
const app = express();
const router = express.Router({mergeParams : true});
const wrapAsync = require("../util/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../util/ExpressError");
const Listing = require("../models/listing.js");
const path = require("path");
const Joi = require('joi');
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Validate listing

const validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
};

// Using Router.route

router.route("/")
.get(wrapAsync (listingController.index))
.post( upload.single('listing[image]'), wrapAsync (listingController.createListing));
// .post( upload.single('listing[image]'),(req, res) => {
//     res.send(req.file);
//     console.log(req.file);
// });


// New route

router.get("/new", listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isOwner, upload.single('listing[image]'), wrapAsync (listingController.updateListing))
.delete(
    isOwner, wrapAsync (listingController.destroyListing));

    

// Edit route

router.get("/:id/edit", wrapAsync(listingController.renderEditForm));

module.exports = router;