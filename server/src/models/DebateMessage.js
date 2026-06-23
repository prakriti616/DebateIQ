const mongoose = require('mongoose');

const debateMessageSchema = new mongoose.Schema({
  debateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Debate', required: true },
  sender: { type: String, enum: ['User', 'AI'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DebateMessage', debateMessageSchema);
