import Payment from '../Models/PaymentModel.js';
import { validationResult } from 'express-validator';
import razorpay from '../../Utils/razorpay.js';

const paymentCtrl = {};

// List all payments
paymentCtrl.list = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('booking');
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Create a new payment
paymentCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = req.body;

  try {
    const payment = await Payment.create(body);
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Show a specific payment by ID
paymentCtrl.show = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  try {
    const payment = await Payment.findById(id)
      .populate('user', 'name email')
      .populate('booking');
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update a payment
paymentCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const body = req.body;

  try {
    const payment = await Payment.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Delete a payment
paymentCtrl.remove = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  try {
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully', payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

paymentCtrl.createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR', buyer, seller, equipmentId } = req.body;

  if (!amount || !buyer || !seller || !equipmentId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const options = {
      amount: amount * 100, // Razorpay takes amount in paisa
      currency,
      receipt:` receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Optionally save order details in DB
    const payment = await Payment.create({
      user,
      booking,
      amount,
      paymentMethod: 'razorpay',
      Status: 'pending'
    });

    res.status(201).json({
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      payment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
};



paymentCtrl.verifyRazorpayPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
  
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      return res.status(400).json({ error: 'Missing required fields for verification' });
    }
  
    try {
      const body = `${razorpay_order_id}`|`${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
  
      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid signature' });
      }
  
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }
  
      payment.paymentStatus = 'completed';
      payment.razorpay_order_id = razorpay_order_id;
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.razorpay_signature = razorpay_signature;
  
      await payment.save();
  
      res.status(200).json({ message: 'Payment verified and recorded successfully', payment });
    } catch (err) {
      console.error('Verification error:', err);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  };


export default paymentCtrl;
