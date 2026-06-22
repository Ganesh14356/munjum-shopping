import { Router } from 'express';
import { authorizeAdmin } from '../middleware/auth';
import { getGlobalSettings, updateGlobalSettings } from '../services/settingsService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const settings = await getGlobalSettings();
    return res.json(settings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to fetch settings.' });
  }
});

router.patch('/', authorizeAdmin, async (req, res) => {
  try {
    const updated = await updateGlobalSettings(req.body);
    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to update settings.' });
  }
});

export default router;
