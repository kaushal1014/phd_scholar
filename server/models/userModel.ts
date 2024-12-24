import mongoose, { Schema, Document } from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phdScholar: { // Simulate a foreign key by referencing the PhD scholar
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhdScholar',
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;