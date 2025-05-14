import mongoose from 'mongoose';

const votingSchema = new mongoose.Schema({
  firstOption: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  secondOption: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    validate: {
      validator: function (v) {
        return this.secondOption !== 'yes' || v !== undefined;
      },
      message: 'Number is required when secondOption is "yes".',
    },
  },
});

const Voting = mongoose.model('Voting', votingSchema);

export default Voting;
