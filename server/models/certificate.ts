import mongoose from 'mongoose';

// Define the certificate schema
const certificateSchema = new mongoose.Schema({
  phdScholar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhdScholar",
    required: true,
  },
  courseNumber: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  approvalDate: {
    type: Date,
    default: null,
  },
  rejectionReason: {
    type: String,
    default: "",
  },
})

// Create or get the model
const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema)
export default Certificate