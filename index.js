const dotenv = require('dotenv');
dotenv.config(); // Load env vars before anything else

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const propertyRoutes = require('./routes/property/propertyRouter');
const authRoutes = require('./routes/user/userRoutes');

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Setup CORS with tooling support
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming JSON
app.use(express.json());

// Mount routes
app.use('/api', authRoutes);
app.use('/api', propertyRoutes);

app.get('/', (req, res) => {
  res.send('Backend is live on Render!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
