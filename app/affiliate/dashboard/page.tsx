'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import Link from 'next/link';
import { TrendingUp, DollarSign, Users, Link2, Copy, ArrowDownToLine, BarChart3, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const STATS = [
  { label: 'Total Earnings', value: '₹12,480', sub: '+₹1,240 this month', icon: <DollarSign size={20} />, color: 'text-emerald-400 bg-emerald-500/10' },
  { label: 'Total Clicks', value: '8,432', sub: '+312 this week', icon: <TrendingUp size={20} />, color: 'text-brand-400 bg-brand-500/10' },
  { label: 'Conversions', value: '156', sub: '1.85% conversion rate', icon: <Users size={20} />, color: 'text-amber-400 bg-amber-500/10' },
  { label: 'Pending Payout', value: '₹3,200', sub: 'Payout on 1st July', icon: <ArrowDownToLine size={20} />, color: 'text-purple-400 bg-purple-500/10' },
];

const RECENT_SALES = [
  { date: '22 Jun', product: 'Wireless Headphones', buyer: '***@gmail.com', commission: '₹100', status: 'Confirmed' },
  { date: '21 Jun', product: 'Running Shoes', buyer: '***@yahoo.com', commission: '₹175', status: 'Confirmed' },
  { date: '20 Jun', product: 'Smart Watch', buyer: '***@outlook.com', commission: '₹300', status: 'Pending' },
  { date: '19 Jun', product: 'Laptop Stand', buyer: '***@gmail.com', commission: '₹45', status: 'Confirmed' },
  { date: '18 Jun', product: 'Coffee Maker', buyer: '***@gmail.com', commission: '₹80', status: 'Confirmed' },
];

const REFERRAL_LINKS = [
  { label: 'Homepage', url: 'https://munjum.in?ref=', clicks: 1240, conversions: 28 },
  { label: 'Electronics Category', url: 'https://munjum.in/shop?cat=electronics&ref=', clicks: 3120, conversions: 68 },
  { label: 'Deals Page', url: 'https://munjum.in/deals?ref=', clicks: 4072, conversions: 60 },
];

export default function AffiliateDashboardPage() {
  const { user, profile } = useAuth();
  const { flags, ready } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'sales' | 'withdraw'>('overview');

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.affiliateModule) return <FeatureBlocked title="Affiliate" message="Affiliate module is disabled." />;

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Login to access your affiliate dashboard</h2>
          <Link href="/login" className="inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">Login</Link>
        </div>
      </main>
    );
  }

  const referralCode = profile?.referralCode ?? 'MUNJUM123';
  const referralBase = `https://munjum.in?ref=${referralCode}`;

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url + referralCode);
    toast.success('Referral link copied!');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Affiliate Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Your code: <code className="text-brand-300 font-mono">{referralCode}</code></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">Gold Tier — 12% Commission</span>
            <button onClick={() => copyLink(referralBase)} className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition">
              <Copy size={13} /> Copy Main Link
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(s => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</span>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-white/10 bg-slate-900/50 p-1 w-fit">
          {(['overview', 'links', 'sales', 'withdraw'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${activeTab === tab ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Performance chart placeholder */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-brand-400" />
                <h3 className="text-base font-semibold text-white">Earnings (Last 7 Days)</h3>
              </div>
              <div className="flex items-end gap-2 h-32">
                {[420, 680, 320, 880, 540, 760, 1240].map((val, i) => (
                  <div key={i} className="flex-1 rounded-t-lg bg-brand-500/60 hover:bg-brand-500 transition" style={{ height: `${(val / 1240) * 100}%` }} title={`₹${val}`} />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>

            {/* Tier Progress */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-base font-semibold text-white">Tier Progress</h3>
              {[
                { tier: 'Starter (5%)', min: 0, max: 10000, current: 10000 },
                { tier: 'Silver (8%)', min: 10000, max: 50000, current: 50000 },
                { tier: 'Gold (12%)', min: 50000, max: 200000, current: 104000 },
                { tier: 'Platinum (15%)', min: 200000, max: 200000, current: 104000 },
              ].map(t => {
                const pct = Math.min(100, Math.round(((t.current - t.min) / (t.max - t.min)) * 100));
                const isActive = t.current >= t.min && t.current < t.max;
                return (
                  <div key={t.tier} className={`space-y-1 ${!isActive && t.current < t.min ? 'opacity-40' : ''}`}>
                    <div className="flex justify-between text-xs">
                      <span className={isActive ? 'text-brand-300 font-semibold' : 'text-slate-400'}>{t.tier}</span>
                      {isActive && <span className="text-slate-400">₹{(t.max - t.current).toLocaleString()} to Platinum</span>}
                    </div>
                    {isActive && (
                      <div className="h-2 rounded-full bg-slate-700">
                        <div className="h-2 rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">Your Referral Links</h3>
            {REFERRAL_LINKS.map(link => (
              <div key={link.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{link.label}</p>
                  <code className="text-xs text-slate-500 break-all">{link.url}{referralCode}</code>
                  <div className="flex gap-4 mt-2 text-xs text-slate-400">
                    <span>{link.clicks.toLocaleString()} clicks</span>
                    <span>{link.conversions} conversions</span>
                    <span className="text-emerald-400">{((link.conversions / link.clicks) * 100).toFixed(1)}% CVR</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyLink(link.url)} className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition">
                    <Copy size={12} /> Copy
                  </button>
                  <a href={link.url + referralCode} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition">
                    <ExternalLink size={12} /> Open
                  </a>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/30 p-5">
              <p className="text-sm text-slate-400 mb-2">Generate a custom product link</p>
              <div className="flex gap-2">
                <input placeholder="Paste any Munjum product URL" className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
                <button onClick={() => toast.success('Custom link generated!')} className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-400 transition">
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-base font-semibold text-white">Recent Sales</h3>
              <span className="text-xs text-slate-500">Last 30 days</span>
            </div>
            <div className="divide-y divide-white/10">
              {RECENT_SALES.map((sale, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">{sale.date.slice(-2)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{sale.product}</p>
                    <p className="text-xs text-slate-500">{sale.buyer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">{sale.commission}</p>
                    <p className={`text-xs ${sale.status === 'Confirmed' ? 'text-emerald-500' : 'text-amber-400'}`}>{sale.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="max-w-md space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-sm text-slate-400">Available Balance</p>
              <p className="text-4xl font-bold text-emerald-400 mt-1">₹9,280</p>
              <p className="text-xs text-slate-500 mt-1">Minimum withdrawal: ₹500</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
              <h3 className="text-base font-semibold text-white">Withdraw Earnings</h3>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Amount (₹)</label>
                <input type="number" placeholder="Enter amount" min={500} className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Withdrawal Method</label>
                <select className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-brand-500">
                  <option>UPI (Instant)</option>
                  <option>Bank Transfer (1-3 days)</option>
                  <option>Paytm Wallet</option>
                </select>
              </div>
              <input placeholder="UPI ID or Account Number" className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
              <button onClick={() => toast.success('Withdrawal request submitted!')} className="w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">
                Request Withdrawal
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
