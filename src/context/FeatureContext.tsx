'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FeatureFlags {
  shoppingModule: boolean;
  affiliateModule: boolean;
  cashbackModule: boolean;
  couponsModule: boolean;
  dealsModule: boolean;
  merchantModule: boolean;
  foodDeliveryModule: boolean;
  travelModule: boolean;
  insuranceModule: boolean;
  loanModule: boolean;
  rechargeModule: boolean;
  blogModule: boolean;
  supportModule: boolean;
  bannerSlider: boolean;
  categories: boolean;
  topDeals: boolean;
  couponsSection: boolean;
  trendingProducts: boolean;
  cashbackOffers: boolean;
  referEarn: boolean;
  popularBrands: boolean;
}

const defaultFlags: FeatureFlags = {
  shoppingModule: true,
  affiliateModule: true,
  cashbackModule: true,
  couponsModule: true,
  dealsModule: true,
  merchantModule: true,
  foodDeliveryModule: true,
  travelModule: true,
  insuranceModule: true,
  loanModule: true,
  rechargeModule: true,
  blogModule: true,
  supportModule: true,
  bannerSlider: true,
  categories: true,
  topDeals: true,
  couponsSection: true,
  trendingProducts: true,
  cashbackOffers: true,
  referEarn: true,
  popularBrands: true
};

const FeatureContext = createContext<{ flags: FeatureFlags; ready: boolean }>({ flags: defaultFlags, ready: true });

export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'global');
    getDoc(settingsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setFlags({ ...defaultFlags, ...(snapshot.data() as Partial<FeatureFlags>) });
        }
      })
      .catch(() => {
        // Firebase unavailable — keep default flags
      });
  }, []);

  return <FeatureContext.Provider value={{ flags, ready: true }}>{children}</FeatureContext.Provider>;
}

export function useFeatureFlags() {
  return useContext(FeatureContext);
}
