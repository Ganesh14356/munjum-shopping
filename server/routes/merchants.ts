import { Router } from 'express';
import { adminFirestore } from '../services/firebaseAdmin';
import { authenticateUser, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.post('/register', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { storeName, gstin, bankAccount, ifsc, phone } = req.body;
    if (!storeName || !gstin) return res.status(400).json({ error: 'storeName and gstin are required.' });

    const merchantRef = adminFirestore.collection('merchants').doc(userId);
    const existing = await merchantRef.get();
    if (existing.exists) return res.status(409).json({ error: 'Already registered as merchant.' });

    await merchantRef.set({
      userId,
      storeName,
      gstin,
      bankAccount: bankAccount ?? null,
      ifsc: ifsc ?? null,
      phone,
      commissionPct: 10,
      totalRevenue: 0,
      totalOrders: 0,
      rating: 0,
      reviewCount: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    await adminFirestore.collection('users').doc(userId).update({ role: 'merchant' });

    return res.status(201).json({ merchantId: userId });
  } catch (error) {
    return res.status(500).json({ error: 'Merchant registration failed.' });
  }
});

router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const merchantDoc = await adminFirestore.collection('merchants').doc(userId).get();
    if (!merchantDoc.exists) return res.status(404).json({ error: 'Merchant profile not found.' });

    const productsSnapshot = await adminFirestore.collection('products')
      .where('merchantId', '==', userId)
      .where('active', '==', true)
      .limit(20)
      .get();

    const ordersSnapshot = await adminFirestore.collection('orders')
      .where('merchantId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    return res.json({
      merchant: { id: merchantDoc.id, ...merchantDoc.data() },
      products: productsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
      recentOrders: ordersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch merchant dashboard.' });
  }
});

router.get('/', authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.query as Record<string, string>;
    let query: FirebaseFirestore.Query = adminFirestore.collection('merchants').orderBy('createdAt', 'desc');
    if (status) query = query.where('status', '==', status);
    const snapshot = await query.get();
    return res.json({ merchants: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch merchants.' });
  }
});

router.patch('/:id/approve', authorizeAdmin, async (req, res) => {
  try {
    await adminFirestore.collection('merchants').doc(req.params.id).update({ status: 'active', approvedAt: new Date().toISOString() });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to approve merchant.' });
  }
});

export default router;
