import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  booking: { type:Schema.Types.ObjectId, ref: 'Booking' },
  paymentId: String,
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  amount: Number,
  paymentMethod: String 
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
