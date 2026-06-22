'use client';

import { useState, useEffect } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { Zap, Timer, Star, ShoppingCart, TrendingUp, Flame } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const FLASH_DEALS = [
  { id: '1', name: 'boAt Airdopes 141', price: 899, mrp: 3499, sold: 78, total: 100, rating: 4.4, cashback: 8 },
  { id: '2', name: 'Redmi 14C 6GB/128GB', price: 8499, mrp: 12999, sold: 45, total: 60, rating: 4.2, cashback: 5 },
  { id: '3', name: 'Prestige Induction Cooktop', price: 1299, mrp: 2999, sold: 22, total: 30, rating: 4.5, cashback: 10 },
];

const TRENDING_DEALS = [
  { id: 'td1', name: 'Apple iPhone 13 (Renewed)', originalPrice: 39999, price: 28999, category: 'Electronics', rating: 4.6, cashback: 3 },
  { id: 'td2', name: 'Levi\'s Men\'s Regular Jeans', originalPrice: 3999, price: 1599, category: 'Fashion', rating: 4.3, cashback: 6 },
  { id: 'td3', name: 'Dyson V11 Vacuum (Refurb)', originalPrice: 35999, price: 22999, category: 'Home', rating: 4.7, cashback: 5 },
  { id: 'td4', name: 'Sony WH-1000XM5 Headphones', originalPrice: 29990, price: 19990, category: 'Electronics', rating: 4.8, cashback: 8 },
  { id: 'td5', name: 'Nike Air Max 270', originalPrice: 11995, price: 7995, category: 'Fashion', rating: 4.4, cashback: 7 },
  { id: 'td6', name: 'Instant Pot Duo 7-in-1', originalPrice: 8999, price: 4999, category: 'Home', rating: 4.6, cashback: 9 },
];

const CATEGORIES_DEALS = [
  { label: 'Electronics', emoji: '📱', deals: 142 },
  { label: 'Fashion', emoji: '👗', deals: 98 },
  { label: 'Home & Kitchen', emoji: '🏠', deals: 76 },
  { label: 'Beauty', emoji: '💄', deals: 54 },
  { label: 'Sports', emoji: '⚽', deals: 38 },
  { label: 'Books', emoji: '📚', deals: 25 },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ h: 0, m: 0, s: 0 });
      setTimeLeft({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      });
    };
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

const FLASH_END = new Date(Date.now() + 4 * 3_600_000 + 23 * 60_000);

function FlashCard({ deal }: { deal: typeof FLASH_DEALS[0] }) {
  const pct = Math.round((deal.sold / deal.total) * 100);
  const discount = Math.round(((deal.mrp - deal.price) / deal.mrp) * 100);

  return (
    <div className="rounded-2xl border border-brand-500/30 bg-slate-900/80 overflow-hidden">
      <div className="h-36 bg-slate-800 flex items-center justify-center text-5xl relative">
        🛍️
        <span className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">-{discount}%</span>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm font-medium text-white line-clamp-2">{deal.name}</p>
        <div className="flex items-end gap-2">
          <span className="text-xl font-bold text-white">₹{deal.price.toLocaleString()}</span>
          <span className="text-xs text-slate-500 line-through">₹{deal.mrp.toLocaleString()}</span>
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Sold: {deal.sold}/{deal.total}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700">
            <div className="h-2 rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button
          onClick={() => toast.success('Added to cart!')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-2 text-sm font-semibold text-white hover:bg-brand-400 transition"
        >
          <ShoppingCart size={14} /> Buy Now
        </button>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const { flags, ready } = useFeatureFlags();
  const countdown = useCountdown(FLASH_END);

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.dealsModule) return <FeatureBlocked title="Deals" message="The deals module is currently disabled by the administrator." />;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Flash Sale Banner */}
      <section className="bg-gradient-to-r from-red-900/60 to-brand-900/60 border-b border-red-500/20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Zap size={28} className="text-yellow-400" fill="currentColor" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-300">Limited Time</p>
                <h1 className="text-2xl font-bold text-white">Flash Sale — Ends In</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[
                { val: String(countdown.h).padStart(2, '0'), label: 'Hours' },
                { val: String(countdown.m).padStart(2, '0'), label: 'Minutes' },
                { val: String(countdown.s).padStart(2, '0'), label: 'Seconds' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="rounded-xl bg-slate-950/60 border border-red-500/20 p-3 text-center min-w-[60px]">
                    <p className="text-3xl font-bold text-white font-mono">{t.val}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.label}</p>
                  </div>
                  {i < 2 && <span className="text-2xl font-bold text-red-400">:</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FLASH_DEALS.map(d => <FlashCard key={d.id} deal={d} />)}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Category Deals */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Flame size={20} className="text-orange-400" />
            <h2 className="text-xl font-bold text-white">Deals by Category</h2>
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES_DEALS.map(c => (
              <Link
                key={c.label}
                href={`/shop?category=${c.label}`}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-center hover:border-brand-500/30 hover:bg-slate-800/60 transition"
              >
                <div className="text-3xl mb-2">{c.emoji}</div>
                <p className="text-sm font-medium text-white">{c.label}</p>
                <p className="text-xs text-brand-400 mt-1">{c.deals} deals</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Deals */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-brand-400" />
            <h2 className="text-xl font-bold text-white">Trending Deals</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRENDING_DEALS.map(deal => {
              const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
              return (
                <div key={deal.id} className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-brand-500/30 transition group">
                  <div className="h-32 bg-slate-800 flex items-center justify-center text-4xl relative">
                    🛍️
                    <span className="absolute top-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">-{discount}%</span>
                    <span className="absolute top-2 right-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-xs text-slate-300">{deal.category}</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-medium text-white line-clamp-2 group-hover:text-brand-300 transition">{deal.name}</p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < Math.floor(deal.rating) ? 'text-amber-400' : 'text-slate-600'} fill={i < Math.floor(deal.rating) ? 'currentColor' : 'none'} />)}
                      <span className="text-xs text-slate-400 ml-1">{deal.rating}</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-lg font-bold text-white">₹{deal.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 line-through">₹{deal.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-400">+{deal.cashback}% cashback</span>
                      <button onClick={() => toast.success('Added!')} className="rounded-lg bg-brand-500 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-400 transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
