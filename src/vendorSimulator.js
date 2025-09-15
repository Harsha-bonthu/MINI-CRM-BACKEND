const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

// Load .env from the server root
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import CommunicationLog model
const CommunicationLog = require('./models/CommunicationLog');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Vendor Simulator connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const API_URL = `http://localhost:${process.env.PORT || 4000}/api/campaigns/delivery-receipt`;

// Function to simulate delivery
const simulateDelivery = async () => {
  try {
    const pendingLogs = await CommunicationLog.find({ status: 'PENDING' }).lean();

    if (pendingLogs.length === 0) {
      console.log('No pending logs to process.');
      return;
    }

    console.log(`Processing ${pendingLogs.length} pending logs...`);

    for (const log of pendingLogs) {
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
      console.log(`[Vendor] Sending log ${log._id}: ${status}`);

      try {
        await axios.post(API_URL, {
          logId: log._id,
          status
        });
        console.log(`[Vendor] Successfully updated log ${log._id}`);
      } catch (err) {
        console.error(`[Vendor] Error sending log ${log._id}:`, err.response?.data || err.message);
      }
    }

  } catch (error) {
    console.error('Error in vendor simulation:', error.message);
  }
};

// Run simulation every 5 seconds
setInterval(simulateDelivery, 5000);

// Run immediately on start
simulateDelivery();
