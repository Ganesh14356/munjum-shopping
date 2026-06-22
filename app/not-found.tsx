import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404</p>
        <h1 className="mt-6 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-slate-300">The feature may be disabled in admin settings or the page may not exist.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-brand-500 px-6 py-3 text-white shadow-glow hover:bg-brand-400">
          Return home
        </Link>
      </div>
    </main>
  );
}
