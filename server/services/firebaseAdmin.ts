import admin from 'firebase-admin';

export function initializeFirebaseAdmin() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase admin credentials are required in environment variables.');
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
