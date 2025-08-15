import mongoose from 'mongoose';

const countdownSchema = new mongoose.Schema({
  targetAt: {
    type: Date,
    required: true, // store the date sent from frontend
  },
});

const Countdown = mongoose.model('Countdown', countdownSchema);

export default Countdown;
