'use client';

import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Users, TrendingUp, DollarSign, Link2, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

const HOW_IT_WORKS = [
  { step: 1, title: 'Register as Affiliate', desc: 'Sign up for free and get approved within 24 hours.' },
  { step: 2, title: 'Get Your Referral Link', desc: 'Access your unique referral link from your dashboard.' },
  { step: 3, title: 'Share & Promote', desc: 'Share on WhatsApp, Instagram, YouTube, or your blog.' },
  { step: 4, title: 'Earn Commission', desc: 'Earn up to 15% commission on every successful purchase.' },
];

const FEATURES = [
  { icon: <DollarSign size={20} />, title: 'Up to 15% Commission', desc: 'Earn on every product your referral purchases.' },
  { icon: <Link2 size={20} />, title: 'Instant Referral Links', desc: 'Generate short links for any product or category.' },
  { icon: <BarChart3 size={20} />, title: 'Real-time Analytics', desc: 'Track clicks, conversions, and earnings live.' },
  { icon: <TrendingUp size={20} />, title: 'Leaderboard Bonuses', desc: 'Top affiliates earn monthly performance bonuses.' },
  { icon: <Users size={20} />, title: 'Multi-level Earning', desc: 'Earn from your sub-affiliates too.' },
  { icon: <CheckCircle2 size={20} />, title: 'Instant Withdrawal', desc: 'Withdraw earnings via UPI, Bank, or Paytm.' },
];

const TIERS = [
  { name: 'Starter', commission: '5%', minSales: '₹0', perks: ['Basic dashboard', 'Standard links', 'Monthly payout'] },
  { name: 'Silver', commission: '8%', minSales: '₹10,000', perks: ['Advanced analytics', 'Priority support', 'Bi-weekly payout'], highlight: false },
  { name: 'Gold', commission: '12%', minSales: '₹50,000', perks: ['Custom landing pages', 'Dedicated manager', 'Weekly payout'], highlight: true },
  { name: 'Platinum', commission: '15%', minSales: '₹2,00,000', perks: ['White-label links', 'Special deals access', 'Daily payout'] },
];

export default function AffiliatePage() {
  const { flags, ready } = useFeatureFlags();
  const { user } = useAuth();

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.affiliateModule) return <FeatureBlocked title="Affiliate" message="The affiliate module is currently disabled by the administrator." />;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-2 text-sm font-medium text-brand-200">
            <Users size={14} /> Munjum Affiliate Program
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Earn More by Sharing.<br />
            <span className="text-brand-400">Up to 15% Commission.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of affiliates who earn passive income by promoting Munjum's wide range of products and services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {user ? (
              <Link href="/affiliate/dashboard" className="rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-brand-400 transition">
                Go to Dashboard <ArrowRight className="inline ml-1" size={14} />
              </Link>
            ) : (
              <>
                <Link href="/register?role=affiliate" className="rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-brand-400 transition">
                  Join Free Now
                </Link>
                <Link href="/login" className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition">
                  Already a member? Login
                </Link>
              </>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-slate-400">
            <span>✅ Free to join</span>
            <span>✅ No investment required</span>
            <span>✅ Instant approval</span>
            <span>✅ Withdraw anytime</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: '50,000+', label: 'Active Affiliates' },
            { value: '₹2.4 Cr+', label: 'Commissions Paid' },
            { value: '15%', label: 'Max Commission' },
            { value: '24h', label: 'Approval Time' },
          ].map(s => (
            <div key={s.label} className="space-y-1">
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-brand-300 mb-2">Simple Process</p>
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map(s => (
              <div key={s.step} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-3 hover:border-brand-500/30 transition">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white font-bold text-lg">
                  {s.step}
                </span>
                <h3 className="text-base font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 bg-slate-900/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Everything You Need to Earn</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-2 hover:border-brand-500/30 transition">
                <span className="text-brand-400">{f.icon}</span>
                <h3 className="text-base font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Commission Tiers</h2>
            <p className="text-slate-400 mt-2">Higher sales = higher commissions</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map(tier => (
              <div key={tier.name} className={`rounded-2xl border p-6 space-y-4 ${tier.highlight ? 'border-brand-500/60 bg-brand-500/10 shadow-glow' : 'border-white/10 bg-slate-900/60'}`}>
                {tier.highlight && <span className="text-xs font-bold text-brand-300 uppercase tracking-widest">Most Popular</span>}
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="text-3xl font-bold text-brand-400">{tier.commission}</p>
                <p className="text-xs text-slate-500">Min sales: {tier.minSales}/month</p>
                <ul className="space-y-2">
                  {tier.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-brand-500/10 px-4 py-12 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Start Earning?</h2>
        <p className="text-slate-400 mb-6">Join Munjum's affiliate program today — it's free and takes 2 minutes.</p>
        <Link href={user ? '/affiliate/dashboard' : '/register?role=affiliate'} className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-brand-400 transition">
          Get Started Free <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  );
}
