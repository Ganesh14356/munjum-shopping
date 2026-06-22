'use client';

const CASHFREE_JS_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';

let cashfreeLoaded = false;

export async function loadCashfree(): Promise<unknown> {
  if (typeof window === 'undefined') throw new Error('Cashfree can only be loaded in browser.');
  if (cashfreeLoaded && (window as any).Cashfree) return (window as any).Cashfree;

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CASHFREE_JS_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => { cashfreeLoaded = true; resolve((window as any).Cashfree); });
      return;
    }
    const script = document.createElement('script');
    script.src = CASHFREE_JS_URL;
    script.async = true;
    script.onload = () => { cashfreeLoaded = true; resolve((window as any).Cashfree); };
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK.'));
    document.head.appendChild(script);
  });
}

export interface CashfreeOrderParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export async function initiateCashfreePayment(params: CashfreeOrderParams, apiBase: string): Promise<void> {
  const response = await fetch(`${apiBase}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json() as { error?: string };
    throw new Error(err.error ?? 'Payment initialization failed.');
  }

  const { paymentSessionId } = await response.json() as { paymentSessionId: string };

  const Cashfree = await loadCashfree();
  const cf = new (Cashfree as any)({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox' });
  await cf.checkout({ paymentSessionId, redirectTarget: '_modal' });
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
