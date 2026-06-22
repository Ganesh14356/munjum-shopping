'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_ITEMS = [
  { id: '1', name: 'Wireless Bluetooth Headphones Pro Max', price: 1999, quantity: 1, cashback: 5 },
  { id: '2', name: 'Premium Cotton T-Shirt (Blue, L)', price: 499, quantity: 2, cashback: 8 },
  { id: '3', name: 'Stainless Steel Water Bottle 1L', price: 349, quantity: 1, cashback: 6 },
];

export default function CartPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SAVE200') {
      setAppliedCoupon('SAVE200');
      toast.success('Coupon applied! ₹200 off');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? 200 : 0;
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const total = subtotal - discount + deliveryFee;
  const totalCashback = items.reduce((sum, item) => sum + Math.round(item.price * item.quantity * item.cashback / 100), 0);

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <ShoppingBag size={60} className="text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
          <p className="text-slate-400 text-sm">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">
            <ShoppingBag size={15} /> Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-6">Shopping Cart ({items.length} items)</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex gap-4">
                <div className="h-20 w-20 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center text-3xl">🛍️</div>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-sm font-medium text-white line-clamp-2">{item.name}</p>
                  <p className="text-xs text-emerald-400">+{item.cashback}% cashback on this item</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-white/10 rounded-xl">
                      <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1.5 text-slate-400 hover:text-white transition"><Minus size={12} /></button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1.5 text-slate-400 hover:text-white transition"><Plus size={12} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Tag size={15} /> Apply Coupon</p>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  disabled={!!appliedCoupon}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 disabled:opacity-50"
                />
                {appliedCoupon ? (
                  <button onClick={() => { setAppliedCoupon(null); setCoupon(''); }} className="rounded-xl border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition">
                    Remove
                  </button>
                ) : (
                  <button onClick={applyCoupon} className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-400 transition">
                    Apply
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="text-xs text-emerald-400 mt-2">✓ {appliedCoupon} applied — ₹200 saved!</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4 sticky top-20">
              <h2 className="text-lg font-bold text-white">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400' : 'text-white'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-base">
                  <span className="text-white">Total</span>
                  <span className="text-white">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                🎉 You'll earn <strong>₹{totalCashback}</strong> cashback on this order!
              </div>

              {subtotal < 499 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
                  Add ₹{499 - subtotal} more for FREE delivery
                </div>
              )}

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow"
              >
                Proceed to Checkout <ArrowRight size={15} />
              </Link>

              <Link href="/shop" className="block text-center text-sm text-slate-400 hover:text-white transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
