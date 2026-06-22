'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import Link from 'next/link';
import { Package, DollarSign, ShoppingBag, TrendingUp, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATS = [
  { label: 'Total Revenue', value: '₹84,200', sub: '+₹12,400 this month', icon: <DollarSign size={18} />, color: 'text-emerald-400' },
  { label: 'Total Orders', value: '312', sub: '28 pending', icon: <ShoppingBag size={18} />, color: 'text-brand-400' },
  { label: 'Products', value: '64', sub: '3 low stock', icon: <Package size={18} />, color: 'text-amber-400' },
  { label: 'Avg. Rating', value: '4.4 ⭐', sub: '120 reviews', icon: <TrendingUp size={18} />, color: 'text-purple-400' },
];

const PRODUCTS = [
  { id: 'p1', name: 'Wireless Keyboard Pro', price: 1999, stock: 45, sold: 120, status: 'active' },
  { id: 'p2', name: 'USB-C Hub 7-in-1', price: 2499, stock: 12, sold: 88, status: 'active' },
  { id: 'p3', name: 'Laptop Stand Adjustable', price: 899, stock: 3, sold: 234, status: 'low_stock' },
  { id: 'p4', name: 'Mechanical Keyboard', price: 4999, stock: 0, sold: 67, status: 'out_of_stock' },
];

const RECENT_ORDERS = [
  { id: 'MJ001', customer: 'Ravi K.', product: 'Wireless Keyboard Pro', amount: '₹1,999', date: '22 Jun', status: 'new' },
  { id: 'MJ002', customer: 'Priya M.', product: 'USB-C Hub', amount: '₹2,499', date: '21 Jun', status: 'shipped' },
  { id: 'MJ003', customer: 'Arjun S.', product: 'Laptop Stand', amount: '₹899', date: '20 Jun', status: 'delivered' },
];

const STATUS_BADGE = {
  active: 'bg-emerald-500/10 text-emerald-400',
  low_stock: 'bg-amber-500/10 text-amber-400',
  out_of_stock: 'bg-red-500/10 text-red-400',
};

export default function MerchantDashboardPage() {
  const { user, isMerchant } = useAuth();
  const { flags, ready } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.merchantModule) return <FeatureBlocked title="Merchant" message="Merchant module is disabled." />;

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Login to access your merchant dashboard</h2>
          <Link href="/login" className="inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Merchant Dashboard</h1>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">Verified Merchant</span>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(s => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <span className={s.color}>{s.icon}</span>
              <p className="text-2xl font-bold text-white mt-2">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              <p className="text-xs text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-white/10 bg-slate-900/50 p-1 w-fit">
          {(['overview', 'products', 'orders'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${activeTab === tab ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <h3 className="text-base font-semibold text-white mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {RECENT_ORDERS.map(order => (
                  <div key={order.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">#{order.id.slice(-1)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{order.product}</p>
                      <p className="text-xs text-slate-500">{order.customer} · {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">{order.amount}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'new' ? 'text-brand-400 bg-brand-500/10' : order.status === 'shipped' ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
              <h3 className="text-base font-semibold text-white">Quick Actions</h3>
              {[
                { label: 'Add New Product', href: '#', icon: <Plus size={15} /> },
                { label: 'Manage Inventory', href: '#', icon: <Package size={15} /> },
                { label: 'View All Orders', href: '#', icon: <ShoppingBag size={15} /> },
                { label: 'Commission Reports', href: '#', icon: <TrendingUp size={15} /> },
              ].map(a => (
                <Link key={a.label} href={a.href} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">
                  <span className="text-brand-400">{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Product Catalogue</h3>
              <button onClick={() => toast.success('Add product form coming soon!')} className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-400 transition">
                <Plus size={13} /> Add Product
              </button>
            </div>

            {PRODUCTS.map(p => (
              <div key={p.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">🛍️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                    <span>₹{p.price.toLocaleString()}</span>
                    <span>Stock: {p.stock}</span>
                    <span>Sold: {p.sold}</span>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[p.status as keyof typeof STATUS_BADGE]}`}>
                  {p.status.replace('_', ' ')}
                </span>
                <div className="flex gap-1">
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition"><Edit size={13} /></button>
                  <button onClick={() => toast.error('Delete product?')} className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}

            {PRODUCTS.some(p => p.stock <= 5) && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-center gap-3 text-sm">
                <AlertCircle size={16} className="text-amber-400 shrink-0" />
                <span className="text-amber-300">Some products are running low on stock. Update inventory to avoid order cancellations.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h3 className="text-base font-semibold text-white">All Orders</h3>
            </div>
            <div className="divide-y divide-white/10">
              {RECENT_ORDERS.map(order => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="text-xs font-mono text-slate-500">#{order.id}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{order.product}</p>
                    <p className="text-xs text-slate-500">{order.customer}</p>
                  </div>
                  <span className="text-sm font-bold text-white">{order.amount}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${order.status === 'new' ? 'bg-brand-500/10 text-brand-400' : order.status === 'shipped' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {order.status}
                  </span>
                  <button onClick={() => toast.success('Order updated!')} className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition">
                    Update
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
