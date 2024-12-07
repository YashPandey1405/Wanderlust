const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

// main()
//   .then((res) => {
//     console.log("Connection Is Sucsessful");
//   })
//   .catch((err) => {
//     console.log("Connection Is Failed");
//   });

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://p7.hiclipart.com/preview/722/179/596/house-logo-real-estate-home-house.jpg",
      set: (v) =>
        v === ""
          ? "https://p7.hiclipart.com/preview/722/179/596/house-logo-real-estate-home-house.jpg"
          : v,
    },
  },

  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic",
      "Mountains",
      "Castls",
      "Beach",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Skiing",
    ],
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
