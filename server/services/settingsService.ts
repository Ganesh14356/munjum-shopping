import { adminFirestore } from './firebaseAdmin';

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
  affiliateCommissionPct?: number;
  merchantCommissionPct?: number;
  cashbackPct?: number;
}

const defaultSettings: FeatureFlags = {
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
  popularBrands: true,
  affiliateCommissionPct: 5,
  merchantCommissionPct: 10,
  cashbackPct: 3
};

export async function getGlobalSettings(): Promise<FeatureFlags> {
  const docRef = adminFirestore.collection('settings').doc('global');
  const snapshot = await docRef.get();
  if (!snapshot.exists) return defaultSettings;
  return { ...defaultSettings, ...(snapshot.data() as FeatureFlags) };
}

export async function updateGlobalSettings(settings: Partial<FeatureFlags>): Promise<FeatureFlags> {
  const docRef = adminFirestore.collection('settings').doc('global');
  await docRef.set(settings, { merge: true });
  const snapshot = await docRef.get();
  return { ...defaultSettings, ...(snapshot.data() as FeatureFlags) };
}
