const dotenv = require('dotenv');
dotenv.config(); // <--- First!
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const propertyRoutes = require('./routes/property/propertyRouter');
const authRoutes = require('./routes/user/userRoutes');

// Load environment variables

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Enable CORS for React frontend (default port 3000)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming JSON requests
app.use(express.json());

// Mount API routes
app.use('/api', authRoutes);
app.use('/api', propertyRoutes);



// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
