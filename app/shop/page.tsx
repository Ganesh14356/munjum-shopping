'use client';

import { useState, useMemo } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { Search, Filter, Star, Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Books', 'Toys'];

const SAMPLE_PRODUCTS = [
  { id: '1', name: 'Wireless Bluetooth Headphones', price: 1999, mrp: 4999, cashback: 5, rating: 4.3, reviews: 1240, category: 'Electronics', badge: 'Best Seller' },
  { id: '2', name: 'Premium Cotton T-Shirt', price: 499, mrp: 999, cashback: 8, rating: 4.1, reviews: 856, category: 'Fashion', badge: 'Hot Deal' },
  { id: '3', name: 'Stainless Steel Water Bottle', price: 349, mrp: 799, cashback: 6, rating: 4.5, reviews: 2100, category: 'Home & Kitchen', badge: 'Top Rated' },
  { id: '4', name: 'Smart Watch Series 5', price: 5999, mrp: 12999, cashback: 10, rating: 4.4, reviews: 3200, category: 'Electronics', badge: 'New Arrival' },
  { id: '5', name: 'Yoga Mat Premium', price: 799, mrp: 1499, cashback: 7, rating: 4.2, reviews: 540, category: 'Sports', badge: null },
  { id: '6', name: 'Face Moisturizer SPF 50', price: 299, mrp: 599, cashback: 12, rating: 4.6, reviews: 1890, category: 'Beauty', badge: 'Trending' },
  { id: '7', name: 'The Psychology of Money', price: 199, mrp: 399, cashback: 5, rating: 4.8, reviews: 4500, category: 'Books', badge: 'Top Rated' },
  { id: '8', name: 'LED Desk Lamp', price: 899, mrp: 1999, cashback: 9, rating: 4.0, reviews: 620, category: 'Home & Kitchen', badge: null },
  { id: '9', name: 'Running Shoes Pro', price: 2499, mrp: 4999, cashback: 8, rating: 4.3, reviews: 980, category: 'Sports', badge: 'Sale' },
  { id: '10', name: 'Portable Power Bank 20000mAh', price: 1299, mrp: 2999, cashback: 6, rating: 4.5, reviews: 1560, category: 'Electronics', badge: 'Trending' },
  { id: '11', name: 'Kids Building Blocks Set', price: 649, mrp: 1299, cashback: 4, rating: 4.7, reviews: 720, category: 'Toys', badge: null },
  { id: '12', name: 'Anti-Dandruff Shampoo', price: 179, mrp: 299, cashback: 15, rating: 4.1, reviews: 3300, category: 'Beauty', badge: 'Best Seller' },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Cashback', value: 'cashback' },
];

function ProductCard({ product }: { product: typeof SAMPLE_PRODUCTS[0] }) {
  const [wished, setWished] = useState(false);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden hover:border-brand-500/30 hover:shadow-glow transition-all duration-300">
      {/* Image placeholder */}
      <div className="relative h-48 bg-slate-800 flex items-center justify-center">
        <div className="text-5xl text-slate-600">🛍️</div>
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 rounded-full bg-emerald-500/90 px-2 py-1 text-xs font-bold text-white">
          -{discount}%
        </span>
        <button
          onClick={() => setWished(!wished)}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-slate-400 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
        >
          <Heart size={14} fill={wished ? 'currentColor' : 'none'} className={wished ? 'text-red-400' : ''} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <Link href={`/shop/${product.id}`}>
          <h3 className="text-sm font-medium text-white line-clamp-2 hover:text-brand-300 transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-600'}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-lg font-bold text-white">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-slate-500 line-through">₹{product.mrp.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-medium">+{product.cashback}% Cashback</span>
          <button className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-400 transition">
            <ShoppingCart size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { flags, ready } = useFeatureFlags();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQ, setSearchQ] = useState('');

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.shoppingModule) return <FeatureBlocked title="Shopping" message="The shopping module is currently disabled by the administrator." />;

  const filtered = useMemo(() => {
    let list = SAMPLE_PRODUCTS.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchQ = !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase());
      return matchCat && matchQ;
    });
    if (sortBy === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'cashback') list = [...list].sort((a, b) => b.cashback - a.cashback);
    return list;
  }, [activeCategory, sortBy, searchQ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-white">Shop</h1>
          <p className="text-sm text-slate-400 mt-1">Discover top products with best cashback offers</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 pr-8 text-sm text-slate-300 outline-none focus:border-brand-500"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-brand-500 text-white'
                  : 'border border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-slate-500 mb-4">Showing {filtered.length} products</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-sm">No products found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
