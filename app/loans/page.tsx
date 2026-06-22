'use client';

import { useState } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { CreditCard, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

const LOAN_TYPES = [
  { type: 'Personal Loan', icon: '💳', rate: '10.5% p.a.', maxAmount: '₹25 Lakh', tenure: 'Up to 60 months', desc: 'No collateral needed. Quick disbursal in 24 hours.' },
  { type: 'Home Loan', icon: '🏠', rate: '8.5% p.a.', maxAmount: '₹5 Crore', tenure: 'Up to 30 years', desc: 'Lowest rates with easy repayment options.' },
  { type: 'Business Loan', icon: '🏢', rate: '12% p.a.', maxAmount: '₹50 Lakh', tenure: 'Up to 48 months', desc: 'Grow your business with flexible funding.' },
  { type: 'Education Loan', icon: '🎓', rate: '9% p.a.', maxAmount: '₹20 Lakh', tenure: 'Up to 15 years', desc: 'Fund your education. Repayment after course completion.' },
];

export default function LoansPage() {
  const { flags, ready } = useFeatureFlags();
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(24);
  const [rate, setRate] = useState(10.5);

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.loanModule) return <FeatureBlocked title="Loans" message="The loan module is currently disabled by the administrator." />;

  const monthlyRate = rate / 12 / 100;
  const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - amount;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="border-b border-white/10 bg-gradient-to-br from-purple-900/30 to-slate-900 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Loans & Finance 💰</h1>
          <p className="text-slate-400">Compare loans from 30+ banks and NBFCs. Best rates, instant approval.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Loan types */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Choose Loan Type</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOAN_TYPES.map(loan => (
              <div key={loan.type} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3 hover:border-brand-500/30 transition cursor-pointer">
                <span className="text-3xl">{loan.icon}</span>
                <h3 className="text-base font-bold text-white">{loan.type}</h3>
                <div className="space-y-1 text-xs text-slate-400">
                  <p><span className="text-brand-400 font-semibold">{loan.rate}</span> onwards</p>
                  <p>Up to {loan.maxAmount}</p>
                  <p>{loan.tenure}</p>
                </div>
                <p className="text-xs text-slate-500">{loan.desc}</p>
                <button className="w-full rounded-xl bg-brand-500/20 py-2 text-xs font-semibold text-brand-300 hover:bg-brand-500/30 transition flex items-center justify-center gap-1">
                  Apply Now <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* EMI Calculator */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Calculator size={20} className="text-brand-400" />
            <h2 className="text-xl font-bold text-white">EMI Calculator</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Loan Amount</span>
                  <span className="font-semibold text-white">₹{amount.toLocaleString()}</span>
                </div>
                <input type="range" min={50000} max={5000000} step={10000} value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full accent-brand-500" />
                <div className="flex justify-between text-xs text-slate-600"><span>₹50K</span><span>₹50L</span></div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tenure</span>
                  <span className="font-semibold text-white">{tenure} months</span>
                </div>
                <input type="range" min={6} max={84} step={6} value={tenure} onChange={e => setTenure(Number(e.target.value))} className="w-full accent-brand-500" />
                <div className="flex justify-between text-xs text-slate-600"><span>6m</span><span>84m</span></div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Interest Rate (p.a.)</span>
                  <span className="font-semibold text-white">{rate}%</span>
                </div>
                <input type="range" min={7} max={24} step={0.5} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-brand-500" />
                <div className="flex justify-between text-xs text-slate-600"><span>7%</span><span>24%</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Your EMI Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-sm text-slate-400">Monthly EMI</span>
                  <span className="text-2xl font-bold text-brand-400">₹{Math.round(emi).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-sm text-slate-400">Principal Amount</span>
                  <span className="text-sm font-semibold text-white">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-sm text-slate-400">Total Interest</span>
                  <span className="text-sm font-semibold text-red-400">₹{Math.round(totalInterest).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-400">Total Payable</span>
                  <span className="text-sm font-bold text-white">₹{Math.round(totalPayable).toLocaleString()}</span>
                </div>
              </div>
              <button className="w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white hover:bg-brand-400 transition">
                Apply for this Loan
              </button>
            </div>
          </div>
        </section>

        {/* Why Munjum */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <CheckCircle2 size={18} />, title: 'Instant Approval', sub: 'Get loan approved in minutes' },
            { icon: <CreditCard size={18} />, title: 'Best Rates', sub: 'Compare 30+ lenders' },
            { icon: <CheckCircle2 size={18} />, title: 'Zero Hidden Fees', sub: 'Fully transparent process' },
            { icon: <CheckCircle2 size={18} />, title: '100% Digital', sub: 'No paperwork required' },
          ].map(f => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-1.5">
              <span className="text-brand-400">{f.icon}</span>
              <p className="text-sm font-semibold text-white">{f.title}</p>
              <p className="text-xs text-slate-400">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
