const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
    const {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path :"reviews",
        populate : { path : "author",
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "The listing you are trying to access doesn't exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
};


module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
        })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    let {title, description, price, country, location} = req.body;
    const newListing = new Listing({
        title,
        description,
        price,
        country,
        location,
    });
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry =response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing is created!");
    res.redirect("/listings");
    };

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
    const {id} = req.params;
    const {title, description, price, location} = req.body;
    let updatedListing = await Listing.findByIdAndUpdate(id, {
        title,
        description,
        price,
        location,
    });

    if(typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url, filename};
        await updatedListing.save();
    }

    req.flash("success", "listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
};
