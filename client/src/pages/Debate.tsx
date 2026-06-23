import { useEffect, useMemo, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function Debate() {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [topic, setTopic] = useState('AI should replace teachers');
  const [side, setSide] = useState('For');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [timeLimit, setTimeLimit] = useState('5 mins');
  const [score, setScore] = useState<any>(null);
  const [debateId, setDebateId] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    if (!debateId) return;
    socket.emit('joinDebate', { debateId });
    socket.on('receiveMessage', (message: any) => {
      setMessages((prev) => [...prev, message]);
      if (message.sender === 'AI' && isAISpeaking) {
        try {
          const utter = new SpeechSynthesisUtterance(message.content);
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        } catch (e) {
          // ignore
        }
      }
    });
    return () => {
      socket.off('receiveMessage');
    };
  }, [debateId, isAISpeaking]);

  const startDebate = async () => {
    setStatus('Starting debate...');
    const response = await fetch('/api/debate/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ topic, side, difficulty, timeLimit })
    });
    if (!response.ok) {
      setStatus('Unable to start debate. Please login again.');
      return;
    }
    const data = await response.json();
    setDebateId(data.debate._id);
    setMessages([]);
    setScore(null);
    setStatus('Debate started. Send your first argument.');
  };

  const sendMessage = async (overrideContent?: string) => {
    const contentToSend = overrideContent ?? message;
    if (!debateId) {
      setStatus('Start the debate first.');
      return;
    }
    if (!contentToSend.trim()) {
      setStatus('Please type an argument to send.');
      return;
    }
    const response = await fetch(`/api/debate/${debateId}/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content: contentToSend })
    });
    if (!response.ok) {
      setStatus('Failed to send message.');
      return;
    }
    const data = await response.json();
    setScore(data.analysis);
    setMessage('');
    setStatus('Argument sent. Await AI response.');
  };

  const recognitionRef = useRef<any>(null);

  const startRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('Speech recognition not supported in this browser.');
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setMessage(text);
      sendMessage(text);
    };
    recog.onerror = (e: any) => {
      setStatus('Speech recognition error');
      setIsRecording(false);
    };
    recog.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recog;
    recog.start();
    setIsRecording(true);
    setStatus('Listening...');
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setStatus('');
  };

  const endDebate = async () => {
    if (!debateId) return;
    const response = await fetch(`/api/debate/${debateId}/end`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      setStatus('Could not end debate.');
      return;
    }
    const data = await response.json();
    setScore((current: any) => ({
      ...current,
      debateResult: data.result
    }));
    setStatus('Debate ended. See results below.');
  };

  return (
    <div className="min-h-screen bg-bg-base px-8 py-24 text-zinc-900 font-sans">
      <div className="max-w-6xl mx-auto rounded-[32px] bg-white/90 p-8 shadow-2xl border border-black/5">
        <h1 className="text-3xl font-bold">Debate Arena</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl bg-slate-50 p-6">
            <h2 className="text-xl font-semibold">Debate Controls</h2>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700">Topic</label>
              <select className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3" value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option>AI should replace teachers</option>
                <option>Social media is harmful</option>
                <option>Universal basic income</option>
                <option>Climate change policies</option>
              </select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">Side</label>
                <select className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3" value={side} onChange={(e) => setSide(e.target.value)}>
                  <option>For</option>
                  <option>Against</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Difficulty</label>
                <select className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Time</label>
              <select className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}>
                <option>5 mins</option>
                <option>10 mins</option>
                <option>Unlimited</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-black px-6 py-3 text-sm text-white" onClick={startDebate}>Start Debate</button>
              <button className="rounded-full border border-black px-6 py-3 text-sm text-black" onClick={endDebate}>End Debate</button>
            </div>
            {debateId && <p className="text-sm text-zinc-600">Debate ID: {debateId}</p>}
            {status && <p className="text-sm text-zinc-700">{status}</p>}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm border border-black/5">
              <h2 className="text-xl font-semibold">Live Debate</h2>
              <div className="mt-4 flex gap-3 items-center">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your argument"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                />
                <button
                  title={isRecording ? 'Stop recording' : 'Record voice'}
                  className="rounded-full border border-black/10 px-3 py-2 text-sm"
                  onClick={() => (isRecording ? stopRecognition() : startRecognition())}
                >
                  {isRecording ? 'Stop' : '🎤'}
                </button>
                <button className="rounded-full bg-black px-5 py-3 text-sm text-white" onClick={() => sendMessage()}>Send</button>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <label className="text-sm text-zinc-700">AI Voice:</label>
                <button
                  className={`rounded-full px-3 py-1 text-sm ${isAISpeaking ? 'bg-black text-white' : 'border'}`}
                  onClick={() => setIsAISpeaking((s) => !s)}
                >
                  {isAISpeaking ? 'On' : 'Off'}
                </button>
              </div>
            </div>
            {score && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/5">
                <h3 className="text-lg font-semibold">Argument Analysis</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>Clarity: {score.clarity}</div>
                  <div>Relevance: {score.relevance}</div>
                  <div>Logic: {score.logic}</div>
                  <div>Evidence: {score.evidence}</div>
                  <div>Persuasion: {score.persuasion}</div>
                </div>
                {score.debateResult && (
                  <div className="mt-4 rounded-2xl bg-zinc-950 px-4 py-3 text-sm text-white">
                    <strong>{score.debateResult.winner} wins</strong>: {score.debateResult.reason}
                  </div>
                )}
              </div>
            )}
            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm border border-black/5">
              <h3 className="text-lg font-semibold">Conversation</h3>
              <div className="mt-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-zinc-500">No messages yet.</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="rounded-2xl bg-white p-4 shadow-sm">
                      <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
