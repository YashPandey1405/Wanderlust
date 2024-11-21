if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path"); // PATH module for working with file and directory paths
const methodOverride = require("method-override"); // For overriding HTTP methods (e.g., PUT/DELETE in forms)
const ejsMate = require("ejs-mate"); // For EJS templating with layout support (Boilerplate HTML)
const db_url = process.env.ATLASDB_URl;

// Custom error class for handling specific Express errors
const ExpressError = require("./utils/ExpressError.js"); // Defined in /utils

// Importing route handlers for modularized routing
const ListingRouter = require("./routes/listing.js");
const ReviewRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");

// Middleware for managing sessions and flash messages
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// Passport.js for for username/password authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");

// User model for MongoDB, used with Passport for authentication
const User = require("./models/user.js");

// Port number on which the server will listen
const port = 8080;

// App settings and middleware configuration
app.set("view engine", "ejs"); // Set the view engine to EJS for rendering templates
app.set("views", path.join(__dirname, "views")); // Set the views directory for EJS files
app.engine("ejs", ejsMate); // Use EJS-Mate for templating with boilerplates

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies (from forms)
app.use(express.json()); // Parses JSON bodies (from APIs)

// Serve static files (like CSS, JS, images) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Enable method-override for HTTP methods like PUT and DELETE in forms
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("error in mongo session store", err);
});

// Session configuration options
const sessionOptions = {
  store,
  secret: process.env.SECRET, // Secret for signing the session ID
  resave: false, // Prevent resaving unchanged sessions
  saveUninitialized: true, // Save new sessions even if they're unmodified
  cookie: {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Cookie expiration (1 week)
    maxAge: 1000 * 60 * 60 * 24 * 7, // Maximum cookie age
    httpOnly: true, // Prevent client-side JavaScript access for added security
  },
};

async function main() {
  await mongoose.connect(db_url); // Database connection URI
}

// Connect to MongoDB using Mongoose
main()
  .then(() => {
    console.log("Connection Is Successful");
  })
  .catch((err) => {
    console.log("Connection Is Failed");
  });

// Apply session & Flash messages middleware
app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport and manage sessions
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with the local strategy and User model methods
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set variables available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Set current logged-in user
  next();
});

// Define routes using modularized route files
app.use("/listings", ListingRouter); // Routes for listing-related actions
app.use("/listings/:id/reviews", ReviewRouter); // Routes for review-related actions
app.use("/", UserRouter); // Routes for user-related actions

// Catch-all route for undefined paths (404 error handling)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found !")); // Pass a custom 404 error to the error handler
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.log("Error Message Received.....");
  let { status = 500, message = "Some Error Occurred !" } = err;
  res.status(status).render("error.ejs", { err }); // Render error template with the error details
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
