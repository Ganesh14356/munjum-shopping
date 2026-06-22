import { Router } from 'express';
import { adminFirestore } from '../services/firebaseAdmin';
import { authorizeAdmin, authenticateUser } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, limit = '20' } = req.query as Record<string, string>;
    let query: FirebaseFirestore.Query = adminFirestore
      .collection('coupons')
      .where('active', '==', true)
      .where('expiresAt', '>', new Date().toISOString());
    if (category) query = query.where('category', '==', category);
    query = query.orderBy('expiresAt').limit(Number(limit));
    const snapshot = await query.get();
    return res.json({ coupons: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch coupons.' });
  }
});

router.post('/validate', authenticateUser, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return res.status(400).json({ error: 'code is required.' });

    const snapshot = await adminFirestore.collection('coupons').where('code', '==', code.toUpperCase()).where('active', '==', true).limit(1).get();
    if (snapshot.empty) return res.status(404).json({ error: 'Invalid coupon code.' });

    const coupon = snapshot.docs[0].data();
    if (new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ error: 'Coupon has expired.' });
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) return res.status(400).json({ error: `Minimum order amount is ₹${coupon.minOrderAmount}.` });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ error: 'Coupon usage limit reached.' });

    return res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount ?? null,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Coupon validation failed.' });
  }
});

router.post('/', authorizeAdmin, async (req, res) => {
  try {
    const { code, description, discountType, discountValue, maxDiscount, minOrderAmount, category, expiresAt, usageLimit } = req.body;
    if (!code || !discountType || !discountValue || !expiresAt) return res.status(400).json({ error: 'code, discountType, discountValue, expiresAt are required.' });

    await adminFirestore.collection('coupons').add({
      code: code.toUpperCase(),
      description: description ?? '',
      discountType,
      discountValue: Number(discountValue),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      category: category ?? 'all',
      expiresAt,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usedCount: 0,
      active: true,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create coupon.' });
  }
});

router.patch('/:id', authorizeAdmin, async (req, res) => {
  try {
    await adminFirestore.collection('coupons').doc(req.params.id).update({ ...req.body, updatedAt: new Date().toISOString() });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update coupon.' });
  }
});

export default router;
