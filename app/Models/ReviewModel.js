import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  rating: Number,
  comment: String,
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
