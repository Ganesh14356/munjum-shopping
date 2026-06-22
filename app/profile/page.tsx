'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, Mail, Phone, Shield, Wallet, Star, Package, Heart, Settings, LogOut, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, profile, signOut, isAdmin, isMerchant, isAffiliate } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  if (!user || !profile) {
    return (
      <main className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 text-center">
        <div className="space-y-4">
          <User size={50} className="text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Please login to view your profile</h2>
          <Link href="/login" className="inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">Login</Link>
        </div>
      </main>
    );
  }

  const referralCode = profile.referralCode ?? 'MUNJUM123';

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-900/30 to-slate-900/80 p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-white text-3xl font-bold shadow-glow shrink-0">
              {profile.displayName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-white">{profile.displayName ?? 'User'}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{profile.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 capitalize">{profile.role}</span>
                {isAdmin && <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300">Admin</span>}
                {isMerchant && <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">Merchant</span>}
                {isAffiliate && <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">Affiliate</span>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Wallet size={16} />, label: 'Cashback', value: `₹${profile.cashbackBalance ?? 475}`, color: 'text-emerald-400' },
              { icon: <Star size={16} />, label: 'Loyalty Points', value: `${profile.loyaltyPoints ?? 1240} pts`, color: 'text-amber-400' },
              { icon: <Package size={16} />, label: 'Orders', value: '4', color: 'text-brand-400' },
              { icon: <Heart size={16} />, label: 'Wishlist', value: '7', color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-center">
                <span className={s.color}>{s.icon}</span>
                <p className="text-lg font-bold text-white mt-1">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: 'My Orders', href: '/orders', icon: <Package size={18} />, desc: 'Track and manage your orders' },
            { label: 'Wishlist', href: '/wishlist', icon: <Heart size={18} />, desc: 'Items you\'ve saved for later' },
            { label: 'Cashback Wallet', href: '/cashback', icon: <Wallet size={18} />, desc: 'View and withdraw your cashback' },
            ...(isAffiliate ? [{ label: 'Affiliate Dashboard', href: '/affiliate/dashboard', icon: <Star size={18} />, desc: 'Track referrals and commissions' }] : []),
            ...(isMerchant ? [{ label: 'Merchant Dashboard', href: '/merchant/dashboard', icon: <Settings size={18} />, desc: 'Manage your products and orders' }] : []),
            ...(isAdmin ? [{ label: 'Admin Dashboard', href: '/admin', icon: <Shield size={18} />, desc: 'Platform controls and settings' }] : []),
          ].map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 hover:border-brand-500/30 transition">
              <span className="text-brand-400">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Referral */}
        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Your Referral Code</h3>
            <p className="text-xs text-slate-400 mt-0.5">Share and earn ₹100 cashback per successful referral</p>
          </div>
          <div className="flex items-center gap-2">
            <code className="rounded-xl bg-slate-900 border border-white/10 px-4 py-2 text-sm font-bold text-brand-300 tracking-widest">
              {referralCode}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(referralCode); toast.success('Referral code copied!'); }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={async () => { await signOut(); toast.success('Signed out'); }}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </main>
  );
}
