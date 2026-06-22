'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Package, ChevronRight, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';

const SAMPLE_ORDERS = [
  { id: 'MJ2026001', date: '20 Jun 2026', items: ['Wireless Headphones', 'T-Shirt'], total: 2498, status: 'delivered', cashback: 150, trackingId: 'IND123456789' },
  { id: 'MJ2026002', date: '18 Jun 2026', items: ['Smart Watch'], total: 5999, status: 'shipped', cashback: 300, trackingId: 'IND987654321' },
  { id: 'MJ2026003', date: '15 Jun 2026', items: ['Yoga Mat', 'Water Bottle'], total: 1148, status: 'processing', cashback: 80, trackingId: null },
  { id: 'MJ2026004', date: '10 Jun 2026', items: ['Running Shoes'], total: 2499, status: 'cancelled', cashback: 0, trackingId: null },
];

const STATUS_MAP = {
  delivered: { label: 'Delivered', icon: <CheckCircle2 size={14} />, color: 'text-emerald-400 bg-emerald-500/10' },
  shipped: { label: 'Shipped', icon: <Truck size={14} />, color: 'text-brand-400 bg-brand-500/10' },
  processing: { label: 'Processing', icon: <Clock size={14} />, color: 'text-amber-400 bg-amber-500/10' },
  cancelled: { label: 'Cancelled', icon: <XCircle size={14} />, color: 'text-red-400 bg-red-500/10' },
};

export default function OrdersPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 text-center">
        <div className="space-y-4">
          <Package size={50} className="text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Please login to view your orders</h2>
          <Link href="/login" className="inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

        <div className="space-y-4">
          {SAMPLE_ORDERS.map(order => {
            const status = STATUS_MAP[order.status as keyof typeof STATUS_MAP];
            return (
              <div key={order.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3 hover:border-brand-500/30 transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Order #{order.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.date}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>

                <div className="space-y-1">
                  {order.items.map(item => (
                    <p key={item} className="text-sm text-slate-300">{item}</p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="space-y-0.5">
                    <p className="text-base font-bold text-white">₹{order.total.toLocaleString()}</p>
                    {order.cashback > 0 && (
                      <p className="text-xs text-emerald-400">+₹{order.cashback} cashback {order.status === 'delivered' ? 'credited' : 'pending'}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {order.trackingId && (
                      <button className="text-xs text-brand-400 hover:text-brand-300 transition">
                        Track Order
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="text-xs border border-white/10 rounded-lg px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition">
                        Return
                      </button>
                    )}
                    <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition">
                      Details <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {SAMPLE_ORDERS.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <Package size={50} className="text-slate-600 mx-auto" />
            <p className="text-slate-400">You haven't placed any orders yet.</p>
            <Link href="/shop" className="inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
