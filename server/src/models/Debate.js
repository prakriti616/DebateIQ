const mongoose = require('mongoose');

const debateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  side: { type: String, enum: ['For', 'Against'], required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
  timeLimit: { type: String, enum: ['5 mins', '10 mins', 'Unlimited'], default: 'Unlimited' },
  finalScore: { type: Number, default: 0 },
  winner: { type: String, enum: ['User', 'AI', 'Draw'], default: 'Draw' }
}, { timestamps: true });

module.exports = mongoose.model('Debate', debateSchema);
