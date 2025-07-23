const dotenv = require('dotenv');
dotenv.config(); // Load environment variables first

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const propertyRoutes = require('./routes/property/propertyRouter');
const authRoutes = require('./routes/user/userRoutes');

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Enable CORS for both localhost and Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:5173',                    
    'https://next-property-25z6.vercel.app'    
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming JSON requests
app.use(express.json());

// Mount API routes
app.use('/api', authRoutes);
app.use('/api', propertyRoutes);
app.get('/', (req, res) => {
  res.send('Backend is live on Render!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
