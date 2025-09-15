const express = require('express');
const router = express.Router();
const { createCustomer, getAllCustomers, getCustomerById } = require('../controllers/customerController');

// Create customer (send to RabbitMQ)
router.post('/', createCustomer);

// Get all customers
router.get('/', getAllCustomers);

// Get single customer by ID
router.get('/:id', getCustomerById);

module.exports = router;
