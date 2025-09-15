const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,                        // Force TLS
      tlsAllowInvalidCertificates: false, // Reject invalid certs
      serverSelectionTimeoutMS: 10000,  // 10 seconds timeout
    });

    console.log('MongoDB Connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Make sure your MONGO_URI is correct and your IP is whitelisted in Atlas.');
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
