import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:   String,
  email: String,
  password:  String,
  role: {type:String,enum:['admin','buyer','event-manager']},
  isActive:{type:Boolean,default:false}
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
