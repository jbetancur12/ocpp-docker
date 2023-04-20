import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required',
  },
  address : {
    type: String,
    required: "Address is required"
  },
  city:{
    type: String,
    required: true
  },
  country:{
    type:String,
    required: true
  },
  phone : {
    type: String,
    trim: true,
    required: "Phone is required"
  },
  users:[{
    type: Schema.Types.ObjectId,
    ref: "User" 
  }],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});



export default mongoose.model('Company', CompanySchema);
