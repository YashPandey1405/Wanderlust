const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// main()
//   .then((res) => {
//     console.log("Connection Is Sucsessful");
//   })
//   .catch((err) => {
//     console.log("Connection Is Failed");
//   });

// async function main() {
//   await mongoose.connect("process.env.LOCALDB_URl");
// }

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "673f59f7b4327395ccfe6b1e",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data Added In Mongo Database");
};

initDB();
