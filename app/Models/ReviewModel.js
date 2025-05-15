import {Schema,model} from 'mongoose';

const reviewSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  rating: Number,
  comment: String,
}, { timestamps: true });

const Review = model('Review', reviewSchema);
export default Review;
