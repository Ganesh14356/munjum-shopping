'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

type Role = 'customer' | 'affiliate' | 'merchant';

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = (params.get('role') as Role) ?? 'customer';

  const [role, setRole] = useState<Role>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill all required fields'); return; }
    if (password !== confirmPwd) { toast.error('Passwords do not match'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (!agreeTerms) { toast.error('Please agree to the Terms of Service'); return; }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });

      const userRef = doc(db, 'users', credential.user.uid);
      await setDoc(userRef, {
        uid: credential.user.uid,
        email,
        displayName: name,
        phone: phone || null,
        role,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referredBy: referralCode || null,
        walletBalance: 0,
        cashbackBalance: 0,
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
      });

      toast.success('Account created! Welcome to Munjum 🎉');
      router.push(role === 'affiliate' ? '/affiliate/dashboard' : role === 'merchant' ? '/merchant/dashboard' : '/');
    } catch (err: any) {
      const msg = err.code === 'auth/email-already-in-use' ? 'This email is already registered'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', credential.user.uid);
      await setDoc(userRef, {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName,
        photoURL: credential.user.photoURL,
        role,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        walletBalance: 0,
        cashbackBalance: 0,
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      toast.success('Registered with Google!');
      router.push('/');
    } catch {
      toast.error('Google sign-up failed.');
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white font-bold text-xl shadow-glow">M</div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-slate-400">Join Munjum — Shop Smart, Earn More</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 space-y-5">
          {/* Role selector */}
          <div>
            <label className="text-xs text-slate-400 block mb-2">I want to join as</label>
            <div className="grid grid-cols-3 gap-2">
              {(['customer', 'affiliate', 'merchant'] as Role[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl py-2.5 text-xs font-semibold capitalize transition border ${role === r ? 'border-brand-500 bg-brand-500/20 text-brand-300' : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'}`}
                >
                  {r === 'customer' ? '🛍️ ' : r === 'affiliate' ? '🤝 ' : '🏪 '}{r}
                </button>
              ))}
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-slate-800 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-slate-500">or with email</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Phone (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-9 pr-9 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Repeat password" className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Referral Code (optional)</label>
              <input value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="Enter referral code for bonus cashback" className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-0.5 accent-brand-500" />
              <span className="text-xs text-slate-400">
                I agree to Munjum's{' '}
                <Link href="/terms" className="text-brand-400 hover:text-brand-300">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-brand-400 hover:text-brand-300">Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 font-medium hover:text-brand-300 transition">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
