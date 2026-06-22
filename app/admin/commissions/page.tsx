'use client';

import { useState } from 'react';
import { Percent, Save, Info } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { updateAppSettings } from '@/lib/api';

const DEFAULT_COMMISSIONS = {
  affiliateCommissionPct: 5,
  merchantCommissionPct: 10,
  cashbackPct: 3,
  goldenAffiliatePct: 12,
  platinumAffiliatePct: 15,
};

export default function AdminCommissionsPage() {
  const [vals, setVals] = useState(DEFAULT_COMMISSIONS);
  const [saving, setSaving] = useState(false);

  const saveAll = async () => {
    setSaving(true);
    try {
      await updateAppSettings(vals);
      toast.success('Commission rates saved!');
    } catch {
      toast.error('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, keyName, min, max, desc }: { label: string; keyName: keyof typeof vals; min: number; max: number; desc: string }) => (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-white">{label}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={min}
          max={max}
          step={0.5}
          value={vals[keyName]}
          onChange={e => setVals(v => ({ ...v, [keyName]: Number(e.target.value) }))}
          className="w-28 rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500"
        />
        <Percent size={16} className="text-slate-400" />
        <input type="range" min={min} max={max} step={0.5} value={vals[keyName]} onChange={e => setVals(v => ({ ...v, [keyName]: Number(e.target.value) }))} className="flex-1 accent-brand-500" />
        <span className="text-sm font-bold text-brand-400 w-10 text-right">{vals[keyName]}%</span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300 transition">← Admin Dashboard</Link>
          <h1 className="text-2xl font-bold text-white mt-1">Commission Management</h1>
          <p className="text-sm text-slate-400 mt-1">Set platform-wide commission and cashback rates. Changes apply to new transactions immediately.</p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-start gap-3 text-sm">
          <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-300">Changes to commission rates apply only to new transactions. Existing pending commissions are not affected.</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white">Affiliate Commission Tiers</h2>
          <Field label="Starter Commission (Default)" keyName="affiliateCommissionPct" min={1} max={20} desc="Applied to affiliates with < ₹10,000/month in sales" />
          <Field label="Gold Affiliate Commission" keyName="goldenAffiliatePct" min={1} max={25} desc="Applied when affiliate sales ≥ ₹50,000/month" />
          <Field label="Platinum Affiliate Commission" keyName="platinumAffiliatePct" min={1} max={30} desc="Applied when affiliate sales ≥ ₹2,00,000/month" />
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white">Merchant Commission</h2>
          <Field label="Merchant Platform Fee" keyName="merchantCommissionPct" min={1} max={30} desc="Percentage deducted from each merchant sale as platform fee" />
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white">Customer Cashback</h2>
          <Field label="Default Cashback Rate" keyName="cashbackPct" min={0} max={20} desc="Default cashback percentage for customers on eligible purchases" />
        </section>

        {/* Summary */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Current Rate Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(vals).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1').replace('Pct', '')}</span>
                <span className="font-bold text-brand-400">{v}%</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? 'Saving...' : 'Save Commission Rates'}
        </button>
      </div>
    </main>
  );
}
