const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.indexRoute))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListingRoute)
  );

// New Route To Add A New Listing.....
router.get("/new", isLoggedIn, listingController.newListingRoute);

// Selected Route To Display An Selected Listing.....
router.get("/selected/:demand", listingController.showSelectedListingRoute);

// Search Route To Display The Searched Listing.....
router.get("/search", listingController.showSearchedListingRoute);

// Show Route To List An Listing.....
router
  .route("/:id")
  .get(wrapAsync(listingController.showListingsRoute))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListingRoute)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListingRoute)
  );

// Edit Route To Edit An Listing.....
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingRoute)
);

module.exports = router;
