export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-brand-400">Legal</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Terms of Service</h1>
          <p className="mt-2 text-slate-400">Last updated: June 2025</p>
        </div>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          {[
            ['1. Acceptance of Terms', 'By accessing and using Munjum, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.'],
            ['2. Use of Platform', 'Munjum provides a super shopping platform with cashback, affiliate programs, and various services. You agree to use the platform only for lawful purposes.'],
            ['3. User Accounts', 'You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account.'],
            ['4. Cashback & Rewards', 'Cashback is credited after order delivery and verification. Munjum reserves the right to modify cashback rates at any time. Rewards cannot be transferred or exchanged for cash except through official withdrawal methods.'],
            ['5. Affiliate Program', 'Affiliate commissions are earned on successful referred purchases. Fraudulent referrals will result in account termination and forfeiture of earnings.'],
            ['6. Prohibited Activities', 'You may not use Munjum to engage in fraud, spam, reverse engineering, or any activity that disrupts the platform or other users.'],
            ['7. Limitation of Liability', 'Munjum is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.'],
            ['8. Changes to Terms', 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.'],
            ['9. Contact', 'For questions about these terms, contact us at support@munjum.in'],
          ].map(([title, body]) => (
            <div key={title as string}>
              <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
