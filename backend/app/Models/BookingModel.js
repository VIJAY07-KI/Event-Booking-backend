import {Schema,model}from 'mongoose';

const bookingSchema = new Schema({
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

const Booking = model('Booking', bookingSchema);
export default Booking;
