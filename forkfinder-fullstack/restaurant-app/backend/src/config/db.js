const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);

    // 🔥 FORCE INDEX CREATION (IMPORTANT)
    await mongoose.connection.db.collection('restaurants')
      .createIndex({ location: "2dsphere" });

    console.log("✅ 2dsphere index ensured");

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;