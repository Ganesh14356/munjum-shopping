'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingBag, Download } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 48000, orders: 142, newUsers: 320 },
  { month: 'Feb', revenue: 62000, orders: 188, newUsers: 410 },
  { month: 'Mar', revenue: 78000, orders: 234, newUsers: 580 },
  { month: 'Apr', revenue: 91000, orders: 278, newUsers: 620 },
  { month: 'May', revenue: 105000, orders: 312, newUsers: 740 },
  { month: 'Jun', revenue: 124000, orders: 380, newUsers: 860 },
];

const TOP_PRODUCTS = [
  { name: 'Wireless Headphones', sold: 234, revenue: '₹4,68,000', category: 'Electronics' },
  { name: 'Smart Watch', sold: 189, revenue: '₹11,34,000', category: 'Electronics' },
  { name: 'Running Shoes', sold: 156, revenue: '₹3,90,000', category: 'Sports' },
  { name: 'Cotton T-Shirt', sold: 892, revenue: '₹4,46,000', category: 'Fashion' },
  { name: 'Water Bottle', sold: 540, revenue: '₹1,89,000', category: 'Home' },
];

const maxRevenue = Math.max(...MONTHLY_REVENUE.map(m => m.revenue));

export default function AdminReportsPage() {
  const [activeReport, setActiveReport] = useState<'sales' | 'users' | 'cashback' | 'affiliate'>('sales');

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300 transition">← Admin Dashboard</Link>
            <h1 className="text-2xl font-bold text-white mt-1">Reports & Analytics</h1>
          </div>
          <button
            onClick={() => toast.success('Report download started!')}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>

        {/* Summary KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Revenue (Jun)', value: '₹1,24,000', change: '+18.1%', icon: <DollarSign size={18} />, positive: true },
            { label: 'Total Orders (Jun)', value: '380', change: '+21.8%', icon: <ShoppingBag size={18} />, positive: true },
            { label: 'New Users (Jun)', value: '860', change: '+16.2%', icon: <Users size={18} />, positive: true },
            { label: 'Cashback Paid (Jun)', value: '₹8,400', change: '+12.5%', icon: <TrendingUp size={18} />, positive: true },
          ].map(kpi => (
            <div key={kpi.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-2">
              <span className="text-brand-400">{kpi.icon}</span>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">{kpi.label}</p>
                <span className={`text-xs font-semibold ${kpi.positive ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-white flex items-center gap-2"><BarChart3 size={18} className="text-brand-400" /> Monthly Revenue (2026)</h2>
            <div className="flex gap-1">
              {(['sales', 'users', 'cashback', 'affiliate'] as const).map(r => (
                <button key={r} onClick={() => setActiveReport(r)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${activeReport === r ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-3 h-48">
            {MONTHLY_REVENUE.map(m => {
              const val = activeReport === 'sales' ? m.revenue : activeReport === 'users' ? m.newUsers * 100 : activeReport === 'cashback' ? m.revenue * 0.07 : m.revenue * 0.05;
              const pct = (val / (activeReport === 'sales' ? maxRevenue : maxRevenue * 0.1)) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                    <div
                      className="w-full rounded-t-lg bg-brand-500/60 hover:bg-brand-500 transition-all cursor-default"
                      style={{ height: `${Math.min(100, pct)}%` }}
                      title={activeReport === 'sales' ? `₹${m.revenue.toLocaleString()}` : activeReport === 'users' ? `${m.newUsers} users` : `₹${Math.round(val).toLocaleString()}`}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="text-base font-semibold text-white">Top Selling Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs text-slate-500">#</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Product</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Units Sold</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {TOP_PRODUCTS.map((p, i) => (
                  <tr key={p.name} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 text-sm text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{p.name}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs text-brand-300">{p.category}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-300">{p.sold}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">{p.revenue}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-slate-700">
                          <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${(p.sold / 892) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
