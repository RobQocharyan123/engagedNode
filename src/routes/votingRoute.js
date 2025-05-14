import express from 'express';
import Voting from '../models/Voting.js';

const router = express.Router();

// POST /api/vote
router.post('/', async (req, res) => {
  const { firstOption, name, secondOption, number } = req.body;

  // Basic validation
  if (!firstOption || !name || !secondOption) {
    return res
      .status(400)
      .json({ error: 'First option, name, and second option are required.' });
  }

  // If secondOption is "yes", number must be provided
  if (
    secondOption === 'yes' &&
    (number === undefined || number === null || number === '')
  ) {
    return res
      .status(400)
      .json({ error: 'Number is required when secondOption is "yes".' });
  }

  try {
    const newEntry = new Voting({
      firstOption,
      name,
      secondOption,
      number: secondOption === 'yes' ? number : undefined,
    });

    await newEntry.save();

    res.status(201).json({
      message: 'success',
      data: newEntry,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit form.',
      details: error.message,
    });
  }
});

// GET /api/votes - Fetch all votes
router.get('/votes', async (req, res) => {
  try {
    const votes = await Voting.find(); // Fetch all documents from 'Voting' collection
    res.status(200).json(votes); // Send the data to frontend
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve votes.',
      details: error.message,
    });
  }
});

export default router;
