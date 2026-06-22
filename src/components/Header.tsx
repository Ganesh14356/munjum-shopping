'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart, Heart, User, Menu, X, Search, ChevronDown,
  Store, Tag, Percent, Zap, Utensils, Plane, ShieldCheck,
  CreditCard, Smartphone, BookOpen, LifeBuoy, LayoutDashboard,
  LogOut, Package, Users, Settings,
} from 'lucide-react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  flagKey?: keyof import('@/context/FeatureContext').FeatureFlags;
}

const mainNav: NavItem[] = [
  { label: 'Shop', href: '/shop', icon: <Store size={15} />, flagKey: 'shoppingModule' },
  { label: 'Deals', href: '/deals', icon: <Zap size={15} />, flagKey: 'dealsModule' },
  { label: 'Coupons', href: '/coupons', icon: <Tag size={15} />, flagKey: 'couponsModule' },
  { label: 'Cashback', href: '/cashback', icon: <Percent size={15} />, flagKey: 'cashbackModule' },
  { label: 'Food', href: '/food', icon: <Utensils size={15} />, flagKey: 'foodDeliveryModule' },
  { label: 'Travel', href: '/travel', icon: <Plane size={15} />, flagKey: 'travelModule' },
  { label: 'Insurance', href: '/insurance', icon: <ShieldCheck size={15} />, flagKey: 'insuranceModule' },
  { label: 'Loans', href: '/loans', icon: <CreditCard size={15} />, flagKey: 'loanModule' },
  { label: 'Recharge', href: '/recharge', icon: <Smartphone size={15} />, flagKey: 'rechargeModule' },
  { label: 'Blog', href: '/blog', icon: <BookOpen size={15} />, flagKey: 'blogModule' },
  { label: 'Support', href: '/support', icon: <LifeBuoy size={15} />, flagKey: 'supportModule' },
];

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Header() {
  const { flags } = useFeatureFlags();
  const { user, profile, signOut, isAdmin, isMerchant, isAffiliate } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const visibleNav = mainNav.filter(item => !item.flagKey || flags[item.flagKey]);

  return (
    <>
      <header
        className={clsx(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/10 bg-slate-950/95 backdrop-blur-md shadow-lg'
            : 'bg-slate-950/80 backdrop-blur-sm',
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-white font-bold text-sm shadow-glow">
                M
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Munjum</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
              {visibleNav.slice(0, 7).map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition',
                    pathname === item.href
                      ? 'bg-brand-500/20 text-brand-300'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {visibleNav.length > 7 && (
                <div className="relative group">
                  <button className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition">
                    More <ChevronDown size={13} />
                  </button>
                  <div className="absolute left-0 top-full mt-2 w-44 rounded-2xl border border-white/10 bg-slate-900 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {visibleNav.slice(7).map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              {flags.shoppingModule && (
                <Link
                  href="/wishlist"
                  className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  aria-label="Wishlist"
                >
                  <Heart size={18} />
                </Link>
              )}

              {/* Cart */}
              {flags.shoppingModule && (
                <Link
                  href="/cart"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition relative"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                    0
                  </span>
                </Link>
              )}

              {/* User menu */}
              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-brand-300 hover:bg-brand-500/40 transition"
                    aria-label="User menu"
                  >
                    {profile?.displayName?.[0]?.toUpperCase() ?? <User size={16} />}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-white/10 bg-slate-900 shadow-xl py-2">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">
                          {profile?.displayName ?? 'Account'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{profile?.email ?? user.email}</p>
                        <span className="mt-1 inline-block rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-300 capitalize">
                          {profile?.role ?? 'customer'}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition">
                          <User size={14} /> My Profile
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition">
                          <Package size={14} /> My Orders
                        </Link>
                        {flags.affiliateModule && isAffiliate && (
                          <Link href="/affiliate/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition">
                            <Users size={14} /> Affiliate Dashboard
                          </Link>
                        )}
                        {flags.merchantModule && isMerchant && (
                          <Link href="/merchant/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition">
                            <Store size={14} /> Merchant Dashboard
                          </Link>
                        )}
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition">
                            <LayoutDashboard size={14} /> Admin Dashboard
                          </Link>
                        )}
                        <Link href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition">
                          <Settings size={14} /> Settings
                        </Link>
                      </div>
                      <div className="border-t border-white/10 pt-1">
                        <button
                          onClick={signOut}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800 transition"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow hover:bg-brand-400 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar (expandable) */}
          {searchOpen && (
            <div className="pb-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="relative"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  autoFocus
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, coupons..."
                  className="w-full rounded-full border border-white/10 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 bg-slate-950/98 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              {visibleNav.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    pathname === item.href
                      ? 'bg-brand-500/20 text-brand-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              {flags.affiliateModule && (
                <Link href="/affiliate" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">
                  <Users size={15} /> Affiliate
                </Link>
              )}
              {!user && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 mt-3">
                  <Link href="/login" className="rounded-2xl border border-white/10 py-3 text-center text-sm font-medium text-slate-300 hover:bg-slate-800 transition">
                    Login
                  </Link>
                  <Link href="/register" className="rounded-2xl bg-brand-500 py-3 text-center text-sm font-semibold text-white hover:bg-brand-400 transition">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
