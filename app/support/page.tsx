'use client';

import { useState } from 'react';
import { useFeatureFlags } from '@/context/FeatureContext';
import { FeatureBlocked } from '@/components/FeatureBlocked';
import { LifeBuoy, MessageSquare, Mail, Phone, ChevronDown, ChevronUp, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const FAQS = [
  { q: 'How do I track my order?', a: 'Go to My Orders in your profile. You\'ll see real-time status updates and a tracking link once the order is shipped.' },
  { q: 'When will my cashback be credited?', a: 'Cashback is credited within 7-10 days after the order is delivered and the return window expires.' },
  { q: 'How do I withdraw my cashback balance?', a: 'Go to Cashback → Wallet → Withdraw. Minimum withdrawal is ₹100. Supports UPI, Bank Transfer, and Paytm.' },
  { q: 'How do I become an affiliate?', a: 'Visit the Affiliate page and click "Join Free". Fill in your details and get approved within 24 hours.' },
  { q: 'Can I return a product?', a: 'Yes, most products have a 7-day return policy. Go to My Orders → Return Request and follow the steps.' },
  { q: 'How do I contact a merchant?', a: 'Open the product page and scroll to seller info. You can message the merchant through our platform.' },
  { q: 'My payment failed but money was deducted. What do I do?', a: 'Don\'t worry — failed payment refunds are processed within 5-7 business days back to your original payment method. Raise a ticket below for faster resolution.' },
  { q: 'How do I register as a merchant?', a: 'Go to the Merchant page and click "Register as Merchant". Upload your GSTIN, bank details, and product catalogue to get started.' },
];

export default function SupportPage() {
  const { flags, ready } = useFeatureFlags();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!flags.supportModule) return <FeatureBlocked title="Support" message="The support module is currently disabled by the administrator." />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Ticket raised! We\'ll respond within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 px-4 py-10 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-2 text-sm font-medium text-brand-200 mb-4">
          <LifeBuoy size={14} /> Support Center
        </span>
        <h1 className="text-3xl font-bold text-white">How can we help you?</h1>
        <p className="text-slate-400 mt-2">We're available 9 AM – 9 PM IST, 7 days a week.</p>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Contact options */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: <MessageSquare size={22} />, title: 'Live Chat', sub: 'Chat with our team now', action: 'Start Chat', color: 'text-brand-400' },
            { icon: <Mail size={22} />, title: 'Email Support', sub: 'support@munjum.in', action: 'Send Email', color: 'text-emerald-400' },
            { icon: <Phone size={22} />, title: 'Call Us', sub: '+91 98765 43210', action: 'Call Now', color: 'text-amber-400' },
          ].map(c => (
            <button
              key={c.title}
              onClick={() => toast.success(`${c.title} initiated!`)}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center space-y-3 hover:border-brand-500/30 transition group"
            >
              <span className={`inline-block ${c.color}`}>{c.icon}</span>
              <p className="text-base font-semibold text-white">{c.title}</p>
              <p className="text-sm text-slate-400">{c.sub}</p>
              <span className="inline-block text-xs font-semibold text-brand-300 group-hover:underline">{c.action} →</span>
            </button>
          ))}
        </div>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
                <button
                  className="flex items-center justify-between w-full px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form / Ticket */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Raise a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Full Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400">Email Address *</label>
                <input
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Subject</label>
              <select
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-brand-500"
              >
                <option value="">Select issue type</option>
                <option>Order not delivered</option>
                <option>Payment issue</option>
                <option>Cashback not credited</option>
                <option>Affiliate commission query</option>
                <option>Account access issue</option>
                <option>Return / Refund request</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Message *</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={5}
                placeholder="Describe your issue in detail..."
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400 transition disabled:opacity-60"
            >
              <Send size={14} />
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
