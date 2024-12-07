const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

// Username & Password Will Be Automatically Created By passportLocalMongoose
// Along With (Hash+Salting)......
const userSchema = new Schema({
  about: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
      set: (v) =>
        v === ""
          ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
          : v,
    },
  },
});

// Correctly apply the plugin to userSchema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
