const STORAGE_KEY = 'barcode_generation_count';
const STATIC_USER_LIMIT = 3;

// Import guest fingerprinting functions
import { getGuestId, getGuestInfo, isGuestUser } from './browserFingerprint';

export interface BarcodeGenerationCount {
  count: number;
  lastReset: string;
  guestId?: string;
}

export const barcodeLimit = {
  getCount: (type: string | undefined): number => {
    const stored = localStorage.getItem(STORAGE_KEY+(type ? `_${type}` : ''));
    if (!stored) return 0;
    
    try {
      const data: BarcodeGenerationCount = JSON.parse(stored);
      return data.count || 0;
    } catch {
      return 0;
    }
  },

  incrementCount: (type:string | undefined): number => {
    const currentCount = barcodeLimit.getCount(type);
    const newCount = currentCount + 1;
    const guestId = getGuestId(); // Get guest ID for tracking
    
    const data: BarcodeGenerationCount = {
      count: newCount,
      lastReset: new Date().toISOString(),
      guestId: isGuestUser() ? guestId : undefined
    };
    
    localStorage.setItem(STORAGE_KEY+(type ? `_${type}` : ''), JSON.stringify(data));
    
    // Log generation for guest users
    if (isGuestUser()) {
      console.log(`📊 Guest barcode generation: ${newCount}/${STATIC_USER_LIMIT} (Guest ID: ${guestId})`);
    }
    
    return newCount;
  },

  canGenerateStatic: (type:string | undefined): boolean => {
    return barcodeLimit.getCount(type) < STATIC_USER_LIMIT;
  },

  getRemainingGenerations: (type: string | undefined): number => {
    const remaining = STATIC_USER_LIMIT - barcodeLimit.getCount(type);
    return Math.max(0, remaining);
  },

  resetCount: (type: string | undefined): void => {
    localStorage.removeItem(STORAGE_KEY+(type ? `_${type}` : ''));
  },

  // Check if user is logged in (you can expand this logic)
  isUserLoggedIn: (): boolean => {
    // Check for auth token or user session
    const authToken = localStorage.getItem('authToken');
    const userSession = localStorage.getItem('userSession');
    return !!(authToken || userSession);
  },

  // Get user information if logged in
  getUserInfo: (): any | null => {
    try {
      const userSession = localStorage.getItem('userSession');
      return userSession ? JSON.parse(userSession) : null;
    } catch {
      return null;
    }
  },

  // Logout user (for testing purposes)
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');
  },

  getLimitStatus: (type:string | undefined): { canGenerate: boolean; message: string; remainingCount: number } => {
    const isLoggedIn = barcodeLimit.isUserLoggedIn();
    const currentCount = barcodeLimit.getCount(type);
    const remainingCount = barcodeLimit.getRemainingGenerations(type);

    if (isLoggedIn) {
      return {
        canGenerate: true,
        message: 'Unlimited generation available',
        remainingCount: -1
      };
    }

    if (currentCount >= STATIC_USER_LIMIT) {
      return {
        canGenerate: false,
        message: `You've reached the limit of ${STATIC_USER_LIMIT} free barcodes. Please login to generate more.`,
        remainingCount: 0
      };
    }

    return {
      canGenerate: true,
      message: `${remainingCount} free generations remaining. Login for unlimited access.`,
      remainingCount
    };
  },

  // Get current guest information
  getGuestInfo: () => {
    return getGuestInfo();
  },

  // Get current guest ID
  getCurrentGuestId: () => {
    return isGuestUser() ? getGuestId() : null;
  }
};

export default barcodeLimit;
