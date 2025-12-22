const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  requester: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String
  },
  recipientName: { type: String, required: true },
  recipientDistrict: { type: String, required: true },
  recipientUpazila: { type: String, required: true },
  hospitalName: { type: String, required: true },
  fullAddress: { type: String, required: true },
  bloodGroup: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true 
  },
  donationDate: { type: Date, required: true },
  donationTime: { type: String, required: true },
  requestMessage: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'inprogress', 'done', 'canceled'], 
    default: 'pending' 
  },
  donor: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, default: null },
    email: { type: String, default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model('DonationRequest', donationSchema);