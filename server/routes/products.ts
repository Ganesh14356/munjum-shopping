import { Router } from 'express';
import { adminFirestore } from '../services/firebaseAdmin';
import { authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, limit = '20', offset = '0', q } = req.query as Record<string, string>;
    let query: FirebaseFirestore.Query = adminFirestore.collection('products').where('active', '==', true);

    if (category) query = query.where('category', '==', category);
    query = query.orderBy('createdAt', 'desc').limit(Number(limit)).offset(Number(offset));

    const snapshot = await query.get();
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.json({ products, total: snapshot.size });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await adminFirestore.collection('products').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Product not found.' });
    return res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

router.post('/', authorizeAdmin, async (req, res) => {
  try {
    const { name, price, mrp, category, description, images, cashbackPct, merchantId } = req.body;
    if (!name || !price || !category) return res.status(400).json({ error: 'name, price, category are required.' });

    const docRef = await adminFirestore.collection('products').add({
      name,
      price: Number(price),
      mrp: Number(mrp ?? price),
      category,
      description: description ?? '',
      images: images ?? [],
      cashbackPct: Number(cashbackPct ?? 0),
      merchantId: merchantId ?? null,
      active: true,
      rating: 0,
      reviewCount: 0,
      soldCount: 0,
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ id: docRef.id });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create product.' });
  }
});

router.patch('/:id', authorizeAdmin, async (req, res) => {
  try {
    await adminFirestore.collection('products').doc(req.params.id).update({ ...req.body, updatedAt: new Date().toISOString() });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update product.' });
  }
});

router.delete('/:id', authorizeAdmin, async (req, res) => {
  try {
    await adminFirestore.collection('products').doc(req.params.id).update({ active: false });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});

export default router;
