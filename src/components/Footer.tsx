'use client';

import Link from 'next/link';
import {
  ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin,
} from 'lucide-react';
import { useFeatureFlags } from '@/context/FeatureContext';

export function Footer() {
  const { flags } = useFeatureFlags();
  const year = new Date().getFullYear();

  const shopLinks = [
    { label: 'All Products', href: '/shop', show: flags.shoppingModule },
    { label: 'Deals & Offers', href: '/deals', show: flags.dealsModule },
    { label: 'Coupons', href: '/coupons', show: flags.couponsModule },
    { label: 'Cashback', href: '/cashback', show: flags.cashbackModule },
    { label: 'Wishlist', href: '/wishlist', show: flags.shoppingModule },
  ].filter(l => l.show);

  const serviceLinks = [
    { label: 'Food Delivery', href: '/food', show: flags.foodDeliveryModule },
    { label: 'Travel Booking', href: '/travel', show: flags.travelModule },
    { label: 'Insurance', href: '/insurance', show: flags.insuranceModule },
    { label: 'Loans & EMI', href: '/loans', show: flags.loanModule },
    { label: 'Recharge & Bills', href: '/recharge', show: flags.rechargeModule },
  ].filter(l => l.show);

  const earnLinks = [
    { label: 'Affiliate Program', href: '/affiliate', show: flags.affiliateModule },
    { label: 'Merchant Partner', href: '/merchant', show: flags.merchantModule },
    { label: 'Cashback Wallet', href: '/cashback', show: flags.cashbackModule },
    { label: 'Refer & Earn', href: '/refer', show: true },
    { label: 'Loyalty Points', href: '/profile', show: true },
  ].filter(l => l.show);

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Support', href: '/support' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white font-bold shadow-glow">
                M
              </div>
              <span className="text-xl font-bold text-white">Munjum</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Shop Smart, Earn More. Your one-stop super-app for shopping, cashback, affiliate programs, and essential services.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail size={12} /> support@munjum.in
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={12} /> +91 98765 43210
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> Hyderabad, Telangana
              </span>
            </div>
            <div className="flex gap-3">
              {[
                { icon: <Facebook size={16} />, href: '#', label: 'Facebook' },
                { icon: <Twitter size={16} />, href: '#', label: 'Twitter' },
                { icon: <Instagram size={16} />, href: '#', label: 'Instagram' },
                { icon: <Youtube size={16} />, href: '#', label: 'YouTube' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 hover:bg-brand-500/20 hover:text-brand-300 hover:border-brand-500/40 transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shopping */}
          {shopLinks.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Shopping</p>
              <ul className="space-y-2.5">
                {shopLinks.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {serviceLinks.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Services</p>
              <ul className="space-y-2.5">
                {serviceLinks.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Earn & Company */}
          <div className="space-y-8">
            {earnLinks.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Earn</p>
                <ul className="space-y-2.5">
                  {earnLinks.map(l => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Company</p>
              <ul className="space-y-2.5">
                {companyLinks.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {year} Munjum Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition">Terms of Service</Link>
            <Link href="/refund" className="hover:text-slate-300 transition">Refund Policy</Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShoppingBag size={12} className="text-brand-400" />
            <span>Powered by <span className="text-brand-300 font-medium">Cashfree</span> Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
