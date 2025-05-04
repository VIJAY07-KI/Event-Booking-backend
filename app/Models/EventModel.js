import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title:  String,
  description: String,
  posterImage: String, 
  location:  String,
  date: Date,
  time:  String,
  pricePerSeat: Number,
  totalSeats:  Number,
  bookedSeats: [],
  averageRating: Number,
  numReviews: Number,
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
