// ===================================
// consumer.js - Mini CRM RabbitMQ Worker
// ===================================

// 1️⃣ Load environment variables
require('dotenv').config();

// 2️⃣ Imports
const amqp = require('amqplib');
const axios = require('axios');
const connectDB = require('./config/db');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const CommunicationLog = require('./models/CommunicationLog');

// 3️⃣ Connect to MongoDB
connectDB()
  .then(() => console.log('[✓] Connected to MongoDB'))
  .catch((err) => console.error('[✗] MongoDB connection failed:', err));

// 4️⃣ Consume RabbitMQ messages
const consumeMessages = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();

    // Queues
    const customerQueue = 'customer_ingestion';
    const orderQueue = 'order_ingestion';
    const deliveryQueue = 'delivery_queue';

    await channel.assertQueue(customerQueue, { durable: true });
    await channel.assertQueue(orderQueue, { durable: true });
    await channel.assertQueue(deliveryQueue, { durable: true });

    console.log('[*] Waiting for messages in all queues. To exit press CTRL+C');

    // ------------------------
    // Customer ingestion
    // ------------------------
    channel.consume(customerQueue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('[x] Received customer:', content);

        try {
          await Customer.findOneAndUpdate(
            { email: content.email },
            content,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          console.log('[✓] Customer processed successfully.');
        } catch (dbError) {
          console.error('[✗] Error processing customer:', dbError);
        }

        channel.ack(msg);
      }
    });

    // ------------------------
    // Order ingestion
    // ------------------------
    channel.consume(orderQueue, async (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('[x] Received order:', content);

        try {
          const { customerId, amount } = content;
          const customer = await Customer.findById(customerId);

          if (customer) {
            const order = new Order({ customerId, amount });
            await order.save();

            // Update customer stats
            customer.totalSpends = (customer.totalSpends || 0) + amount;
            customer.visitCount = (customer.visitCount || 0) + 1;
            customer.lastVisit = new Date();
            await customer.save();

            console.log('[✓] Order processed successfully.');
          } else {
            console.log('[!] Customer not found. Discarding order.');
          }
        } catch (dbError) {
          console.error('[✗] Error processing order:', dbError);
        }

        channel.ack(msg);
      }
    });

    // ------------------------
    // Delivery queue
    // ------------------------
    channel.consume(deliveryQueue, async (msg) => {
      if (msg !== null) {
        const { logId } = JSON.parse(msg.content.toString());
        console.log(`[x] Received delivery job for logId: ${logId}`);

        try {
          const log = await CommunicationLog.findById(logId).lean();
          if (log) {
            await axios.post('http://localhost:4000/vendor/send', {
              logId: log._id,
              message: log.message
            });
            console.log(`[✓] Handed off log ${logId} to vendor.`);
          } else {
            console.log(`[!] Log not found for ${logId}. Discarding job.`);
          }
        } catch (err) {
          console.error(`[✗] Error processing delivery job for ${logId}:`, err);
        }

        channel.ack(msg);
      }
    });

  } catch (error) {
    console.error('[✗] Failed to start consumer:', error);
  }
};

// 5️⃣ Start the consumer
consumeMessages();
