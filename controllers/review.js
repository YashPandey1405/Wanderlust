const Listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.addNewReviewRoute = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);
  console.log(req.user);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  // res.send("Added In Database");
  req.flash("success", "New Review Added Sucsessfully !");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReviewRoute = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Sucsessfully !");
  res.redirect(`/listings/${req.params.id}`);
};
