'use client';

import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { useAuth } from '@/context/AuthContext';
import { Wallet, History, TrendingUp, Gift, ArrowDownToLine, Shield } from 'lucide-react';
import Link from 'next/link';

const CASHBACK_OFFERS = [
  { store: 'Electronics', logo: '📱', cashback: '10%', max: '₹500', expires: '3 days left' },
  { store: 'Fashion', logo: '👗', cashback: '8%', max: '₹300', expires: '5 days left' },
  { store: 'Groceries', logo: '🛒', cashback: '5%', max: '₹100', expires: 'Today only' },
  { store: 'Travel', logo: '✈️', cashback: '12%', max: '₹1000', expires: '7 days left' },
  { store: 'Food Order', logo: '🍕', cashback: '15%', max: '₹150', expires: '2 days left' },
  { store: 'Recharge', logo: '📞', cashback: '3%', max: '₹50', expires: 'Always on' },
];

const CASHBACK_HISTORY = [
  { date: '22 Jun 2026', store: 'Electronics Store', amount: '+₹120', status: 'Confirmed', color: 'text-emerald-400' },
  { date: '20 Jun 2026', store: 'Fashion Mart', amount: '+₹45', status: 'Pending', color: 'text-amber-400' },
  { date: '18 Jun 2026', store: 'Grocery World', amount: '+₹30', status: 'Confirmed', color: 'text-emerald-400' },
  { date: '15 Jun 2026', store: 'Wallet Withdrawal', amount: '-₹500', status: 'Paid', color: 'text-blue-400' },
  { date: '12 Jun 2026', store: 'Travel Booking', amount: '+₹280', status: 'Confirmed', color: 'text-emerald-400' },
];

export default function CashbackPage() {
  const { flags, ready } = useFeatureFlags();
  const { user, profile } = useAuth();

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.cashbackModule) return <FeatureBlocked title="Cashback" message="The cashback module is currently disabled by the administrator." />;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-300 mb-2">Cashback Central</p>
          <h1 className="text-3xl font-bold text-white">Your Cashback Hub</h1>
          <p className="text-slate-400 mt-2">Earn real cashback on every purchase. No codes needed.</p>
        </div>

        {/* Wallet Card */}
        <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-900/40 to-slate-900/80 p-8 shadow-glow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-300">
                <Wallet size={18} />
                <span className="text-sm font-medium">Cashback Wallet</span>
              </div>
              <p className="text-5xl font-bold text-white">₹{user ? (profile?.cashbackBalance ?? 475).toLocaleString() : '—'}</p>
              <p className="text-sm text-slate-400">{user ? 'Available for withdrawal or shopping' : 'Login to see your balance'}</p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {user ? (
                <>
                  <button className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow">
                    <ArrowDownToLine size={15} /> Withdraw
                  </button>
                  <button className="rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 transition">
                    Use for Shopping
                  </button>
                </>
              ) : (
                <Link href="/login" className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white text-center hover:bg-brand-400 transition">
                  Login to Withdraw
                </Link>
              )}
            </div>
          </div>

          {user && (
            <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">₹1,240</p>
                <p className="text-xs text-slate-400 mt-1">Total Earned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">₹765</p>
                <p className="text-xs text-slate-400 mt-1">Total Redeemed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">₹320</p>
                <p className="text-xs text-slate-400 mt-1">Pending</p>
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Shield size={20} />, title: 'Shop on Munjum', desc: 'Buy through our platform' },
            { icon: <TrendingUp size={20} />, title: 'Cashback Applied', desc: 'Automatically tracked' },
            { icon: <History size={20} />, title: 'Confirmed in 7 days', desc: 'After delivery confirmed' },
            { icon: <Gift size={20} />, title: 'Withdraw Anytime', desc: 'UPI, Bank, Paytm' },
          ].map(s => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-2">
              <span className="text-brand-400">{s.icon}</span>
              <p className="text-sm font-semibold text-white">{s.title}</p>
              <p className="text-xs text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Top Cashback Offers */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Top Cashback Offers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CASHBACK_OFFERS.map(offer => (
              <div key={offer.store} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 flex items-center gap-4 hover:border-brand-500/30 transition">
                <span className="text-4xl">{offer.logo}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{offer.store}</p>
                  <p className="text-xl font-bold text-brand-400">{offer.cashback}</p>
                  <p className="text-xs text-slate-500">Max {offer.max} · {offer.expires}</p>
                </div>
                <Link href="/shop" className="rounded-xl bg-brand-500/20 px-3 py-1.5 text-xs font-semibold text-brand-300 hover:bg-brand-500/30 transition">
                  Shop
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        {user && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Cashback History</h2>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
              <div className="divide-y divide-white/10">
                {CASHBACK_HISTORY.map(tx => (
                  <div key={tx.date + tx.store} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{tx.store}</p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.color}`}>{tx.amount}</p>
                      <p className="text-xs text-slate-500">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
