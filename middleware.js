const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("error", "You must be logged-in To Create Listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const currentListing = await Listing.findById(id);
  if (currentListing && !currentListing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const currentReview = await Review.findById(reviewId);
  if (currentReview && !currentReview.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
