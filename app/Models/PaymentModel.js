import {Schema,model} from 'mongoose';

const paymentSchema = new Schema({
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

const Payment = model('Payment', paymentSchema);
export default Payment;
