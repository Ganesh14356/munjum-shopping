'use client';

import { useState } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { Search, Clock, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Shopping Guides', 'Cashback Tips', 'Tech', 'Travel', 'Finance', 'Lifestyle'];

const POSTS = [
  { slug: 'best-cashback-apps-2026', title: 'Best Cashback Apps in India 2026 — Complete Guide', excerpt: 'Discover the top cashback platforms that pay you real money on every purchase. We tested 20+ apps so you don\'t have to.', category: 'Cashback Tips', author: 'Team Munjum', date: '20 Jun 2026', readTime: '8 min read', featured: true },
  { slug: 'how-to-earn-affiliate-commission', title: 'How to Earn ₹50,000/Month as a Munjum Affiliate', excerpt: 'Step-by-step guide to building a passive income stream through Munjum\'s affiliate program using social media and blogs.', category: 'Shopping Guides', author: 'Rahul M.', date: '18 Jun 2026', readTime: '12 min read', featured: true },
  { slug: 'best-deals-electronics-june-2026', title: 'Best Electronics Deals in June 2026 — Save Up to 70%', excerpt: 'Smartphones, laptops, headphones — we\'ve compiled the best deals available this month with maximum cashback.', category: 'Tech', author: 'Priya S.', date: '15 Jun 2026', readTime: '6 min read', featured: false },
  { slug: 'budget-travel-india-2026', title: 'Travel India on ₹5000/Day: Complete Budget Guide', excerpt: 'Explore the best destinations, cheapest accommodations, and travel hacks to see more of India for less.', category: 'Travel', author: 'Arjun K.', date: '12 Jun 2026', readTime: '15 min read', featured: false },
  { slug: 'credit-card-vs-upi-cashback', title: 'Credit Card vs UPI — Which Gives Better Cashback?', excerpt: 'A data-driven comparison of cashback rates across payment methods to help you maximize your savings.', category: 'Finance', author: 'Team Munjum', date: '10 Jun 2026', readTime: '7 min read', featured: false },
  { slug: 'home-decor-shopping-guide', title: 'Home Decor Shopping Guide: What to Buy and Where', excerpt: 'Transform your living space without breaking the bank. Our curated picks with best deals online.', category: 'Lifestyle', author: 'Sneha R.', date: '8 Jun 2026', readTime: '10 min read', featured: false },
];

export default function BlogPage() {
  const { flags, ready } = useFeatureFlags();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQ, setSearchQ] = useState('');

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.blogModule) return <FeatureBlocked title="Blog" message="The blog module is currently disabled by the administrator." />;

  const featured = POSTS.filter(p => p.featured);
  const filtered = POSTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchQ = !searchQ || p.title.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Munjum Blog 📖</h1>
          <p className="text-slate-400">Shopping guides, cashback tips, deals, and personal finance wisdom.</p>
          <div className="relative max-w-sm mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${activeCategory === cat ? 'bg-brand-500 text-white' : 'border border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Posts */}
        {activeCategory === 'All' && !searchQ && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Featured</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {featured.map(post => (
                <div key={post.slug} className="group rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-brand-500/30 transition">
                  <div className="h-40 bg-gradient-to-br from-brand-900/50 to-slate-800 flex items-center justify-center text-4xl">📰</div>
                  <div className="p-5 space-y-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-medium text-brand-300">
                      <Tag size={10} /> {post.category}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                      <span className="ml-auto">{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            {activeCategory === 'All' && !searchQ ? 'All Articles' : `${filtered.length} results`}
          </h2>
          <div className="space-y-3">
            {filtered.map(post => (
              <div key={post.slug} className="group flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 hover:border-brand-500/30 transition cursor-pointer">
                <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-2xl">📰</div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-brand-400">{post.category}</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-brand-300 transition line-clamp-1 mt-0.5">{post.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1"><Clock size={9} /> {post.readTime}</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-brand-400 transition shrink-0 mt-auto mb-auto" />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">No articles found.</div>
          )}
        </section>
      </div>
    </main>
  );
}
