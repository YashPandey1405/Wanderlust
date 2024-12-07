const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/review.js");
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

// Post Route To Add Review With Id In MongoDB....
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addNewReviewRoute)
);

// Delete Route To Delete Review With Id In MongoDB....
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReviewRoute)
);

module.exports = router;
