const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['Student', 'Professional', 'Admin'], default: 'Student' },
  level: { type: String, default: 'Beginner' },
  totalDebates: { type: Number, default: 0 },
  wins: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
