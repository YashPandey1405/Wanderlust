const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.indexRoute = async (req, res) => {
  const allListings = await Listing.find({});
  let demand = null;
  res.render("listings/HomeListings.ejs", { allListings, demand });
};

module.exports.showSelectedListingRoute = async (req, res) => {
  let { demand } = req.params;
  const allListings = await Listing.find({ category: demand });
  if (allListings.length === 0) {
    req.flash("error", `Currently, no listings are available for ${demand}!`);
    return res.redirect("/listings");
  }
  res.render("listings/HomeListings.ejs", { allListings, demand });
};

module.exports.showSearchedListingRoute = async (req, res) => {
  const searchQuery = req.query.search;
  let allListings = await Listing.find({ location: searchQuery });

  // If no listings were found for location, search by country
  if (allListings.length === 0) {
    allListings = await Listing.find({ country: searchQuery });

    // If no listings found in both location and country, show a flash message
    if (allListings.length === 0) {
      req.flash(
        "error",
        `Currently, no listings are available in ${searchQuery}!`
      );
      return res.redirect("/listings");
    }
  }
  let demand = searchQuery;
  // Render the search results
  res.render("listings/HomeListings.ejs", { allListings, demand });
};

module.exports.newListingRoute = (req, res) => {
  res.render("listings/AddNewListing.ejs");
};

module.exports.showListingsRoute = async (req, res) => {
  let { id } = req.params;
  const listingData = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(listingData);
  if (!listingData) {
    req.flash("error", "Listing You Requested Doesn't Exist !");
    res.redirect("/listings");
  }
  res.render("listings/ShowListings.ejs", { listingData });
};

module.exports.editListingRoute = async (req, res) => {
  let { id } = req.params;
  const editListing = await Listing.findById(id);
  if (!editListing) {
    req.flash("error", "Listing You Requested Doesn't Exist !");
    res.redirect("/listings");
  }
  let originalImageUrl = editListing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/EditListing.ejs", { editListing, originalImageUrl });
};

module.exports.createListingRoute = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url);
  // console.log(filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { filename, url };

  console.log(response.body.features[0].geometry);
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  console.log(newListing);
  req.flash("success", "New Listing Created Sucsessfully !");
  res.redirect("/listings");
};

module.exports.updateListingRoute = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  listing.geometry = response.body.features[0].geometry;

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();
  req.flash("success", "Listing Updated Sucsessfully !");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListingRoute = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted Sucsessfully !");
  res.redirect("/listings");
};
