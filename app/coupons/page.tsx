'use client';

import { useState } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { Tag, Copy, Clock, Percent, ExternalLink, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const COUPON_CATEGORIES = ['All', 'Electronics', 'Fashion', 'Food', 'Travel', 'Recharge', 'Grocery'];

const COUPONS = [
  { id: '1', code: 'SAVE200', store: 'Electronics Store', desc: 'Get ₹200 off on orders above ₹1999', discount: '₹200 OFF', category: 'Electronics', expires: '2026-06-25', used: 4200, minOrder: 1999 },
  { id: '2', code: 'FASHION30', store: 'Fashion Hub', desc: '30% off on all fashion items', discount: '30% OFF', category: 'Fashion', expires: '2026-06-28', used: 2800, minOrder: 599 },
  { id: '3', code: 'FOOD50', store: 'FoodMart', desc: 'Flat ₹50 off on first food order', discount: '₹50 OFF', category: 'Food', expires: '2026-06-22', used: 8100, minOrder: 199, isNew: true },
  { id: '4', code: 'TRAVEL1K', store: 'Munjum Travel', desc: 'Save ₹1000 on flight booking above ₹5000', discount: '₹1000 OFF', category: 'Travel', expires: '2026-07-01', used: 560, minOrder: 5000 },
  { id: '5', code: 'RECHARGE5', store: 'Munjum Recharge', desc: '5% extra cashback on prepaid recharge', discount: '5% Cashback', category: 'Recharge', expires: '2026-06-30', used: 12000, minOrder: 0 },
  { id: '6', code: 'GROCERY15', store: 'Grocery World', desc: '15% off on groceries min ₹500', discount: '15% OFF', category: 'Grocery', expires: '2026-06-24', used: 3400, minOrder: 500 },
  { id: '7', code: 'NEWUSER100', store: 'Munjum', desc: 'Welcome offer: ₹100 cashback for new users', discount: '₹100 Cashback', category: 'All', expires: '2026-12-31', used: 25000, isNew: true, minOrder: 299 },
  { id: '8', code: 'TECH500', store: 'TechZone', desc: '₹500 off on gadgets above ₹3999', discount: '₹500 OFF', category: 'Electronics', expires: '2026-06-26', used: 890, minOrder: 3999 },
];

function daysLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Expired';
  if (days === 1) return 'Expires today!';
  return `${days} days left`;
}

export default function CouponsPage() {
  const { flags, ready } = useFeatureFlags();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQ, setSearchQ] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.couponsModule) return <FeatureBlocked title="Coupons" message="The coupons module is currently disabled by the administrator." />;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      toast.success(`Coupon code "${code}" copied!`);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const filtered = COUPONS.filter(c => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchQ = !searchQ || c.code.toLowerCase().includes(searchQ.toLowerCase()) || c.store.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 px-4 py-10 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-2 text-sm font-medium text-brand-200 mb-4">
          <Tag size={14} /> Exclusive Coupon Codes
        </span>
        <h1 className="text-3xl font-bold text-white">Today's Best Coupons</h1>
        <p className="text-slate-400 mt-2">Verified coupon codes updated daily. Never miss a deal.</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search coupons by store or code..."
            className="w-full rounded-2xl border border-white/10 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {COUPON_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${activeCategory === cat ? 'bg-brand-500 text-white' : 'border border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500">{filtered.length} coupons found</p>

        {/* Coupon Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(coupon => {
            const expiry = daysLeft(coupon.expires);
            const isExpired = expiry === 'Expired';
            const isUrgent = expiry.includes('today') || expiry === '1 days left';

            return (
              <div
                key={coupon.id}
                className={`relative rounded-2xl border bg-slate-900/60 overflow-hidden transition ${isExpired ? 'opacity-60 border-white/5' : 'border-white/10 hover:border-brand-500/30'}`}
              >
                {coupon.isNew && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">NEW</div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-slate-500">{coupon.store}</p>
                      <p className="text-xl font-bold text-brand-400 mt-0.5">{coupon.discount}</p>
                    </div>
                    <span className="text-2xl">
                      <Percent size={24} className="text-slate-600" />
                    </span>
                  </div>

                  <p className="text-sm text-slate-300">{coupon.desc}</p>
                  {coupon.minOrder > 0 && (
                    <p className="text-xs text-slate-500">Min. order: ₹{coupon.minOrder}</p>
                  )}

                  <div className="flex items-center gap-1 text-xs">
                    <Clock size={11} className={isUrgent ? 'text-red-400' : 'text-slate-500'} />
                    <span className={isUrgent ? 'text-red-400 font-medium' : 'text-slate-500'}>{expiry}</span>
                    <span className="ml-auto text-slate-600">{coupon.used.toLocaleString()} used</span>
                  </div>

                  {/* Coupon code box */}
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-brand-500/40 bg-brand-500/5 px-3 py-2">
                    <code className="flex-1 text-sm font-bold text-brand-300 tracking-wider">{coupon.code}</code>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      disabled={isExpired}
                      className={`flex items-center gap-1 text-xs font-medium rounded-lg px-2 py-1 transition ${copied === coupon.code ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Copy size={11} />
                      {copied === coupon.code ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <a
                    href="/shop"
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-brand-500/20 py-2 text-xs font-semibold text-brand-300 hover:bg-brand-500/30 transition"
                  >
                    Shop Now <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-slate-500">
            <Tag size={40} className="mb-4 opacity-30" />
            <p className="text-sm">No coupons found for this filter.</p>
          </div>
        )}
      </div>
    </main>
  );
}
