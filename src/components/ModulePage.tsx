'use client';

import { useMemo } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';

interface ModulePageProps {
  moduleKey: keyof import('@/context/FeatureContext').FeatureFlags;
  title: string;
  description: string;
}

export function ModulePage({ moduleKey, title, description }: ModulePageProps) {
  const { flags, ready } = useFeatureFlags();
  const enabled = useMemo(() => flags[moduleKey], [flags, moduleKey]);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center">Loading module...</div>;
  }

  if (!enabled) {
    return <FeatureBlocked title={title} message="This module is currently disabled in the admin dashboard." />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-glow">
          <div className="space-y-4">
            <div className="rounded-3xl bg-brand-500/10 px-4 py-3 text-sm uppercase tracking-[0.3em] text-brand-200">{title}</div>
            <h1 className="text-4xl font-semibold text-white">{title} Module</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">{description}</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6">
              <h2 className="text-xl font-semibold text-white">Core features</h2>
              <ul className="mt-4 space-y-3 text-slate-400">
                <li>• Modular UI built for admin enable/disable control</li>
                <li>• Firestore-backed data and real-time updates</li>
                <li>• Role-based access for customers, affiliates, merchants, and admins</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6">
              <h2 className="text-xl font-semibold text-white">Module operations</h2>
              <ul className="mt-4 space-y-3 text-slate-400">
                <li>• Dashboard integration</li>
                <li>• Secure API and admin routing</li>
                <li>• PWA-friendly mobile-first experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
