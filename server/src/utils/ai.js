function analyzeArgument(text) {
  const normalized = text.toLowerCase();
  const checks = {
    clarity: normalized.length < 25 ? 8 : 7,
    relevance: /ai|teachers|education|learning/.test(normalized) ? 9 : 7,
    logic: /because|therefore|so|however/.test(normalized) ? 8 : 6,
    evidence: /study|research|data|statistics|according/.test(normalized) ? 8 : 5,
    persuasion: /should|must|better|strong|important/.test(normalized) ? 8 : 6
  };
  return checks;
}

function generateAIResponse({ topic, userContent, side, difficulty }) {
  const opponentSide = side === 'For' ? 'Against' : 'For';
  const baseResponse = `I appreciate that point, but the ${opponentSide.toLowerCase()} position is stronger here.`;

  if (difficulty === 'Beginner') {
    return `${baseResponse} Teachers bring emotional support and real-time guidance.`;
  }

  if (difficulty === 'Intermediate') {
    return `${baseResponse} For example, human mentors understand context and can adapt to student goals.`;
  }

  return `${baseResponse} In fact, research shows AI cannot replicate mentorship, empathy, or classroom social dynamics.`;
}

function judgeRound(userScore, aiScore) {
  const userTotal = userScore ? scoreTotal(userScore) : 0;
  const aiTotal = aiScore ? scoreTotal(aiScore) : 0;
  if (userTotal > aiTotal) {
    return { winner: 'User', reason: 'Your argument showed stronger logic and relevance.' };
  }
  if (aiTotal > userTotal) {
    return { winner: 'AI', reason: 'The AI offered stronger evidence and counterarguments.' };
  }
  return { winner: 'Draw', reason: 'Both sides were evenly matched.' };
}

function scoreTotal(score) {
  return (score.clarity * 0.2) + (score.logic * 0.3) + (score.relevance * 0.15) + (score.evidence * 0.25) + (score.persuasion * 0.1);
}

module.exports = { analyzeArgument, generateAIResponse, judgeRound, scoreTotal };
