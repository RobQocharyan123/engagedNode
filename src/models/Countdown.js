import mongoose from 'mongoose';

const countdownSchema = new mongoose.Schema({
  startedAt: {
    type: Date,
    required: true,
  },
});

const Countdown = mongoose.model('Countdown', countdownSchema);

export default Countdown;
