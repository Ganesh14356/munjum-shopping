'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      const msg = err.code === 'auth/user-not-found' ? 'No account found with this email'
        : err.code === 'auth/wrong-password' ? 'Incorrect password'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Logged in with Google!');
      router.push('/');
    } catch {
      toast.error('Google login failed. Try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white font-bold text-xl shadow-glow">M</div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to your Munjum account</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 space-y-5">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-slate-800 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-slate-500">or with email</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-400 font-medium hover:text-brand-300 transition">
            Create one free
          </Link>
        </p>
      </div>
    </main>
  );
}
