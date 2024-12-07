const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

module.exports.signUpRoute = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postSignUpRoute = async (req, res, next) => {
  try {
    let url = req.file.path;
    console.log(url);
    let filename = req.file.filename;
    console.log(filename);
    console.log(req.body.user.password);
    const NewSignupUser = new User(req.body.user);
    NewSignupUser.image = { filename, url };
    // const { password } = req.body;
    // const newUser = new User({ email, username });
    const registeredUser = await User.register(
      NewSignupUser,
      req.body.user.password
    );
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To Wanderlust !");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.loginRoute = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postLoginRoute = async (req, res) => {
  req.flash("success", "Welcome Back To Wanderlust");
  let newUrl = res.locals.redirectURL || "/listings";
  res.redirect(newUrl);
};

module.exports.showProfileRoute = async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const reviewCount = await Review.countDocuments({
    author: req.user._id, // Mongoose will handle ObjectId conversion automatically
  });
  const allListings = await Listing.find({
    owner: req.user._id, // Mongoose will handle ObjectId conversion automatically
  });
  res.render("users/UserPage.ejs", {
    currentUser,
    allListings,
    reviewCount,
  });
};

module.exports.editProfileRoute = async (req, res) => {
  let { userID } = req.params;
  let updatedUser = await User.findByIdAndUpdate(userID, {
    ...req.body.user,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedUser.image = { url, filename };
    await updatedUser.save();
  }
  req.flash("success", "Profile Updated Sucsessfully !");
  res.redirect(`/profile`);
};

module.exports.destroyProfileRoute = async (req, res, next) => {
  try {
    // Delete all reviews written by the user
    const reviewCount = await Review.deleteMany({
      author: req.user._id,
    });

    // Delete all listings owned by the user
    const allListings = await Listing.deleteMany({
      owner: req.user._id,
    });

    // Delete the user's profile
    const currentUser = await User.findByIdAndDelete(req.user._id);

    // Log the user out after deleting their profile
    req.logOut((err) => {
      if (err) {
        return next(err); // Handle the logout error, if any
      }

      // Flash a success message
      req.flash(
        "success",
        "Thank you for using Wanderlust! Your Profile & Data have been Deleted."
      );

      // Redirect to the home page or another appropriate route
      res.redirect("/listings");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "There was an error deleting your profile and data.");
    res.redirect("/profile"); // Redirect to the profile page or an error page
  }
};

module.exports.logOutRoute = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You Are Logged Out Sucsessfully !");
    res.redirect("/listings");
  });
};
