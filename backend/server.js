require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');

const app = express();

connectDB();

const corsOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : undefined;

app.use(
  cors({
    origin: corsOrigins || '*',
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is alive ⚡');
});

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
