'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email address'); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      const msg = err.code === 'auth/user-not-found' ? 'No account found with this email'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : 'Failed to send reset email. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft size={15} /> Back to Login
        </Link>

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white font-bold text-xl shadow-glow">M</div>
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="text-sm text-slate-400">Enter your email to receive a reset link</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
              <h2 className="text-lg font-semibold text-white">Check your inbox</h2>
              <p className="text-sm text-slate-400">We've sent a password reset link to <strong className="text-white">{email}</strong>. Check spam if you don't see it.</p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="text-sm text-brand-400 hover:text-brand-300 transition"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
