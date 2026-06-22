import { Router } from 'express';
import { adminAuth, adminFirestore } from '../services/firebaseAdmin';
import { authenticateUser, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const userDoc = await adminFirestore.collection('users').doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found.' });
    return res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

router.patch('/me', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { displayName, phone, language } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (displayName) updates.displayName = displayName;
    if (phone) updates.phone = phone;
    if (language) updates.language = language;

    await adminFirestore.collection('users').doc(userId).update(updates);
    if (displayName) await adminAuth.updateUser(userId, { displayName });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

router.get('/', authorizeAdmin, async (req, res) => {
  try {
    const { role, limit = '50', offset = '0' } = req.query as Record<string, string>;
    let query: FirebaseFirestore.Query = adminFirestore.collection('users').orderBy('createdAt', 'desc');
    if (role) query = query.where('role', '==', role);
    query = query.limit(Number(limit)).offset(Number(offset));
    const snapshot = await query.get();
    const users = snapshot.docs.map(d => {
      const data = d.data();
      const { email, displayName, role: r, createdAt, status } = data;
      return { id: d.id, email, displayName, role: r, createdAt, status };
    });
    return res.json({ users, total: snapshot.size });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

router.patch('/:id/status', authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) return res.status(400).json({ error: 'Invalid status.' });
    await adminFirestore.collection('users').doc(req.params.id).update({ status });
    if (status === 'suspended') await adminAuth.updateUser(req.params.id, { disabled: true });
    else await adminAuth.updateUser(req.params.id, { disabled: false });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user status.' });
  }
});

router.post('/:id/set-role', authorizeAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['customer', 'affiliate', 'merchant', 'admin', 'support'];
    if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role.' });
    await adminFirestore.collection('users').doc(req.params.id).update({ role });
    await adminAuth.setCustomUserClaims(req.params.id, { role });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to set role.' });
  }
});

export default router;
