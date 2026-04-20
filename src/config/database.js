const mongoose = require("mongoose");

async function connectDatabase(uri) {
  await mongoose.connect(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected");
}

module.exports = { connectDatabase };
