'use client';

import { useState } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { Search, Star, Clock, ChevronRight, Flame } from 'lucide-react';

const FOOD_CATEGORIES = ['All', 'Biryani', 'Pizza', 'Burger', 'Chinese', 'South Indian', 'Sweets', 'Beverages'];

const RESTAURANTS = [
  { id: 'r1', name: 'Paradise Biryani', cuisine: 'Biryani, Mughlai', rating: 4.5, time: '30-40 min', minOrder: 200, category: 'Biryani', offer: '20% OFF up to ₹100', emoji: '🍚', priceForTwo: 450 },
  { id: 'r2', name: 'Pizza Planet', cuisine: 'Pizza, Italian', rating: 4.3, time: '25-35 min', minOrder: 150, category: 'Pizza', offer: 'Free delivery above ₹299', emoji: '🍕', priceForTwo: 380 },
  { id: 'r3', name: 'Burger King', cuisine: 'Burgers, Fast Food', rating: 4.4, time: '20-30 min', minOrder: 100, category: 'Burger', offer: 'Buy 1 Get 1 Free', emoji: '🍔', priceForTwo: 300 },
  { id: 'r4', name: 'Dragon Wok', cuisine: 'Chinese, Asian', rating: 4.2, time: '35-45 min', minOrder: 250, category: 'Chinese', offer: '15% OFF on first order', emoji: '🥢', priceForTwo: 500 },
  { id: 'r5', name: 'Saravana Bhavan', cuisine: 'South Indian', rating: 4.6, time: '20-30 min', minOrder: 150, category: 'South Indian', offer: 'Combo at ₹199', emoji: '🥘', priceForTwo: 280 },
  { id: 'r6', name: 'Mitthai Ghar', cuisine: 'Sweets, Snacks', rating: 4.4, time: '15-25 min', minOrder: 100, category: 'Sweets', offer: '500g Ladoo at ₹149', emoji: '🍬', priceForTwo: 200 },
];

export default function FoodPage() {
  const { flags, ready } = useFeatureFlags();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQ, setSearchQ] = useState('');

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.foodDeliveryModule) return <FeatureBlocked title="Food Delivery" message="The food delivery module is currently disabled by the administrator." />;

  const filtered = RESTAURANTS.filter(r => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchQ = !searchQ || r.name.toLowerCase().includes(searchQ.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-900/40 to-slate-900 border-b border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Food Delivery 🍽️</h1>
          <p className="text-slate-300">Order food from your favourite restaurants. Free delivery on orders above ₹299.</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="w-full rounded-2xl border border-white/10 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FOOD_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${activeCategory === cat ? 'bg-orange-500 text-white' : 'border border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Promotions */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { title: 'Free Delivery', sub: 'On orders above ₹299', emoji: '🚚', color: 'from-blue-900/40' },
            { title: 'Flash Deals', sub: 'Up to 50% off today', emoji: '⚡', color: 'from-yellow-900/40' },
            { title: 'Cashback', sub: 'Up to 15% on every order', emoji: '💰', color: 'from-green-900/40' },
          ].map(p => (
            <div key={p.title} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${p.color} to-slate-900/60 p-5 flex items-center gap-4`}>
              <span className="text-3xl">{p.emoji}</span>
              <div>
                <p className="text-sm font-bold text-white">{p.title}</p>
                <p className="text-xs text-slate-400">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Restaurant Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-orange-400" />
            <h2 className="text-lg font-bold text-white">Restaurants Near You</h2>
            <span className="text-xs text-slate-500">({filtered.length} open)</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">No restaurants found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(r => (
                <button key={r.id} className="text-left rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-orange-500/30 hover:shadow-lg transition group">
                  <div className="h-36 bg-slate-800 flex items-center justify-center text-5xl relative">
                    {r.emoji}
                    {r.offer && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent px-3 py-2">
                        <span className="text-xs font-semibold text-orange-300">{r.offer}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-orange-300 transition">{r.name}</h3>
                      <div className="flex items-center gap-1 shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5">
                        <Star size={10} className="text-emerald-400" fill="currentColor" />
                        <span className="text-xs font-bold text-emerald-400">{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">{r.cuisine}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1"><Clock size={11} /> {r.time}</span>
                      <span>Min ₹{r.minOrder}</span>
                      <span>₹{r.priceForTwo} for 2</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
