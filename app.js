// if(process.env.NODE_ENV != "Production"){
    require('dotenv').config()
// }

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError");
app.engine('ejs', ejsMate);
const Joi = require('joi');
const {listingSchema, reviewSchema} = require("./schema.js");
const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretCode"));
const flash = require('connect-flash');
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const dbUrl = process.env.MONOGODB_CONNECTION_URL;

const session = require('express-session');
const MongoStore = require('connect-mongo');
const store  = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds
} );

store.on("error", () => {
    console.log('MongoDB connection error for storing session information');
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.json());


main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};

const validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
};

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         username: "demouser",
//         email: "demouser@example.com",
//     });
//     let registerdUser = await User.register(fakeUser, "password");
//     res.send(registerdUser);
// });

app.use("/listings", listingsRoutes);

// Listing search route

app.use("/search", async (req, res, next) => {
    const { query } = req.query;
    console.log(query);
    try {
        const allListings = await Listing.find( {$or : [{ title : query}, {location : query}, {country : query}] // Assuming you have a text index on the Listing model
    });
        if(!allListings.length) {
            req.flash('error', 'No listings found with that title');
            return res.redirect('/listings');
        }
        res.render('listings/index.ejs', {allListings})// Render the listings page with the search results
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong with the search');
        res.redirect('/listings');
    }
});


app.use("/listings/:id/reviews", reviewsRoutes );

app.use("/", userRoutes);

// for cookies

// app.get("/getcookie", (req, res) => {
//     res.cookie("name" , "Pratik");
//     console.dir(req.cookies);
//     res.send("Now you can seee cookie");
// });

// // for Signed cookies

// app.get("/getsigned", (req, res) => {
//     res.cookie("country" , "India", { signed : true});
//     res.send("Now you can check signed cookies");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
// })


// Middleware for handling errors

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let {statusCode= 500, message= "Something went wrong"} = err;
    res.render("eror.ejs", {message})
    // res.status(statusCode).send(message);
});


app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
