// Database connection (for connecting to MongoDB)

const mongoose = require("mongoose");
const Listing = require("../models/listing")
const initData = require("./data.js");

async function main() {
    await mongoose.connect("mongodb://localhost:27017/airbnb-mern-clone");
}

main().then(res => console.log("Database Connected")).catch(err => console.log(err));

// Insert sample listings
async function init() {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a6da5f369636532b91095b4"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data Inserted");
}

init();