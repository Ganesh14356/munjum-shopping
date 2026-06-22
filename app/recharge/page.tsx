'use client';

import { useState } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { Smartphone, Tv, Zap, Wifi, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

type RechargeTab = 'mobile' | 'dth' | 'electricity' | 'broadband';

const QUICK_AMOUNTS = [19, 49, 99, 149, 199, 249, 299, 399, 499, 599, 699, 999];

const OPERATORS = {
  mobile: ['Jio', 'Airtel', 'Vi (Vodafone)', 'BSNL'],
  dth: ['Tata Play', 'Airtel DTH', 'Dish TV', 'Sun Direct', 'd2h'],
  electricity: ['TSSPDCL', 'TSNPDCL', 'BESCOM', 'MSEDCL', 'CESC'],
  broadband: ['Jio Fiber', 'Airtel Xstream', 'ACT Fibernet', 'BSNL Broadband'],
};

const POPULAR_PACKS = [
  { name: 'Jio 84 Days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', price: 629 },
  { name: 'Airtel 28 Days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', price: 299 },
  { name: 'Vi 56 Days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', price: 499 },
];

export default function RechargePage() {
  const { flags, ready } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState<RechargeTab>('mobile');
  const [mobileNo, setMobileNo] = useState('');
  const [selectedOp, setSelectedOp] = useState('');
  const [amount, setAmount] = useState('');

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.rechargeModule) return <FeatureBlocked title="Recharge" message="The recharge module is currently disabled by the administrator." />;

  const tabs = [
    { key: 'mobile' as RechargeTab, label: 'Mobile', icon: <Smartphone size={16} /> },
    { key: 'dth' as RechargeTab, label: 'DTH', icon: <Tv size={16} /> },
    { key: 'electricity' as RechargeTab, label: 'Electricity', icon: <Zap size={16} /> },
    { key: 'broadband' as RechargeTab, label: 'Broadband', icon: <Wifi size={16} /> },
  ];

  const handleProceed = () => {
    if (!mobileNo || !selectedOp || !amount) {
      toast.error('Please fill all fields');
      return;
    }
    toast.success(`Proceeding to pay ₹${amount} for ${selectedOp} recharge`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Recharge & Bills 📱</h1>
          <p className="text-slate-400 mt-2">Instant recharge + up to 5% cashback on every transaction</p>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-slate-900/60 p-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-medium transition ${activeTab === t.key ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">
              {activeTab === 'mobile' ? 'Mobile Number' : activeTab === 'electricity' ? 'Account / Consumer Number' : 'Account Number'}
            </label>
            <input
              value={mobileNo}
              onChange={e => setMobileNo(e.target.value)}
              placeholder={activeTab === 'mobile' ? 'Enter 10-digit mobile number' : 'Enter account number'}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
              maxLength={activeTab === 'mobile' ? 10 : 20}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Operator / Provider</label>
            <select
              value={selectedOp}
              onChange={e => setSelectedOp(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-slate-300 outline-none focus:border-brand-500"
            >
              <option value="">Select operator</option>
              {OPERATORS[activeTab].map(op => <option key={op}>{op}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Amount (₹)</label>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount or choose below"
              type="number"
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
            />
            {activeTab === 'mobile' && (
              <div className="grid grid-cols-6 gap-2">
                {QUICK_AMOUNTS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className={`rounded-xl py-1.5 text-xs font-medium transition ${amount === String(a) ? 'bg-brand-500 text-white' : 'border border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    ₹{a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {amount && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              You'll earn ₹{Math.round(Number(amount) * 0.03)} cashback on this transaction!
            </div>
          )}

          <button
            onClick={handleProceed}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow"
          >
            Proceed to Pay <ArrowRight size={16} />
          </button>
        </div>

        {/* Popular Packs */}
        {activeTab === 'mobile' && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">Popular Packs</h2>
            {POPULAR_PACKS.map(pack => (
              <div key={pack.name} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex items-center justify-between hover:border-brand-500/30 transition">
                <div>
                  <p className="text-sm font-bold text-white">{pack.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{pack.data} · {pack.calls} calls · {pack.sms} SMS</p>
                </div>
                <button
                  onClick={() => setAmount(String(pack.price))}
                  className="rounded-xl bg-brand-500/20 px-4 py-2 text-sm font-bold text-brand-300 hover:bg-brand-500/30 transition"
                >
                  ₹{pack.price}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
