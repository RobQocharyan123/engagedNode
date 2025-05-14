import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/votingRoute.js';
dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB

// === COUNTDOWN LOGIC ===
const COUNTDOWN_DURATION = 1000000;
const countdownStart = Date.now();
// gRr9lhBQdNqcLKzp  its password my db if its not work

app.use('/api/vote', router);
app.get('/remaining-time', (req, res) => {
  const now = Date.now();
  const elapsed = now - countdownStart;
  const remaining = Math.max(0, COUNTDOWN_DURATION - elapsed);

  res.json({ remaining_time_miliseconds: remaining });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
