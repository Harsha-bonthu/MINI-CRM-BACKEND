const amqp = require('amqplib');

// In-memory array for demo purposes
let customers = [];

// POST /api/customers → send to RabbitMQ
const createCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Add to in-memory array for testing GET
    const newCustomer = { id: customers.length + 1, name, email };
    customers.push(newCustomer);

    // Send to RabbitMQ
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    const queue = 'customer_ingestion';

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(req.body)), { persistent: true });
    console.log(" [x] Sent '%s'", JSON.stringify(req.body));

    await channel.close();
    await connection.close();

    // Respond immediately
    res.status(202).json({ message: 'Request accepted for processing.' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// GET /api/customers → return in-memory array
const getAllCustomers = (req, res) => {
  res.json(customers);
};

// GET /api/customers/:id → single customer
const getCustomerById = (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById
};
