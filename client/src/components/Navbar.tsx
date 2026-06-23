import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = user
    ? [
        { label: 'Dashboard', to: '/home' },
        { label: 'Debate Arena', to: '/debate' }
      ]
    : [
        { label: 'Home', to: '/' },
        { label: 'Login', to: '/login' },
        { label: 'Register', to: '/register' }
      ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-6 md:py-10 bg-gradient-to-b from-[#f1f1f1]/80 to-transparent backdrop-blur-[2px]">
      <div className="grid grid-cols-12 max-w-7xl mx-auto px-6 md:px-8">
        <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-black" />
          <span className="text-xl tracking-[0.15em] font-semibold">DebateIQ</span>
        </div>

        <nav className="hidden md:flex col-span-6 items-center justify-center gap-8 text-sm lowercase text-zinc-600">
          {navLinks.map((item) => (
            <Link key={item.label} to={item.to} className="transition hover:text-zinc-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-4">
          {user ? (
            <>
              <Link to="/debate" className="text-sm lowercase text-zinc-700 hidden md:inline-block">Start debate</Link>
              <button
                onClick={logout}
                className="hidden md:inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hidden md:inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm text-white">
              get started →
            </Link>
          )}
          <button
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-6 bg-black" />
            <span className="block h-0.5 w-6 bg-black mt-1.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-x-0 top-full bg-white/95 backdrop-blur-xl shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-4 lowercase text-sm text-zinc-700">
              {navLinks.map((item) => (
                <Link key={item.label} to={item.to} className="block transition hover:text-zinc-900">
                  {item.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block rounded-full bg-black px-4 py-3 text-center text-sm text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
