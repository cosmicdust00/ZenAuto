const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Terhubung ke Database MongoDB Atlas: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
