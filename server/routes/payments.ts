import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { adminFirestore } from '../services/firebaseAdmin';
import { authenticateUser, authorizeAdmin } from '../middleware/auth';

const router = Router();

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID ?? '';
const CASHFREE_SECRET = process.env.CASHFREE_SECRET_KEY ?? '';
const CASHFREE_BASE = process.env.CASHFREE_ENVIRONMENT === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

router.post('/create-order', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { amount, orderId, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !orderId) return res.status(400).json({ error: 'amount and orderId are required.' });

    const response = await fetch(`${CASHFREE_BASE}/orders`, {
      method: 'POST',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: userId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders?cf_id={order_id}`,
        },
      }),
    });

    const data = await response.json() as Record<string, unknown>;
    if (!response.ok) return res.status(400).json({ error: 'Payment order creation failed.', details: data });

    await adminFirestore.collection('transactions').doc(orderId).set({
      userId,
      orderId,
      amount,
      cfOrderId: data.cf_order_id,
      status: 'created',
      createdAt: new Date().toISOString(),
    });

    return res.json({ paymentSessionId: data.payment_session_id, cfOrderId: data.cf_order_id });
  } catch (error) {
    console.error('Payment create error:', error);
    return res.status(500).json({ error: 'Payment initialization failed.' });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { data } = req.body;
    const orderId = data?.order?.order_id;
    const paymentStatus = data?.payment?.payment_status;

    if (!orderId || !paymentStatus) return res.status(400).json({ error: 'Invalid webhook payload.' });

    await adminFirestore.collection('transactions').doc(orderId).update({
      paymentStatus,
      updatedAt: new Date().toISOString(),
    });

    if (paymentStatus === 'SUCCESS') {
      await adminFirestore.collection('orders').doc(orderId).update({ status: 'confirmed' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
});

router.get('/withdrawals', authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.query as Record<string, string>;
    let query: FirebaseFirestore.Query = adminFirestore.collection('withdrawals').orderBy('requestedAt', 'desc');
    if (status) query = query.where('status', '==', status);
    const snapshot = await query.get();
    return res.json({ withdrawals: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch withdrawals.' });
  }
});

router.post('/withdrawal', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { amount, method, accountDetails } = req.body;
    if (!amount || amount < 100) return res.status(400).json({ error: 'Minimum withdrawal amount is ₹100.' });

    const walletDoc = await adminFirestore.collection('wallets').doc(userId).get();
    const wallet = walletDoc.data();
    if (!wallet || (wallet.cashbackBalance ?? 0) < amount) return res.status(400).json({ error: 'Insufficient balance.' });

    await adminFirestore.collection('withdrawals').add({
      userId,
      amount,
      method,
      accountDetails,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    });

    await adminFirestore.collection('wallets').doc(userId).update({
      cashbackBalance: FieldValue.increment(-amount),
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Withdrawal request failed.' });
  }
});

router.patch('/withdrawals/:id', authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await adminFirestore.collection('withdrawals').doc(req.params.id).update({ status, processedAt: new Date().toISOString() });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update withdrawal.' });
  }
});

export default router;
