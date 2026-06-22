'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, Download, Search } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const WITHDRAWALS = [
  { id: 'W001', user: 'Sneha Patel', type: 'Affiliate', amount: 3200, method: 'UPI', account: 'sneha@paytm', requested: '21 Jun 2026', status: 'pending' },
  { id: 'W002', user: 'Ravi Kumar', type: 'Cashback', amount: 500, method: 'Bank', account: 'HDFC ***4521', requested: '20 Jun 2026', status: 'pending' },
  { id: 'W003', user: 'TechZone Store', type: 'Merchant', amount: 12400, method: 'Bank', account: 'ICICI ***7832', requested: '18 Jun 2026', status: 'approved' },
  { id: 'W004', user: 'Priya Sharma', type: 'Affiliate', amount: 1800, method: 'UPI', account: 'priya@gpay', requested: '15 Jun 2026', status: 'paid' },
  { id: 'W005', user: 'Arjun Reddy', type: 'Cashback', amount: 220, method: 'Paytm', account: '9876543210', requested: '12 Jun 2026', status: 'rejected' },
];

const STATUS_COLORS = {
  pending: 'bg-amber-500/10 text-amber-400',
  approved: 'bg-brand-500/10 text-brand-400',
  paid: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-red-500/10 text-red-400',
};

export default function AdminPaymentsPage() {
  const [withdrawals, setWithdrawals] = useState(WITHDRAWALS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = withdrawals.filter(w => {
    const matchStatus = filter === 'all' || w.status === filter;
    const matchSearch = !search || w.user.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = (id: string, status: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
    toast.success(`Withdrawal ${status}`);
  };

  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);
  const totalPaid = withdrawals.filter(w => w.status === 'paid').reduce((s, w) => s + w.amount, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300 transition">← Admin Dashboard</Link>
            <h1 className="text-2xl font-bold text-white mt-1">Payment Management</h1>
          </div>
          <button onClick={() => toast.success('Export initiated')} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition">
            <Download size={13} /> Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Pending Withdrawals', value: `₹${totalPending.toLocaleString()}`, count: withdrawals.filter(w => w.status === 'pending').length, color: 'text-amber-400' },
            { label: 'Approved (Processing)', value: `₹${withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0).toLocaleString()}`, count: withdrawals.filter(w => w.status === 'approved').length, color: 'text-brand-400' },
            { label: 'Total Paid (Jun)', value: `₹${totalPaid.toLocaleString()}`, count: withdrawals.filter(w => w.status === 'paid').length, color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.count} requests</p>
            </div>
          ))}
        </div>

        {/* Cashfree Status */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Cashfree Payments — Connected</p>
            <p className="text-xs text-slate-400">Production mode active. Settlement T+2 days. App ID: CF_****1234</p>
          </div>
          <button onClick={() => toast.success('Opening Cashfree dashboard...')} className="ml-auto text-xs text-brand-400 hover:text-brand-300 transition shrink-0">
            Open Dashboard →
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user..." className="w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 outline-none">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['ID', 'User', 'Type', 'Amount', 'Method', 'Requested', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map(w => (
                  <tr key={w.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-4 text-xs font-mono text-slate-500">{w.id}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-white">{w.user}</p>
                      <p className="text-xs text-slate-500">{w.account}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs rounded-full bg-slate-700/60 text-slate-300 px-2.5 py-1">{w.type}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-white">₹{w.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-xs text-slate-400">{w.method}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{w.requested}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[w.status as keyof typeof STATUS_COLORS]}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {w.status === 'pending' && (
                        <div className="flex gap-1.5">
                          <button onClick={() => updateStatus(w.id, 'approved')} className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30 transition">
                            Approve
                          </button>
                          <button onClick={() => updateStatus(w.id, 'rejected')} className="rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition">
                            Reject
                          </button>
                        </div>
                      )}
                      {w.status === 'approved' && (
                        <button onClick={() => updateStatus(w.id, 'paid')} className="rounded-lg bg-brand-500/20 px-2.5 py-1 text-xs font-medium text-brand-300 hover:bg-brand-500/30 transition">
                          Mark Paid
                        </button>
                      )}
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
