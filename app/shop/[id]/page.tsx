'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, ArrowLeft, Share2, Shield, Truck, RotateCcw, Zap } from 'lucide-react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import toast from 'react-hot-toast';

const PRODUCT = {
  id: '1',
  name: 'Wireless Bluetooth Headphones Pro Max',
  brand: 'SoundElite',
  price: 1999,
  mrp: 4999,
  cashback: 5,
  rating: 4.3,
  reviews: 1240,
  description: 'Experience crystal-clear audio with our premium wireless headphones featuring 40-hour battery life, active noise cancellation, and ultra-comfortable ear cushions. Perfect for work, travel, and everything in between.',
  features: [
    '40-hour battery life',
    'Active Noise Cancellation (ANC)',
    'Bluetooth 5.0 connectivity',
    '40mm premium drivers',
    'Foldable design',
    'Built-in microphone',
  ],
  specifications: {
    'Brand': 'SoundElite',
    'Model': 'Pro Max 2024',
    'Connectivity': 'Bluetooth 5.0',
    'Battery': '40 hours',
    'Weight': '250g',
    'Color': 'Midnight Black',
  },
};

export default function ProductDetailPage() {
  const { flags, ready } = useFeatureFlags();
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.shoppingModule) return <FeatureBlocked title="Shopping" message="Shopping module is disabled." />;

  const discount = Math.round(((PRODUCT.mrp - PRODUCT.price) / PRODUCT.mrp) * 100);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative rounded-3xl border border-white/10 bg-slate-900 flex items-center justify-center h-80 lg:h-[420px]">
              <div className="text-8xl">🎧</div>
              <span className="absolute top-4 left-4 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">
                -{discount}% OFF
              </span>
            </div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 w-16 rounded-xl border border-white/10 bg-slate-900 flex items-center justify-center text-xl cursor-pointer hover:border-brand-500/50 transition">
                  🎧
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-brand-300 uppercase tracking-widest mb-1">{PRODUCT.brand}</p>
              <h1 className="text-2xl font-bold text-white leading-snug">{PRODUCT.name}</h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(PRODUCT.rating) ? 'text-amber-400' : 'text-slate-600'} fill={i < Math.floor(PRODUCT.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-sm text-slate-300">{PRODUCT.rating}</span>
                <span className="text-sm text-slate-500">({PRODUCT.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-white">₹{PRODUCT.price.toLocaleString()}</span>
              <span className="text-slate-500 line-through text-lg">₹{PRODUCT.mrp.toLocaleString()}</span>
              <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-sm font-bold text-emerald-400">
                You save ₹{(PRODUCT.mrp - PRODUCT.price).toLocaleString()}
              </span>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 flex items-center gap-2">
              <Zap size={16} className="text-emerald-400 shrink-0" />
              <span className="text-sm text-emerald-300">
                Earn <strong>{PRODUCT.cashback}% cashback</strong> (₹{Math.round(PRODUCT.price * PRODUCT.cashback / 100)}) on this order
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">Quantity:</span>
              <div className="flex items-center gap-2 border border-white/10 rounded-xl">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-slate-400 hover:text-white transition">−</button>
                <span className="w-8 text-center text-sm font-medium text-white">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-slate-400 hover:text-white transition">+</button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => toast.success('Added to cart!')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-400 transition shadow-glow"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button
                onClick={() => { setWished(!wished); toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist!'); }}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${wished ? 'border-red-500/40 bg-red-500/10 text-red-400' : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'}`}
              >
                <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:border-white/30 hover:text-white transition">
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
              {[
                { icon: <Truck size={16} />, label: 'Free Delivery', sub: 'On orders ₹499+' },
                { icon: <RotateCcw size={16} />, label: '7-Day Return', sub: 'Easy returns' },
                { icon: <Shield size={16} />, label: '1 Year Warranty', sub: 'Brand warranty' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center text-center gap-1 p-2 rounded-xl bg-slate-900/50">
                  <span className="text-brand-400">{b.icon}</span>
                  <span className="text-xs font-medium text-white">{b.label}</span>
                  <span className="text-xs text-slate-500">{b.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-white/10 gap-6">
            {(['desc', 'specs', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition border-b-2 -mb-px ${activeTab === tab ? 'border-brand-500 text-brand-300' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                {tab === 'desc' ? 'Description' : tab === 'specs' ? 'Specifications' : 'Reviews'}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">{PRODUCT.description}</p>
                <ul className="space-y-2">
                  {PRODUCT.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="grid gap-1">
                {Object.entries(PRODUCT.specifications).map(([k, v]) => (
                  <div key={k} className="flex py-2 border-b border-white/5 last:border-0">
                    <span className="w-36 text-sm text-slate-500 shrink-0">{k}</span>
                    <span className="text-sm text-slate-200">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-slate-950/50 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-brand-500/30 flex items-center justify-center text-brand-300 text-sm font-bold">U</div>
                      <div>
                        <p className="text-sm font-medium text-white">Verified Buyer</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, j) => <Star key={j} size={10} className="text-amber-400" fill="currentColor" />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">Great product! Exactly as described. Fast delivery and good packaging. Highly recommend.</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
