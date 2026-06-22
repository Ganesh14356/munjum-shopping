export type UserRole = 'customer' | 'affiliate' | 'merchant' | 'admin' | 'support';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phone?: string;
  role: UserRole;
  referralCode?: string;
  referredBy?: string;
  walletBalance?: number;
  cashbackBalance?: number;
  loyaltyPoints?: number;
  language?: 'en' | 'hi' | 'te';
  status?: 'active' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  mrp: number;
  category: string;
  images: string[];
  merchantId?: string;
  cashbackPct: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  active: boolean;
  badge?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  cashbackPct: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  address: Address;
  paymentMethod: string;
  couponCode?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  cashbackStatus: 'pending' | 'confirmed' | 'rejected';
  trackingId?: string;
  createdAt: string;
}

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount: number;
  category: string;
  expiresAt: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

export interface Affiliate {
  userId: string;
  referralCode: string;
  tier: 'starter' | 'silver' | 'gold' | 'platinum';
  commissionPct: number;
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingEarnings: number;
  status: 'active' | 'suspended';
  website?: string;
  socialHandle?: string;
  createdAt: string;
}

export interface Merchant {
  userId: string;
  storeName: string;
  gstin: string;
  commissionPct: number;
  totalRevenue: number;
  totalOrders: number;
  rating: number;
  reviewCount: number;
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'upi' | 'bank' | 'paytm';
  accountDetails: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface AppSettings {
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
  affiliateCommissionPct: number;
  merchantCommissionPct: number;
  cashbackPct: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}
