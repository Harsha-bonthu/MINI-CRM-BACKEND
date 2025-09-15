# MINI-CRM-BACKEND

# MINI-CRM Server

This is the backend application for the MINI-CRM platform, built with Node.js and Express. It provides RESTful APIs for campaign management, audience segmentation, AI-powered features, authentication, and database operations.

---

## 📁 Project Structure


server/
├── src/
│   ├── config/           # Database and Passport setup
│   ├── controllers/      # Business logic, AI, campaign, etc.
│   ├── middleware/       # Authentication and other middleware
│   ├── models/           # Mongoose models (Campaign, Customer, etc.)
│   ├── routes/           # API route definitions
│   ├── consumer.js       # Event/message consumer
│   ├── index.js          # Server entry point
│   └── vendorSimulator.js# Vendor simulation logic
├── package.json          # Backend dependencies
├── .env                  # Environment variables (not committed)
└── .gitignore


---

## 🏗 Architecture Diagram


┌──────────────────────────────┐
│      Frontend (Client)       │
└─────────────┬────────────────┘
              │ REST API Calls
              ▼
      ┌──────────────────────┐
      │      Backend         │
      │ (Node.js + Express)  │
      └─────────┬────────────┘
                │
   ┌────────────┼─────────────┬──────────────┐
   │            │             │              │
   ▼            ▼             ▼              ▼
┌────────┐  ┌────────────┐  ┌───────────────┐ ┌───────────────┐
│Database│  │AI Services │  │Vendor/3rd-Party│ │Authentication│
│(MongoDB│  │(AI APIs,   │  │Integrations   │ │(Passport.js) │
│ or     │  │Controllers)│  │(Simulators)   │ └───────────────┘
└────────┘  └────────────┘  └───────────────┘


- *Backend:* Node.js/Express, manages business logic, authentication, API endpoints, and orchestrates AI and DB operations.
- *Database:* MongoDB (or similar), stores users, campaigns, audiences, logs, etc.
- *AI Tools:* Custom AI controllers (e.g., aiController.js), can call external AI APIs or run local models.
- *Vendor/3rd-Party Integrations:* Simulates or connects to external vendors for campaign delivery/testing.
- *Authentication:* Passport.js for user authentication and session management.

---

## 🚀 Local Setup Instructions

1. *Navigate to the server directory:*
   sh
   cd server
   

2. *Install dependencies:*
   sh
   npm install
   

3. *Configure environment variables:*
   - Copy .env.example to .env and update values as needed (e.g., database URI, API keys).

4. *Start the backend server:*
   sh
   npm start
   

5. *API Endpoints:*
   - The server will run on the port specified in your .env (default: 3000).
   - Access API endpoints at http://localhost:3000/api/...

---

## 🤖 AI Tools & Tech Stack

- *Node.js & Express:* REST API server
- *MongoDB (or similar):* Database for storing CRM data
- *Passport.js:* Authentication middleware
- *AI Integration:*
  - Custom AI controllers (see src/controllers/aiController.js)
  - Can connect to external AI APIs or run local models for features like audience suggestions, campaign optimization, etc.
- *Other:*
  - Mongoose (ODM for MongoDB)
  - ESLint for code quality
  - Modular route/controller structure

---

## ⚠ Known Limitations & Assumptions

- AI features depend on external APIs or models; ensure API keys/configuration are set.
- No production-grade security, rate limiting, or input sanitization implemented.
- Assumes a local database is running and accessible.
- Minimal error handling and input validation.
- Not optimized for large-scale deployments or high concurrency.
- Some folder and file names may need to be updated for your specific environment.

---

For questions or contributions, please open an issue or pull request.
