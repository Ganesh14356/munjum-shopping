'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFeatureFlags } from '@/context/FeatureContext';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { updateAppSettings } from '@/lib/api';
import {
  Users, ShoppingBag, DollarSign, TrendingUp, BarChart2,
  CreditCard, Percent, ChevronRight, CheckCircle, AlertCircle, Loader2,
} from 'lucide-react';

const MODULE_SECTIONS = [
  { key: 'shoppingModule', label: 'Shopping Module', desc: 'Product catalog, cart, checkout' },
  { key: 'affiliateModule', label: 'Affiliate Module', desc: 'Referral links and commissions' },
  { key: 'cashbackModule', label: 'Cashback Module', desc: 'Wallet and cashback rewards' },
  { key: 'couponsModule', label: 'Coupons Module', desc: 'Coupon creation and validation' },
  { key: 'dealsModule', label: 'Deals Module', desc: 'Flash sales and trending offers' },
  { key: 'foodDeliveryModule', label: 'Food Delivery', desc: 'Restaurant listings and orders' },
  { key: 'travelModule', label: 'Travel Booking', desc: 'Flights, hotels, trains, buses' },
  { key: 'insuranceModule', label: 'Insurance Module', desc: 'Insurance comparison and leads' },
  { key: 'loanModule', label: 'Loan Module', desc: 'EMI calculator and loan leads' },
  { key: 'rechargeModule', label: 'Recharge Module', desc: 'Mobile, DTH, utility bills' },
  { key: 'merchantModule', label: 'Merchant Module', desc: 'Merchant registration and products' },
  { key: 'blogModule', label: 'Blog Module', desc: 'Articles and SEO content' },
  { key: 'supportModule', label: 'Support Module', desc: 'Helpdesk and ticket system' },
];

const HOME_SECTIONS = [
  { key: 'bannerSlider', label: 'Banner Slider' },
  { key: 'categories', label: 'Categories Grid' },
  { key: 'topDeals', label: 'Top Deals' },
  { key: 'couponsSection', label: 'Coupons Strip' },
  { key: 'trendingProducts', label: 'Trending Products' },
  { key: 'cashbackOffers', label: 'Cashback Offers' },
  { key: 'referEarn', label: 'Refer & Earn' },
  { key: 'popularBrands', label: 'Popular Brands' },
];

const ADMIN_NAV = [
  {
    href: '/admin/users',
    icon: <Users size={22} />,
    label: 'User Management',
    desc: 'View, filter, and manage all customer, affiliate, merchant and support accounts.',
    color: 'text-blue-400 bg-blue-500/10',
  },
  {
    href: '/admin/reports',
    icon: <BarChart2 size={22} />,
    label: 'Reports & Analytics',
    desc: 'Revenue graphs, order volumes, cashback paid, and affiliate performance.',
    color: 'text-purple-400 bg-purple-500/10',
  },
  {
    href: '/admin/payments',
    icon: <CreditCard size={22} />,
    label: 'Payment Management',
    desc: 'Approve or reject withdrawal requests; monitor Cashfree gateway status.',
    color: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    href: '/admin/commissions',
    icon: <Percent size={22} />,
    label: 'Commission Settings',
    desc: 'Set affiliate commission tiers, merchant commission rates, and cashback %.',
    color: 'text-orange-400 bg-orange-500/10',
  },
];

const PLATFORM_STATS = [
  { label: 'Total Users', value: '—', icon: <Users size={18} />, color: 'text-blue-400', hint: 'Synced from Firestore' },
  { label: 'Total Orders', value: '—', icon: <ShoppingBag size={18} />, color: 'text-emerald-400', hint: 'All time' },
  { label: 'Total Revenue', value: '—', icon: <DollarSign size={18} />, color: 'text-yellow-400', hint: 'Gross GMV' },
  { label: 'Active Affiliates', value: '—', icon: <TrendingUp size={18} />, color: 'text-brand-400', hint: 'Approved accounts' },
];

export function AdminDashboard() {
  const { flags } = useFeatureFlags();
  const [localFlags, setLocalFlags] = useState(flags);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');

  useEffect(() => {
    setLocalFlags(flags);
  }, [flags]);

  const toggleFlag = async (key: keyof typeof flags) => {
    const next = { ...localFlags, [key]: !localFlags[key] };
    setLocalFlags(next);
    setSaving(true);
    setSaveStatus('saving');
    try {
      await updateAppSettings({ [key]: next[key] });
      setSaveStatus('ok');
    } catch {
      setLocalFlags(flags);
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const enabledCount = MODULE_SECTIONS.filter(s => localFlags[s.key as keyof typeof localFlags]).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {enabledCount} of {MODULE_SECTIONS.length} modules enabled
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 size={12} className="animate-spin" /> Saving...
            </span>
          )}
          {saveStatus === 'ok' && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle size={12} /> Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle size={12} /> Save failed
            </span>
          )}
        </div>
      </div>

      {/* Platform stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {PLATFORM_STATS.map(s => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
            <div className={`inline-flex rounded-xl p-2.5 bg-slate-800 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
            <p className="text-xs text-slate-600">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Quick nav to admin sub-pages */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Management Pages</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ADMIN_NAV.map(nav => (
            <Link key={nav.href} href={nav.href} className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 hover:border-brand-500/30 hover:bg-slate-800/60 transition">
              <span className={`flex-shrink-0 rounded-xl p-3 ${nav.color}`}>{nav.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition">{nav.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{nav.desc}</p>
              </div>
              <ChevronRight size={16} className="flex-shrink-0 text-slate-600 group-hover:text-brand-400 transition mt-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* Feature toggles */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Feature Control Center</h2>
            <p className="text-xs text-slate-500 mt-1">Toggle platform modules on or off. Changes apply instantly.</p>
          </div>
          <div className="space-y-3">
            {MODULE_SECTIONS.map(section => (
              <div key={section.key} className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{section.label}</p>
                  <p className="text-xs text-slate-500">{section.desc}</p>
                </div>
                <ToggleSwitch
                  inline
                  label=""
                  checked={!!localFlags[section.key as keyof typeof localFlags]}
                  onChange={() => toggleFlag(section.key as keyof typeof localFlags)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Home Page Sections</h2>
            <p className="text-xs text-slate-500 mt-1">Control which sections appear on the homepage.</p>
          </div>
          <div className="space-y-3">
            {HOME_SECTIONS.map(section => (
              <div key={section.key} className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
                <p className="text-sm font-medium text-white">{section.label}</p>
                <ToggleSwitch
                  inline
                  label=""
                  checked={!!localFlags[section.key as keyof typeof localFlags]}
                  onChange={() => toggleFlag(section.key as keyof typeof localFlags)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {saving && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-xl border border-brand-500/30 bg-slate-900 px-4 py-3 text-sm text-brand-200 shadow-lg z-50">
          <Loader2 size={14} className="animate-spin" /> Saving settings to Firestore...
        </div>
      )}
    </div>
  );
}
