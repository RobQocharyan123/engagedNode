import express from 'express';
import Voting from '../models/Voting.js';
import Countdown from '../models/Countdown.js';

const router = express.Router();

// POST /api/vote
router.post('/vote', async (req, res) => {
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
    // Build the filter object for counting existing votes
    const filter = { firstOption, name, secondOption };

    // Include number only if secondOption === 'yes' (to match your model)
    if (secondOption === 'yes') {
      filter.number = number;
    }

    // Count how many times this exact combination has voted
    const voteCount = await Voting.countDocuments(filter);

    if (voteCount >= 3) {
      return res.status(403).json({
        error:
          'You have reached the maximum vote limit (3) for this combination.',
      });
    }

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

// DELETE /api/vote/:id - Delete a vote by ID  for ADMIN_PANEL
router.delete('/vote/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Voting.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res
      .status(200)
      .json({ message: 'Vote deleted successfully', status: 'ok' });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete vote',
      details: error.message,
    });
  }
});

// http://localhost:5000/api/votes?status=1&search_data=John
// GET /api/votes - Fetch all votes for ADMIN_PANEL
router.get('/votes', async (req, res) => {
  try {
    const { search_data = '', status } = req.query;

    const query = {};

    if (status === '2') {
      query.firstOption = 'boy';
    } else if (status === '3') {
      query.firstOption = 'girl';
    }

    if (search_data) {
      query.name = { $regex: search_data, $options: 'i' };
    }

    const votes = await Voting.find(query);

    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve votes.',
      details: error.message,
    });
  }
});

router.get('/remaining-time', async (req, res) => {
  try {
    // Get countdown document (create if it doesn't exist)
    let countdown = await Countdown.findOne();

    if (!countdown) {
      // First time setup
      countdown = new Countdown({ startedAt: new Date() });
      await countdown.save();
    }

    const now = Date.now();
    const startedAt = new Date(countdown.startedAt).getTime();
    const elapsed = now - startedAt;
    const remaining = Math.max(0, process.env.COUNTDOWN_DURATION - elapsed);

    res.json({ remaining_time_milliseconds: remaining });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate remaining time' });
  }
});

export default router;
