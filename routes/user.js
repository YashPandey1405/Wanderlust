const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/user.js");
const { saveRedirectUrl } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing.js");

router.get("/", (req, res) => {
  res.redirect("/listings");
});

// Get & Post Route To Signup User.....
router
  .route("/signup")
  .get(userController.signUpRoute)
  .post(
    upload.single("user[image]"),
    wrapAsync(userController.postSignUpRoute)
  );

// Get & Post Route To Login User.....
router
  .route("/login")
  .get(userController.loginRoute)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.postLoginRoute
  );

// Get Route To Show User Profile.....
router
  .route("/profile")
  .get(userController.showProfileRoute)
  .post(userController.destroyProfileRoute);

// Get & Post Route To Edit User Profile.....
router
  .route("/profile/:userID/edit")
  .get(async (req, res) => {
    let { userID } = req.params;
    const currentUser = await User.findById(userID);
    let originalImageUrl = currentUser.image.url;
    res.render("users/EditProfile.ejs", { currentUser, originalImageUrl });
  })
  .post(upload.single("user[image]"), userController.editProfileRoute);

// Get Route To Logout User.....
router.get("/logout", userController.logOutRoute);

module.exports = router;
