export type Locale = 'en' | 'hi' | 'te';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  te: 'తెలుగు',
};

type TranslationKey =
  | 'shopSmartEarnMore'
  | 'shopNow'
  | 'addToCart'
  | 'buyNow'
  | 'myOrders'
  | 'myProfile'
  | 'signIn'
  | 'signUp'
  | 'signOut'
  | 'cashback'
  | 'deals'
  | 'coupons'
  | 'affiliate'
  | 'home'
  | 'cart'
  | 'wishlist'
  | 'search'
  | 'apply'
  | 'save'
  | 'cancel'
  | 'loading'
  | 'success'
  | 'error'
  | 'submit'
  | 'referEarn'
  | 'loyaltyPoints'
  | 'welcomeBack'
  | 'featuredDeals'
  | 'topCategories';

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    shopSmartEarnMore: 'Shop Smart, Earn More',
    shopNow: 'Shop Now',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    myOrders: 'My Orders',
    myProfile: 'My Profile',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    cashback: 'Cashback',
    deals: 'Deals',
    coupons: 'Coupons',
    affiliate: 'Affiliate',
    home: 'Home',
    cart: 'Cart',
    wishlist: 'Wishlist',
    search: 'Search',
    apply: 'Apply',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error',
    submit: 'Submit',
    referEarn: 'Refer & Earn',
    loyaltyPoints: 'Loyalty Points',
    welcomeBack: 'Welcome back!',
    featuredDeals: 'Featured Deals',
    topCategories: 'Top Categories',
  },
  hi: {
    shopSmartEarnMore: 'स्मार्ट खरीदारी, अधिक कमाई',
    shopNow: 'अभी खरीदें',
    addToCart: 'कार्ट में जोड़ें',
    buyNow: 'अभी खरीदें',
    myOrders: 'मेरे ऑर्डर',
    myProfile: 'मेरी प्रोफाइल',
    signIn: 'साइन इन करें',
    signUp: 'साइन अप करें',
    signOut: 'साइन आउट',
    cashback: 'कैशबैक',
    deals: 'डील्स',
    coupons: 'कूपन',
    affiliate: 'एफिलिएट',
    home: 'होम',
    cart: 'कार्ट',
    wishlist: 'विशलिस्ट',
    search: 'खोजें',
    apply: 'लागू करें',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    loading: 'लोड हो रहा है...',
    success: 'सफल!',
    error: 'त्रुटि',
    submit: 'जमा करें',
    referEarn: 'रेफर करें और कमाएं',
    loyaltyPoints: 'लॉयल्टी पॉइंट्स',
    welcomeBack: 'वापस स्वागत है!',
    featuredDeals: 'विशेष डील्स',
    topCategories: 'शीर्ष श्रेणियां',
  },
  te: {
    shopSmartEarnMore: 'స్మార్ట్‌గా కొనుగోలు చేయండి, ఎక్కువ సంపాదించండి',
    shopNow: 'ఇప్పుడు కొనుగోలు చేయండి',
    addToCart: 'కార్ట్‌కు జోడించండి',
    buyNow: 'ఇప్పుడు కొనండి',
    myOrders: 'నా ఆర్డర్లు',
    myProfile: 'నా ప్రొఫైల్',
    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    signOut: 'సైన్ అవుట్',
    cashback: 'క్యాష్‌బ్యాక్',
    deals: 'డీల్స్',
    coupons: 'కూపన్లు',
    affiliate: 'అఫిలియేట్',
    home: 'హోమ్',
    cart: 'కార్ట్',
    wishlist: 'విష్‌లిస్ట్',
    search: 'వెతకండి',
    apply: 'వర్తింపజేయండి',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    loading: 'లోడ్ అవుతోంది...',
    success: 'విజయవంతం!',
    error: 'లోపం',
    submit: 'సమర్పించండి',
    referEarn: 'రెఫర్ చేయండి & సంపాదించండి',
    loyaltyPoints: 'లాయల్టీ పాయింట్లు',
    welcomeBack: 'తిరిగి స్వాగతం!',
    featuredDeals: 'ఫీచర్డ్ డీల్స్',
    topCategories: 'అగ్ర వర్గాలు',
  },
};

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale) {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    localStorage.setItem('munjum_locale', locale);
  }
}

export function getLocale(): Locale {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('munjum_locale') as Locale) ?? 'en';
  }
  return currentLocale;
}

export function t(key: TranslationKey, locale?: Locale): string {
  const loc = locale ?? getLocale();
  return translations[loc]?.[key] ?? translations.en[key] ?? key;
}
