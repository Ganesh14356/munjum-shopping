export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-brand-400">Legal</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-2 text-slate-400">Last updated: June 2025</p>
        </div>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          {[
            ['1. Information We Collect', 'We collect information you provide directly (name, email, phone), usage data (pages visited, products viewed), and transaction data (orders, cashback, withdrawals).'],
            ['2. How We Use Information', 'Your information is used to process orders, calculate cashback, manage your wallet, send notifications, improve our services, and comply with legal obligations.'],
            ['3. Data Sharing', 'We do not sell your personal data. We share data only with payment processors (Cashfree), delivery partners, and as required by law.'],
            ['4. Firebase & Google', 'We use Firebase (by Google) for authentication, database, and storage. Your data is stored securely in Google Cloud infrastructure.'],
            ['5. Cookies', 'We use cookies and local storage to maintain your session and preferences. You can disable cookies in your browser settings.'],
            ['6. Data Security', 'We implement industry-standard security measures. However, no method of transmission over the internet is 100% secure.'],
            ['7. Your Rights', 'You have the right to access, correct, or delete your personal data. Contact us at support@munjum.in to exercise these rights.'],
            ['8. Children\'s Privacy', 'Munjum is not intended for users under 18 years of age. We do not knowingly collect data from minors.'],
            ['9. Contact Us', 'For privacy-related questions, email us at privacy@munjum.in'],
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
