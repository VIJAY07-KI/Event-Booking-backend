import Booking from '../Models/BookingModel.js';
import Event from '../Models/EventModel.js'; // if needed
import { validationResult } from 'express-validator';

const bookingCtrl = {};

// 1. List all bookings
bookingCtrl.list = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title location date bookedSeats');
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

//  2. Create a booking
// bookingCtrl.create = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { event, seats, totalAmount } = req.body;
//   const user = req.userId;

//   try {
//     //  Validate event existence
//     const foundEvent = await Event.findById(event);
//     if (!foundEvent) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     //  Check for already booked seats
//     const existingBookings = await Booking.find({
//       event,
//       seats: { $in: seats },
//     });

//     const alreadyBooked = existingBookings.flatMap(b => b.seats).filter(seat => seats.includes(seat));

//     if (alreadyBooked.length > 0) {
//       return res.status(400).json({
//         error: 'Some seats are already booked',
//         alreadyBooked,
//       });
//     }

//     //  Proceed with booking
//     const booking = await Booking.create({
//       user,
//       event,
//       seats,
//       totalAmount,
//       paymentStatus: 'pending',
//     });

//     res.status(201).json({
//       message: 'Booking successful',
//       booking,
//     });
//   } catch (err) {
//     console.log('Create Booking Error:', err);
//     res.status(500).json({ error: 'Something went wrong during booking' });
//   }
// };
bookingCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { event, seats, totalAmount } = req.body;
    // user = req.userId;

  try {
    // 1. Validate event existence
    const foundEvent = await Event.findById(event);
    if (!foundEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // 2. Check for already booked seats (optional if you trust Event.bookedSeats)
    const existingBookings = await Booking.find({
      event,
      seats: { $in: seats },
    });

    const alreadyBooked = existingBookings.flatMap(b => b.seats).filter(seat => seats.includes(seat));

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        error: 'Some seats are already booked',
        alreadyBooked,
      });
    }

    // 3. Proceed with booking
    const booking = await Booking.create({
      user:req.userId,
      event,
      seats,
      totalAmount,
      paymentStatus: 'pending',
    });

    // 4. Update Event.bookedSeats array
    await Event.findByIdAndUpdate(event, {
      $push: { bookedSeats: { $each: seats } }
    });

    res.status(201).json({
      message: 'Booking successful',
      booking,
    });
  } catch (err) {
    console.log('Create Booking Error:', err);
    res.status(500).json({ error: 'Something went wrong during booking' });
  }
};


// 3. Show a single booking
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
    console.log('Show Booking Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// 4. Update a booking (e.g. payment status)
bookingCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const updates = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking updated successfully',
      booking,
    });
  } catch (err) {
    console.log('Update Booking Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

//  5. Delete a booking
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

    res.json({
      message: 'Booking removed successfully',
      booking,
    });
  } catch (err) {
    console.log('Delete Booking Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
// GET /booking/event/:eventId
bookingCtrl.getBookingsByEvent = async (req, res) => {
  const  id  = req.params.id

  try {
    const bookings = await Booking.find({ event: id });
    res.json(bookings);
  } catch (err) {
    console.log('Get Bookings by Event Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


export default bookingCtrl;
