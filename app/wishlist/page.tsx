'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_WISHLIST = [
  { id: '1', name: 'Sony WH-1000XM5 Headphones', price: 19990, mrp: 29990, cashback: 8 },
  { id: '2', name: 'Apple iPhone 15 128GB', price: 69999, mrp: 79900, cashback: 3 },
  { id: '3', name: 'Nike Air Max 270 (Size 9)', price: 7995, mrp: 11995, cashback: 7 },
  { id: '4', name: 'Kindle Paperwhite 11th Gen', price: 11999, mrp: 14999, cashback: 5 },
];

export default function WishlistPage() {
  const [items, setItems] = useState(INITIAL_WISHLIST);

  const remove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Removed from wishlist');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Heart size={22} className="text-red-400" fill="currentColor" /> My Wishlist ({items.length})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Heart size={50} className="text-slate-600 mx-auto" />
            <p className="text-slate-400">Your wishlist is empty.</p>
            <Link href="/shop" className="inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">Browse Products</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(item => {
              const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
              return (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-brand-500/30 transition">
                  <div className="h-40 bg-slate-800 flex items-center justify-center text-5xl relative">
                    🛍️
                    <span className="absolute top-2 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">-{discount}%</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm font-medium text-white line-clamp-2">{item.name}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-lg font-bold text-white">₹{item.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 line-through">₹{item.mrp.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-emerald-400">+{item.cashback}% Cashback</p>
                    <div className="flex gap-2">
                      <button onClick={() => { toast.success('Added to cart!'); remove(item.id); }} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-2 text-xs font-semibold text-white hover:bg-brand-400 transition">
                        <ShoppingCart size={13} /> Add to Cart
                      </button>
                      <button onClick={() => remove(item.id)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
