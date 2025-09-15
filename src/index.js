// ===================================
// 1. IMPORTS
// ===================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./config/passport-setup');

// ===================================
// 2. INITIAL CONFIGURATION
// ===================================
dotenv.config();

// ===================================
// 3. INITIALIZE EXPRESS APP
// ===================================
const app = express();
const PORT = process.env.PORT || 4000;

// ===================================
// 4. MIDDLEWARE
// ===================================
app.use(cors());
app.use(express.json());

// SESSION CONFIG
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallbacksecret123', // Use a proper secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      crypto: {
        secret: process.env.SESSION_SECRET || 'fallbacksecret123', // encrypt session
      },
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      secure: false, // true if using HTTPS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ===================================
// 5. ROUTES
// ===================================
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/audience', audienceRoutes);
app.use('/api/campaigns', campaignRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// ===================================
// 6. DUMMY VENDOR API
// ===================================
app.post('/vendor/send', (req, res) => {
  const { logId, message } = req.body;
  console.log(`[Vendor] Received message for log ${logId}: "${message}"`);

  const isSent = Math.random() < 0.9;
  const status = isSent ? 'SENT' : 'FAILED';
  console.log(`[Vendor] Simulating delivery status: ${status}`);

  setTimeout(() => {
    axios
      .post(`http://localhost:${PORT}/api/campaigns/delivery-receipt`, { logId, status })
      .catch(err => console.error("[Vendor] Error calling receipt API:", err.message));
  }, Math.random() * 2000 + 500);

  res.status(200).json({ message: 'Vendor accepted the message.' });
});

// ===================================
// 7. CONNECT TO DB AND START SERVER
// ===================================
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
