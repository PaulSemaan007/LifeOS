const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const educationRoutes = require('./routes/education');
const financesRoutes = require('./routes/finances');
const fitnessRoutes = require('./routes/fitness');
const careerRoutes = require('./routes/career');

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'LifeOS API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LifeOS API is healthy' });
});

// API routes
app.use('/api/education', educationRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/career', careerRoutes);

// API overview route
app.get('/api', (req, res) => {
  res.json({
    message: 'LifeOS API',
    version: '1.0.0',
    endpoints: {
      education: '/api/education',
      finances: '/api/finances',
      fitness: '/api/fitness',
      career: '/api/career'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LifeOS server running on port ${PORT}`);
});