const express = require('express');
const mongoose = require('mongoose');
const Debate = require('../models/Debate');
const DebateMessage = require('../models/DebateMessage');
const Score = require('../models/Score');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { analyzeArgument, generateAIResponse, judgeRound, scoreTotal } = require('../utils/ai');

const router = express.Router();
router.use(auth);

router.post('/create', async (req, res) => {
  try {
    const { topic, side, difficulty, timeLimit } = req.body;
    const debate = new Debate({
      userId: req.user._id,
      topic,
      side,
      difficulty,
      timeLimit
    });
    await debate.save();
    res.json({ debate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create debate' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const debates = await Debate.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ debates });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load history' });
  }
});

router.get('/:debateId/messages', async (req, res) => {
  try {
    const { debateId } = req.params;
    const messages = await DebateMessage.find({ debateId }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

router.post('/:debateId/message', async (req, res) => {
  try {
    const { debateId } = req.params;
    const { content } = req.body;
    const debate = await Debate.findById(debateId);
    if (!debate || !debate.userId.equals(req.user._id)) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    const userMessage = new DebateMessage({ debateId, sender: 'User', content });
    await userMessage.save();

    const io = req.app.get('io');
    if (io) {
      io.to(debateId).emit('receiveMessage', userMessage);
    }

    const analysis = analyzeArgument(content);
    const userScore = new Score({ debateId, sender: 'User', ...analysis });
    await userScore.save();

    const aiContent = generateAIResponse({ topic: debate.topic, userContent: content, side: debate.side, difficulty: debate.difficulty });
    const aiMessage = new DebateMessage({ debateId, sender: 'AI', content: aiContent });
    await aiMessage.save();
    if (io) {
      io.to(debateId).emit('receiveMessage', aiMessage);
    }

    const aiAnalysis = analyzeArgument(aiContent);
    const aiScore = new Score({ debateId, sender: 'AI', ...aiAnalysis });
    await aiScore.save();

    res.json({ userMessage, aiMessage, analysis });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' });
  }
});

router.post('/:debateId/end', async (req, res) => {
  try {
    const { debateId } = req.params;
    const scores = await Score.find({ debateId });
    const debate = await Debate.findById(debateId);
    if (!debate || !debate.userId.equals(req.user._id)) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    const userScores = scores.filter((score) => score.sender === 'User');
    const aiScores = scores.filter((score) => score.sender === 'AI');

    const userScore = averageScore(userScores);
    const aiScore = averageScore(aiScores);
    const result = judgeRound(userScore, aiScore);

    debate.winner = result.winner;
    debate.finalScore = Math.round(scoreTotal(userScore));
    await debate.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalDebates: 1,
        wins: result.winner === 'User' ? 1 : 0
      }
    });

    res.json({ result, debate, userScore, aiScore });
  } catch (error) {
    res.status(500).json({ message: 'Failed to end debate' });
  }
});

function averageScore(scores) {
  if (!scores.length) {
    return { clarity: 0, relevance: 0, logic: 0, evidence: 0, persuasion: 0 };
  }
  const total = scores.reduce((acc, score) => ({
    clarity: acc.clarity + score.clarity,
    relevance: acc.relevance + score.relevance,
    logic: acc.logic + score.logic,
    evidence: acc.evidence + score.evidence,
    persuasion: acc.persuasion + score.persuasion
  }), { clarity: 0, relevance: 0, logic: 0, evidence: 0, persuasion: 0 });
  const count = scores.length;
  return {
    clarity: total.clarity / count,
    relevance: total.relevance / count,
    logic: total.logic / count,
    evidence: total.evidence / count,
    persuasion: total.persuasion / count
  };
}

module.exports = router;
