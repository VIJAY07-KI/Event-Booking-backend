import Booking from '../Models/BookingModel.js';
import { validationResult } from 'express-validator';

const bookingCtrl = {};

// List all bookings
bookingCtrl.list = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')  // populate user info
      .populate('event', 'title location date');  // populate event info
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
// booking create


bookingCtrl.create = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { event, seats, totalAmount } = req.body
  const user = req.userId  

  try {
    const booking = await Booking.create({
      user,
      event,
      seats,
      totalAmount,
      paymentStatus: 'pending',
    })
    res.status(201).json(booking)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}


// Show a single booking by ID
bookingCtrl.show = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  try {
    const booking = await Booking.findById(id)
      .populate('user', 'name email')
      .populate('event', 'title date location');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update payment status (or other fields if needed)
bookingCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const body = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Delete a booking
bookingCtrl.remove = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  try {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking removed successfully', booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default bookingCtrl;
