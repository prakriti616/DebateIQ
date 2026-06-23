import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type DebateHistory = {
  _id: string;
  topic: string;
  side: string;
  difficulty: string;
  timeLimit: string;
  finalScore: number;
  winner: string;
  createdAt: string;
};

export default function Home() {
  const { user } = useAuth();
  const [history, setHistory] = useState<DebateHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/debate/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data.debates || []);
        }
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-zinc-900 px-8 py-24 font-sans">
      <div className="max-w-5xl mx-auto rounded-[32px] bg-white/90 p-10 shadow-2xl border border-black/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Welcome back{user ? `, ${user.name}` : ''}</h1>
            <p className="mt-4 text-zinc-600">Your AI debate hub with score reports, history, and coaching.</p>
          </div>
          <Link className="rounded-full bg-black px-6 py-3 text-sm text-white" to="/debate">Start debate</Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6 border border-black/5">
            <h2 className="text-lg font-semibold">Current Profile</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 border border-black/5">
            <h2 className="text-lg font-semibold">Quick Start</h2>
            <p className="mt-4 text-sm text-zinc-700">Create a debate, send arguments, score your reasoning, and compete with the AI judge.</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold">Debate History</h2>
          {loading ? (
            <p className="mt-4 text-sm text-zinc-600">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-600">No completed debates yet. Start one now to build your profile.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {history.map((item) => (
                <div key={item._id} className="rounded-3xl bg-white p-6 shadow-sm border border-black/5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-zinc-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                      <h3 className="text-xl font-semibold">{item.topic}</h3>
                    </div>
                    <span className="rounded-full bg-zinc-900 px-3 py-1 text-sm text-white">{item.winner}</span>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm text-zinc-700">
                    <div><strong>Side:</strong> {item.side}</div>
                    <div><strong>Difficulty:</strong> {item.difficulty}</div>
                    <div><strong>Score:</strong> {item.finalScore}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
