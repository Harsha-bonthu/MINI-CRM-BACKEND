const express = require('express');
const router = express.Router();
const { createCampaign, handleDeliveryReceipt, getCampaigns } = require('../controllers/campaignController');
const authCheck = require('../middleware/authCheck');

// Protected routes (requires login)
router.get('/', authCheck, getCampaigns);
router.post('/', authCheck, createCampaign);

// Vendor callback route (unprotected)
router.post('/delivery-receipt', handleDeliveryReceipt);

module.exports = router;
