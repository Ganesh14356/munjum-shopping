import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { adminFirestore } from '../services/firebaseAdmin';
import { authenticateUser, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.post('/register', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { website, socialHandle, category } = req.body;

    const affiliateRef = adminFirestore.collection('affiliates').doc(userId);
    const existing = await affiliateRef.get();
    if (existing.exists) return res.status(409).json({ error: 'Already registered as affiliate.' });

    const referralCode = `MJ${userId.substring(0, 6).toUpperCase()}`;

    await affiliateRef.set({
      userId,
      referralCode,
      website: website ?? null,
      socialHandle: socialHandle ?? null,
      category: category ?? 'general',
      tier: 'starter',
      commissionPct: 5,
      totalClicks: 0,
      totalConversions: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    await adminFirestore.collection('users').doc(userId).update({ role: 'affiliate', referralCode });

    return res.status(201).json({ referralCode });
  } catch (error) {
    return res.status(500).json({ error: 'Affiliate registration failed.' });
  }
});

router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const affiliateDoc = await adminFirestore.collection('affiliates').doc(userId).get();
    if (!affiliateDoc.exists) return res.status(404).json({ error: 'Affiliate profile not found.' });

    const commissionsSnapshot = await adminFirestore.collection('commissions')
      .where('affiliateId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    return res.json({
      affiliate: { id: affiliateDoc.id, ...affiliateDoc.data() },
      recentCommissions: commissionsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch affiliate dashboard.' });
  }
});

router.post('/track-click', async (req, res) => {
  try {
    const { referralCode, productId, userAgent, ip } = req.body;
    if (!referralCode) return res.status(400).json({ error: 'referralCode is required.' });

    const affiliateQuery = await adminFirestore.collection('affiliates').where('referralCode', '==', referralCode).limit(1).get();
    if (affiliateQuery.empty) return res.status(404).json({ error: 'Invalid referral code.' });

    const affiliateDoc = affiliateQuery.docs[0];
    await affiliateDoc.ref.update({ totalClicks: FieldValue.increment(1) });

    await adminFirestore.collection('clickTracking').add({
      referralCode,
      affiliateId: affiliateDoc.id,
      productId: productId ?? null,
      userAgent: userAgent ?? null,
      createdAt: new Date().toISOString(),
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Click tracking failed.' });
  }
});

router.get('/', authorizeAdmin, async (req, res) => {
  try {
    const snapshot = await adminFirestore.collection('affiliates').orderBy('totalEarnings', 'desc').limit(100).get();
    return res.json({ affiliates: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch affiliates.' });
  }
});

export default router;
