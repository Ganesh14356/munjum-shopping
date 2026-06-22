'use client';

import { useState } from 'react';
import { Users, Search, Filter, Shield, Store, UserCheck, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const USERS = [
  { id: 'u1', name: 'Ravi Kumar', email: 'ravi@example.com', role: 'customer', orders: 12, cashback: 480, joined: '10 Jan 2026', status: 'active' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@example.com', role: 'affiliate', orders: 3, cashback: 1200, joined: '22 Feb 2026', status: 'active' },
  { id: 'u3', name: 'TechZone Store', email: 'store@techzone.in', role: 'merchant', orders: 0, cashback: 0, joined: '05 Mar 2026', status: 'active' },
  { id: 'u4', name: 'Arjun Reddy', email: 'arjun@example.com', role: 'customer', orders: 5, cashback: 220, joined: '14 Apr 2026', status: 'suspended' },
  { id: 'u5', name: 'Sneha Patel', email: 'sneha@example.com', role: 'affiliate', orders: 0, cashback: 3400, joined: '01 May 2026', status: 'active' },
  { id: 'u6', name: 'FashionMart', email: 'admin@fashionmart.in', role: 'merchant', orders: 0, cashback: 0, joined: '15 May 2026', status: 'pending' },
];

const ROLE_COLORS: Record<string, string> = {
  customer: 'bg-slate-500/10 text-slate-300',
  affiliate: 'bg-brand-500/10 text-brand-300',
  merchant: 'bg-amber-500/10 text-amber-300',
  admin: 'bg-red-500/10 text-red-300',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400',
  suspended: 'bg-red-500/10 text-red-400',
  pending: 'bg-amber-500/10 text-amber-400',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState(USERS);

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    toast.success('User status updated');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300 transition">← Admin Dashboard</Link>
            <h1 className="text-2xl font-bold text-white mt-1">User Management</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users size={15} />
            <span>{filtered.length} users</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Users', value: users.length, icon: <Users size={16} /> },
            { label: 'Customers', value: users.filter(u => u.role === 'customer').length, icon: <UserCheck size={16} /> },
            { label: 'Affiliates', value: users.filter(u => u.role === 'affiliate').length, icon: <Shield size={16} /> },
            { label: 'Merchants', value: users.filter(u => u.role === 'merchant').length, icon: <Store size={16} /> },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex items-center gap-3">
              <span className="text-brand-400">{s.icon}</span>
              <div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-brand-500">
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="affiliate">Affiliate</option>
            <option value="merchant">Merchant</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cashback</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${ROLE_COLORS[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">{user.orders}</td>
                    <td className="px-4 py-4 text-sm text-emerald-400">₹{user.cashback.toLocaleString()}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{user.joined}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className="text-xs rounded-lg border border-white/10 px-2.5 py-1 text-slate-400 hover:bg-slate-700 hover:text-white transition"
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-slate-700 hover:text-white transition">
                          <MoreVertical size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">No users found.</div>
          )}
        </div>
      </div>
    </main>
  );
}
