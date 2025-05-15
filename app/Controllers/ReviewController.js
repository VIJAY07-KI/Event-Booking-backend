import Review from '../Models/ReviewModel.js';
import { validationResult } from 'express-validator';

const reviewCtrl = {};

// List all reviews or filter by event ID (if provided)
reviewCtrl.list = async (req, res) => {
  try {
    const filter = req.query.event ? { event: req.query.event } : {};
    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('event', 'title');
    res.json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Create a review
reviewCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { event, user, rating, comment } = req.body;

  try {
    // Prevent duplicate review by the same user on same event
    const existingReview = await Review.findOne({ event, user });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this event' });
    }

    const review = await Review.create({ event, user, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Show a single review
reviewCtrl.show = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  try {
    const review = await Review.findById(id)
      .populate('user', 'name')
      .populate('event', 'title');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update a review
reviewCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const body = req.body;

  try {
    const review = await Review.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Delete a review
reviewCtrl.remove = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully', review });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default reviewCtrl;
