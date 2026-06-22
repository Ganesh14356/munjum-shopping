import { AdminDashboard } from '@/components/AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard — Munjum',
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AdminDashboard />
      </div>
    </main>
  );
}
