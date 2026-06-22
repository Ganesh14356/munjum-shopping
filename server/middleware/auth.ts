import { RequestHandler } from 'express';
import { adminAuth } from '../services/firebaseAdmin';

async function verifyToken(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]): Promise<ReturnType<typeof adminAuth.verifyIdToken> | null> {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    res.status(401).json({ error: 'Authorization header missing.' });
    return null;
  }
  try {
    return await adminAuth.verifyIdToken(authHeader.replace('Bearer ', ''));
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
    return null;
  }
}

export const authenticateUser: RequestHandler = async (req, res, next) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;
  (req as any).user = decoded;
  next();
};

export const authorizeAdmin: RequestHandler = async (req, res, next) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;
  if (!decoded.admin && decoded.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  (req as any).user = decoded;
  next();
};

export const authorizeRoles = (...roles: string[]): RequestHandler => async (req, res, next) => {
  const decoded = await verifyToken(req, res);
  if (!decoded) return;
  if (!roles.includes(decoded.role as string) && !decoded.admin) {
    return res.status(403).json({ error: `Access restricted to: ${roles.join(', ')}` });
  }
  (req as any).user = decoded;
  next();
};
