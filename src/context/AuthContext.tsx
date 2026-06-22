'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'customer' | 'affiliate' | 'merchant' | 'admin' | 'support';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  phone?: string;
  referralCode?: string;
  walletBalance?: number;
  cashbackBalance?: number;
  loyaltyPoints?: number;
  createdAt?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isMerchant: boolean;
  isAffiliate: boolean;
  isSupport: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: false,
  signOut: async () => {},
  isAdmin: false,
  isMerchant: false,
  isAffiliate: false,
  isSupport: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Firebase not configured — skip auth listener
    if (!auth) return;

    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      settled = true;
      clearTimeout(timeout);
      setUser(currentUser);

      if (currentUser && db) {
        try {
          const snap = await getDoc(doc(db, 'users', currentUser.uid));
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'customer',
            });
          }
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => { clearTimeout(timeout); unsubscribe(); };
  }, []);

  const signOut = async () => {
    if (auth) await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const role = profile?.role ?? 'customer';

  return (
    <AuthContext.Provider value={{
      user, profile, loading, signOut,
      isAdmin: role === 'admin',
      isMerchant: role === 'merchant',
      isAffiliate: role === 'affiliate',
      isSupport: role === 'support',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
