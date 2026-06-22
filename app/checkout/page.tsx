'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, Truck, Shield, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const ORDER_SUMMARY = {
  items: [
    { name: 'Wireless Bluetooth Headphones', price: 1999, qty: 1 },
    { name: 'Premium Cotton T-Shirt', price: 499, qty: 2 },
  ],
  subtotal: 2997,
  discount: 200,
  delivery: 0,
  cashback: 180,
};

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', desc: 'Pay via any UPI app', icon: '📱' },
  { id: 'card', label: 'Card', desc: 'Debit / Credit card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: '🏦' },
  { id: 'wallet', label: 'Cashback Wallet', desc: 'Balance: ₹475', icon: '💰' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered', icon: '💵' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', pincode: '', city: '', state: '', street: '', landmark: '' });

  const total = ORDER_SUMMARY.subtotal - ORDER_SUMMARY.discount + ORDER_SUMMARY.delivery;

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 2000));
    toast.success('Order placed! 🎉 You\'ve earned ₹180 cashback.');
    router.push('/orders');
  };

  const steps = [
    { key: 'address', label: 'Address' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.key as typeof step)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${step === s.key ? 'bg-brand-500 text-white' : steps.indexOf(steps.find(x => x.key === step)!) > i ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}
              >
                {i + 1}
              </button>
              <span className={`text-sm font-medium ${step === s.key ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-white/10 w-8 mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Address */}
            {step === 'address' && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><MapPin size={18} className="text-brand-400" /> Delivery Address</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Receiver\'s name' },
                    { key: 'phone', label: 'Phone', placeholder: '10-digit mobile' },
                    { key: 'pincode', label: 'PIN Code', placeholder: '6-digit PIN' },
                    { key: 'city', label: 'City', placeholder: 'City' },
                    { key: 'state', label: 'State', placeholder: 'State' },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-xs text-slate-400">{f.label}</label>
                      <input
                        value={address[f.key as keyof typeof address]}
                        onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-400">Street Address</label>
                    <input
                      value={address.street}
                      onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                      placeholder="Flat/House No., Street, Colony"
                      className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
                <button onClick={() => setStep('payment')} className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment */}
            {step === 'payment' && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard size={18} className="text-brand-400" /> Payment Method</h2>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === pm.id ? 'border-brand-500/60 bg-brand-500/10' : 'border-white/10 hover:border-white/20'}`}>
                      <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-brand-500" />
                      <span className="text-xl">{pm.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{pm.label}</p>
                        <p className="text-xs text-slate-400">{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <input
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                  />
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield size={12} className="text-emerald-400" />
                  <span>Secured by Cashfree Payments. 256-bit SSL encrypted.</span>
                </div>

                <button onClick={() => setStep('review')} className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">
                  Review Order
                </button>
              </div>
            )}

            {/* Review */}
            {step === 'review' && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
                <h2 className="text-lg font-bold text-white">Review & Place Order</h2>
                <div className="divide-y divide-white/10">
                  {ORDER_SUMMARY.items.map(item => (
                    <div key={item.name} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-slate-300">{item.name} × {item.qty}</span>
                      <span className="text-white font-medium">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 p-3 text-sm text-brand-300">
                  Paying via: <strong>{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</strong>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="w-full rounded-xl bg-brand-500 py-4 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow disabled:opacity-60"
                >
                  {placing ? 'Processing payment...' : `Place Order · ₹${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 sticky top-20">
              <h3 className="text-base font-bold text-white">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>₹{ORDER_SUMMARY.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-₹{ORDER_SUMMARY.discount}</span></div>
                <div className="flex justify-between text-emerald-400"><span>Delivery</span><span>FREE</span></div>
                <div className="flex justify-between font-bold text-base text-white border-t border-white/10 pt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              </div>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
                You'll earn <strong>₹{ORDER_SUMMARY.cashback}</strong> cashback after delivery.
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Truck size={12} className="text-brand-400" />
                <span>Estimated delivery in 3-5 working days</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield size={12} className="text-emerald-400" />
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
