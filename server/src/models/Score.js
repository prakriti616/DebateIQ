const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  debateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Debate', required: true },
  sender: { type: String, enum: ['User', 'AI'], required: true },
  clarity: { type: Number, default: 0 },
  relevance: { type: Number, default: 0 },
  logic: { type: Number, default: 0 },
  evidence: { type: Number, default: 0 },
  persuasion: { type: Number, default: 0 }
});

module.exports = mongoose.model('Score', scoreSchema);
