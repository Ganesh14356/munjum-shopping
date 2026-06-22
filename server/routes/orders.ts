import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { adminFirestore } from '../services/firebaseAdmin';
import { authorizeAdmin, authenticateUser } from '../middleware/auth';

const router = Router();

router.get('/my', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const snapshot = await adminFirestore
      .collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { items, address, paymentMethod, couponCode } = req.body;
    if (!items || !items.length || !address) return res.status(400).json({ error: 'items and address are required.' });

    const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
    const discount = couponCode ? 200 : 0;
    const total = subtotal - discount;

    const orderRef = await adminFirestore.collection('orders').add({
      userId,
      items,
      address,
      paymentMethod,
      couponCode: couponCode ?? null,
      subtotal,
      discount,
      total,
      status: 'processing',
      cashbackStatus: 'pending',
      createdAt: new Date().toISOString(),
    });

    await adminFirestore.collection('wallets').doc(userId).set({
      pendingCashback: FieldValue.increment(Math.round(total * 0.03)),
    }, { merge: true });

    return res.status(201).json({ orderId: orderRef.id, total });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create order.' });
  }
});

router.get('/', authorizeAdmin, async (req, res) => {
  try {
    const { status, limit = '50' } = req.query as Record<string, string>;
    let query: FirebaseFirestore.Query = adminFirestore.collection('orders').orderBy('createdAt', 'desc');
    if (status) query = query.where('status', '==', status);
    query = query.limit(Number(limit));
    const snapshot = await query.get();
    const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

router.patch('/:id/status', authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

    await adminFirestore.collection('orders').doc(req.params.id).update({ status, updatedAt: new Date().toISOString() });

    if (status === 'delivered') {
      const orderDoc = await adminFirestore.collection('orders').doc(req.params.id).get();
      const order = orderDoc.data();
      if (order) {
        const cashback = Math.round(order.total * 0.03);
        await adminFirestore.collection('wallets').doc(order.userId).set({
          cashbackBalance: FieldValue.increment(cashback),
          pendingCashback: FieldValue.increment(-cashback),
        }, { merge: true });
        await adminFirestore.collection('orders').doc(req.params.id).update({ cashbackStatus: 'confirmed' });
      }
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;
