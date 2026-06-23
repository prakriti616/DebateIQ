import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const win: any = window;
      if (!win.google) return;
      win.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse
      });
      win.google.accounts.id.renderButton(document.getElementById('googleSignIn'), { theme: 'outline', size: 'large' });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  async function handleCredentialResponse(response: any) {
    try {
      const id_token = response.credential;
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Google login failed');
      localStorage.setItem('token', data.token);
      // Let AuthProvider pick up user on next render
      navigate('/debate');
    } catch (err: any) {
      console.error(err);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/debate');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg-base px-8 py-24 text-zinc-900 font-sans">
      <div className="mx-auto max-w-md rounded-[32px] bg-white/90 p-10 shadow-2xl border border-black/5">
        <h1 className="text-3xl font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            />
          </div>
          {error && <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <button type="submit" className="w-full rounded-full bg-black px-6 py-3 text-sm text-white">Login</button>
        </form>
        <div className="mt-4">
          <div id="googleSignIn"></div>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-600">
          New here? <Link to="/register" className="font-semibold text-black">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
