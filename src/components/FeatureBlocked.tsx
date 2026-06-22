interface FeatureBlockedProps {
  title: string;
  message: string;
}

export function FeatureBlocked({ title, message }: FeatureBlockedProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-12 shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300">Module unavailable</p>
          <h1 className="mt-4 text-4xl font-semibold">{title} is disabled</h1>
          <p className="mt-4 text-slate-400">{message}</p>
          <div className="mt-8">
            <a href="/admin" className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">Open Admin Dashboard</a>
          </div>
        </div>
      </div>
    </main>
  );
}
