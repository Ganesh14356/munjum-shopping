'use client';

import { useState } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { Plane, Train, Bus, Hotel, Search, Calendar, ArrowRight, Users } from 'lucide-react';

type TravelTab = 'flights' | 'trains' | 'buses' | 'hotels';

const POPULAR_ROUTES = [
  { from: 'HYD', to: 'DEL', fromName: 'Hyderabad', toName: 'Delhi', price: 3499, airline: 'IndiGo', duration: '2h 15m' },
  { from: 'HYD', to: 'BLR', fromName: 'Hyderabad', toName: 'Bangalore', price: 1999, airline: 'Air India', duration: '1h 10m' },
  { from: 'HYD', to: 'MUM', fromName: 'Hyderabad', toName: 'Mumbai', price: 2799, airline: 'SpiceJet', duration: '1h 45m' },
];

const POPULAR_HOTELS = [
  { name: 'The Grand Hyderabad', location: 'Banjara Hills', price: 3499, rating: 4.7, category: '5 Star' },
  { name: 'Trident Hotel', location: 'Hitech City', price: 5999, rating: 4.8, category: '5 Star' },
  { name: 'Lemon Tree Premier', location: 'Gachibowli', price: 2199, rating: 4.4, category: '4 Star' },
];

export default function TravelPage() {
  const { flags, ready } = useFeatureFlags();
  const [activeTab, setActiveTab] = useState<TravelTab>('flights');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.travelModule) return <FeatureBlocked title="Travel" message="The travel booking module is currently disabled by the administrator." />;

  const tabs = [
    { key: 'flights' as TravelTab, label: 'Flights', icon: <Plane size={16} /> },
    { key: 'trains' as TravelTab, label: 'Trains', icon: <Train size={16} /> },
    { key: 'buses' as TravelTab, label: 'Buses', icon: <Bus size={16} /> },
    { key: 'hotels' as TravelTab, label: 'Hotels', icon: <Hotel size={16} /> },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-b border-white/10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Travel Booking ✈️</h1>
            <p className="text-slate-300 mt-2">Book flights, trains, buses & hotels at the best prices with cashback</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-1 rounded-2xl border border-white/10 bg-slate-900/60 p-1 w-fit mx-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition ${activeTab === tab.key ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
            {(activeTab === 'flights' || activeTab === 'buses') && (
              <div className="flex gap-3 mb-4">
                {(['one-way', 'round-trip'] as const).map(t => (
                  <label key={t} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name="tripType" value={t} checked={tripType === t} onChange={() => setTripType(t)} className="accent-brand-500" />
                    <span className="capitalize">{t.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase tracking-wider">From</label>
                <div className="relative">
                  <input placeholder={activeTab === 'hotels' ? 'City or Hotel name' : 'From city'} className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
                </div>
              </div>

              {activeTab !== 'hotels' && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">To</label>
                  <input placeholder="To city" className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500" />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase tracking-wider">{activeTab === 'hotels' ? 'Check-in' : 'Departure'}</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input type="date" className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 pl-9 text-sm text-white outline-none focus:border-brand-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase tracking-wider">{activeTab === 'hotels' ? 'Check-out' : 'Travellers'}</label>
                {activeTab === 'hotels' ? (
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input type="date" className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 pl-9 text-sm text-white outline-none focus:border-brand-500" />
                  </div>
                ) : (
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <select className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 pl-9 text-sm text-slate-300 outline-none focus:border-brand-500">
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n}>{n} Traveller{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white hover:bg-brand-400 transition shadow-glow">
              <Search size={16} /> Search {tabs.find(t => t.key === activeTab)?.label}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Popular Routes */}
        {activeTab === 'flights' && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Popular Flight Routes</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {POPULAR_ROUTES.map(r => (
                <div key={r.from + r.to} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 hover:border-brand-500/30 transition cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <p className="text-xl font-bold text-white">{r.from}</p>
                      <p className="text-xs text-slate-500">{r.fromName}</p>
                    </div>
                    <ArrowRight size={18} className="text-brand-400 mx-auto flex-1" />
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{r.to}</p>
                      <p className="text-xs text-slate-500">{r.toName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{r.airline} · {r.duration}</p>
                  <p className="text-2xl font-bold text-brand-400">₹{r.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">one way</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Hotels */}
        {activeTab === 'hotels' && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Popular Hotels</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {POPULAR_HOTELS.map(h => (
                <div key={h.name} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 hover:border-brand-500/30 transition cursor-pointer space-y-2">
                  <div className="h-28 rounded-xl bg-slate-800 flex items-center justify-center text-4xl mb-3">🏨</div>
                  <span className="text-xs rounded-full bg-brand-500/20 text-brand-300 px-2 py-0.5">{h.category}</span>
                  <h3 className="text-sm font-bold text-white">{h.name}</h3>
                  <p className="text-xs text-slate-400">{h.location}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-white">₹{h.price.toLocaleString()}<span className="text-xs text-slate-400">/night</span></p>
                    <span className="text-xs rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5">⭐ {h.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cashback banner */}
        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Earn up to 12% Cashback on Travel Bookings</h3>
            <p className="text-sm text-slate-400 mt-1">Book any travel through Munjum and earn cashback in your wallet.</p>
          </div>
          <span className="text-4xl">🏷️</span>
        </div>
      </div>
    </main>
  );
}
