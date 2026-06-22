'use client';

import Link from 'next/link';
import { useFeatureFlags } from '@/context/FeatureContext';
import { SectionHeading } from '@/components/SectionHeading';
import {
  ShoppingCart, Percent, Tag, Zap, Utensils, Plane, ShieldCheck,
  CreditCard, Smartphone, Users, TrendingUp, Gift, Star, ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics', emoji: '📱', count: '2,400+ products', href: '/shop?category=Electronics' },
  { name: 'Fashion', emoji: '👗', count: '5,200+ products', href: '/shop?category=Fashion' },
  { name: 'Home & Kitchen', emoji: '🏠', count: '1,800+ products', href: '/shop?category=Home' },
  { name: 'Beauty', emoji: '💄', count: '900+ products', href: '/shop?category=Beauty' },
  { name: 'Sports', emoji: '⚽', count: '1,100+ products', href: '/shop?category=Sports' },
  { name: 'Books', emoji: '📚', count: '3,600+ products', href: '/shop?category=Books' },
];

const FEATURED_DEALS = [
  { id: '1', name: 'boAt Airdopes 141', price: 899, mrp: 3499, cashback: 8, badge: 'Flash Sale' },
  { id: '2', name: 'Redmi 14C 128GB', price: 8499, mrp: 12999, cashback: 5, badge: 'Best Seller' },
  { id: '3', name: 'Nike Air Max 270', price: 7995, mrp: 11995, cashback: 7, badge: 'Trending' },
  { id: '4', name: 'Sony WH-1000XM5', price: 19990, mrp: 29990, cashback: 8, badge: 'Top Rated' },
];

const POPULAR_BRANDS = [
  { name: 'Apple', emoji: '🍎' },
  { name: 'Samsung', emoji: '📱' },
  { name: 'Nike', emoji: '👟' },
  { name: 'Sony', emoji: '🎧' },
  { name: 'Boat', emoji: '🎵' },
  { name: 'Puma', emoji: '👕' },
  { name: 'boAt', emoji: '🎶' },
  { name: 'OnePlus', emoji: '🔥' },
];

const PLATFORM_STATS = [
  { value: '10L+', label: 'Happy Customers' },
  { value: '₹25Cr+', label: 'Cashback Paid' },
  { value: '50K+', label: 'Active Affiliates' },
  { value: '5000+', label: 'Merchant Partners' },
];

const SERVICES = [
  { icon: <Utensils size={22} />, label: 'Food Delivery', href: '/food', flagKey: 'foodDeliveryModule', color: 'text-orange-400 bg-orange-500/10' },
  { icon: <Plane size={22} />, label: 'Travel', href: '/travel', flagKey: 'travelModule', color: 'text-blue-400 bg-blue-500/10' },
  { icon: <ShieldCheck size={22} />, label: 'Insurance', href: '/insurance', flagKey: 'insuranceModule', color: 'text-green-400 bg-green-500/10' },
  { icon: <CreditCard size={22} />, label: 'Loans', href: '/loans', flagKey: 'loanModule', color: 'text-purple-400 bg-purple-500/10' },
  { icon: <Smartphone size={22} />, label: 'Recharge', href: '/recharge', flagKey: 'rechargeModule', color: 'text-cyan-400 bg-cyan-500/10' },
  { icon: <Users size={22} />, label: 'Affiliate', href: '/affiliate', flagKey: 'affiliateModule', color: 'text-brand-400 bg-brand-500/10' },
];

export function HomePage() {
  const { flags } = useFeatureFlags();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Banner */}
      {flags.bannerSlider && (
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-2 text-sm font-medium text-brand-200">
                  🎉 India's #1 Super Shopping Platform
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                  Shop Smart,<br />
                  <span className="text-brand-400">Earn More.</span>
                </h1>
                <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
                  Discover millions of products, earn real cashback, join our affiliate program, and access 10+ essential services — all in one platform.
                </p>
                <div className="flex flex-wrap gap-3">
                  {flags.shoppingModule && (
                    <Link href="/shop" className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-glow hover:bg-brand-400 transition">
                      <ShoppingCart size={16} /> Start Shopping
                    </Link>
                  )}
                  {flags.affiliateModule && (
                    <Link href="/affiliate" className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 transition">
                      <TrendingUp size={16} /> Join as Affiliate
                    </Link>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  {flags.cashbackModule && <span>✅ Up to 15% Cashback</span>}
                  {flags.dealsModule && <span>✅ Daily Flash Deals</span>}
                  {flags.couponsModule && <span>✅ 500+ Coupons</span>}
                  <span>✅ Free Delivery on ₹499+</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {PLATFORM_STATS.map(s => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-center space-y-1 hover:border-brand-500/30 transition">
                    <p className="text-3xl font-bold text-white">{s.value}</p>
                    <p className="text-sm text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {flags.categories && flags.shoppingModule && (
        <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading title="Top Categories" description="Browse by your favourite categories" />
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {CATEGORIES.map(cat => (
                <Link key={cat.name} href={cat.href} className="group rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-center hover:border-brand-500/30 hover:bg-slate-800/60 transition">
                  <div className="text-4xl mb-2">{cat.emoji}</div>
                  <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition">{cat.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Deals */}
      {flags.topDeals && flags.dealsModule && (
        <section className="border-t border-white/10 bg-slate-900/30 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <SectionHeading title="Featured Deals" description="Limited time offers with maximum cashback" />
              <Link href="/deals" className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_DEALS.map(deal => {
                const discount = Math.round(((deal.mrp - deal.price) / deal.mrp) * 100);
                return (
                  <Link key={deal.id} href={`/shop/${deal.id}`} className="group rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-brand-500/30 hover:shadow-glow transition">
                    <div className="h-36 bg-slate-800 flex items-center justify-center text-5xl relative">
                      🛍️
                      <span className="absolute top-2 left-2 rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">{deal.badge}</span>
                      <span className="absolute top-2 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">-{discount}%</span>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-sm font-medium text-white group-hover:text-brand-300 transition line-clamp-2">{deal.name}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-lg font-bold text-white">₹{deal.price.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 line-through">₹{deal.mrp.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-emerald-400">+{deal.cashback}% Cashback</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Cashback Offers */}
      {flags.cashbackOffers && flags.cashbackModule && (
        <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-900/40 to-slate-900/60 p-8 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-2 items-center">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-2 text-sm font-medium text-brand-200">
                    <Percent size={14} /> Cashback Central
                  </span>
                  <h2 className="text-3xl font-bold text-white">Earn Real Cashback on Every Purchase</h2>
                  <p className="text-slate-300">No codes, no hassle. Shop on Munjum and get real money credited to your wallet within 7 days of delivery.</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      'Up to 15% on Electronics',
                      '8% on Fashion',
                      '12% on Travel',
                      '5% on Recharge',
                    ].map(s => (
                      <span key={s} className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-200">{s}</span>
                    ))}
                  </div>
                  <Link href="/cashback" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow">
                    Explore Cashback Offers <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Cashback Paid', value: '₹25 Cr+' },
                    { label: 'Average Cashback', value: '7.2%' },
                    { label: 'Withdrawal Time', value: 'Instant' },
                    { label: 'Min Withdrawal', value: '₹100' },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-center">
                      <p className="text-2xl font-bold text-brand-400">{s.value}</p>
                      <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Coupons Section */}
      {flags.couponsSection && flags.couponsModule && (
        <section className="border-t border-white/10 bg-slate-900/30 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <SectionHeading title="Top Coupons" description="Exclusive deals updated daily" />
              <Link href="/coupons" className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition">
                All Coupons <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { code: 'SAVE200', store: 'Electronics', discount: '₹200 OFF', exp: '3 days' },
                { code: 'FASHION30', store: 'Fashion', discount: '30% OFF', exp: '5 days' },
                { code: 'FOOD50', store: 'Food Order', discount: '₹50 OFF', exp: 'Today!' },
                { code: 'TRAVEL1K', store: 'Travel', discount: '₹1000 OFF', exp: '7 days' },
              ].map(c => (
                <div key={c.code} className="rounded-2xl border border-dashed border-brand-500/40 bg-brand-500/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{c.store}</span>
                    <span className="text-xs text-red-400">Expires in {c.exp}</span>
                  </div>
                  <p className="text-xl font-bold text-brand-400">{c.discount}</p>
                  <code className="block text-sm font-bold text-white tracking-widest">{c.code}</code>
                  <Link href="/coupons" className="block text-center rounded-lg bg-brand-500/20 py-1.5 text-xs font-semibold text-brand-300 hover:bg-brand-500/30 transition">
                    Use Coupon
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      {SERVICES.some(s => flags[s.flagKey as keyof typeof flags]) && (
        <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading title="All Services" description="One platform for all your needs" />
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {SERVICES.filter(s => flags[s.flagKey as keyof typeof flags]).map(s => (
                <Link key={s.label} href={s.href} className={`rounded-2xl border border-white/10 p-5 flex flex-col items-center gap-3 hover:border-white/20 transition group`}>
                  <span className={`rounded-xl p-3 ${s.color}`}>{s.icon}</span>
                  <span className="text-sm font-semibold text-white group-hover:text-brand-300 transition">{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Refer & Earn */}
      {flags.referEarn && flags.affiliateModule && (
        <section className="border-t border-white/10 bg-slate-900/30 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Gift size={40} className="text-brand-400 mx-auto" />
            <h2 className="text-3xl font-bold text-white">Refer Friends, Earn Unlimited</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Share your referral link and earn ₹100 cashback for every friend who signs up and shops on Munjum.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-brand-400 transition">
                Start Earning Now
              </Link>
              <Link href="/affiliate" className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition">
                Affiliate Program
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Popular Brands */}
      {flags.popularBrands && flags.shoppingModule && (
        <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading title="Popular Brands" />
            <div className="grid gap-3 grid-cols-4 sm:grid-cols-8">
              {POPULAR_BRANDS.map(brand => (
                <Link key={brand.name} href={`/shop?brand=${brand.name}`} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex flex-col items-center gap-2 hover:border-brand-500/30 transition">
                  <span className="text-3xl">{brand.emoji}</span>
                  <span className="text-xs font-medium text-slate-400">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {flags.trendingProducts && flags.shoppingModule && (
        <section className="border-t border-white/10 bg-slate-900/30 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <SectionHeading title="Trending Now" />
              <Link href="/shop" className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 transition">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Wireless Earbuds Pro', price: 1299, cashback: 10 },
                { name: 'Smart Watch Ultra', price: 4999, cashback: 8 },
                { name: 'Yoga Mat Premium', price: 799, cashback: 7 },
                { name: 'Coffee Maker Pro', price: 2499, cashback: 6 },
              ].map((p, i) => (
                <Link key={i} href="/shop" className="group rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-brand-500/30 transition">
                  <div className="h-32 bg-slate-800 flex items-center justify-center text-4xl">🛍️</div>
                  <div className="p-4 space-y-1.5">
                    <p className="text-sm font-medium text-white group-hover:text-brand-300 transition">{p.name}</p>
                    <p className="text-base font-bold text-white">₹{p.price.toLocaleString()}</p>
                    <p className="text-xs text-emerald-400">+{p.cashback}% Cashback</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feature Overview */}
      <section id="features" className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Everything in one platform" description="Enable or disable modules from the admin dashboard to shape your platform experience." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <ShoppingCart size={20} />, key: 'shoppingModule', label: 'Shopping', desc: 'Product listings, cart, checkout, reviews.' },
              { icon: <Users size={20} />, key: 'affiliateModule', label: 'Affiliate', desc: 'Referral links, commissions, dashboards.' },
              { icon: <Percent size={20} />, key: 'cashbackModule', label: 'Cashback', desc: 'Wallet, history, withdrawals.' },
              { icon: <Tag size={20} />, key: 'couponsModule', label: 'Coupons', desc: 'Exclusive verified coupon codes.' },
              { icon: <Zap size={20} />, key: 'dealsModule', label: 'Deals', desc: 'Flash sales, daily deals, trending.' },
              { icon: <Utensils size={20} />, key: 'foodDeliveryModule', label: 'Food Delivery', desc: 'Restaurants, menus, order tracking.' },
              { icon: <Plane size={20} />, key: 'travelModule', label: 'Travel', desc: 'Flights, hotels, trains, buses.' },
              { icon: <ShieldCheck size={20} />, key: 'insuranceModule', label: 'Insurance', desc: 'Compare and buy insurance plans.' },
              { icon: <CreditCard size={20} />, key: 'loanModule', label: 'Loans', desc: 'EMI calculator, loan comparison.' },
              { icon: <Smartphone size={20} />, key: 'rechargeModule', label: 'Recharge', desc: 'Mobile, DTH, utility bills.' },
              { icon: <Star size={20} />, key: 'blogModule', label: 'Blog', desc: 'Shopping guides, deals news, SEO.' },
              { icon: <TrendingUp size={20} />, key: 'merchantModule', label: 'Merchants', desc: 'Product uploads, order management.' },
            ].map(f => {
              const enabled = flags[f.key as keyof typeof flags];
              return (
                <div key={f.key} className={`space-y-3 rounded-2xl border p-5 transition ${enabled ? 'border-white/10 bg-slate-900/60' : 'border-white/5 bg-slate-900/30 opacity-60'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={enabled ? 'text-brand-400' : 'text-slate-600'}>{f.icon}</span>
                      <p className="text-sm font-semibold text-white">{f.label}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${enabled ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700/60 text-slate-500'}`}>
                      {enabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-6 py-3 text-sm font-semibold text-brand-300 hover:bg-brand-500/20 transition">
              Open Admin Dashboard to toggle modules
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
