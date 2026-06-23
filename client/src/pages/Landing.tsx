import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

export default function Landing() {
  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl bg-white/85 p-8 shadow-xl border border-black/5">
            <h2 className="text-2xl font-semibold">AI Debate Simulator</h2>
            <p className="mt-4 text-sm text-zinc-600">Practice debates with real-time feedback, scoring, and AI judge analysis.</p>
          </div>
          <div className="rounded-3xl bg-white/85 p-8 shadow-xl border border-black/5">
            <h2 className="text-2xl font-semibold">Track Progress</h2>
            <p className="mt-4 text-sm text-zinc-600">Store debate history, scores, and improvement insights over time.</p>
          </div>
          <div className="rounded-3xl bg-white/85 p-8 shadow-xl border border-black/5">
            <h2 className="text-2xl font-semibold">Logical Fallacy Detection</h2>
            <p className="mt-4 text-sm text-zinc-600">Get help identifying your weak points and more.</p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link to="/login" className="rounded-full bg-black px-6 py-3 text-sm text-white">Login</Link>
          <Link to="/debate" className="rounded-full border border-black px-6 py-3 text-sm text-zinc-900">Start Debate</Link>
        </div>
      </div>
    </div>
  );
}
