import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event'},
  seats: [],
  totalAmount:  Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'Success'],
    default: 'pending'
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
