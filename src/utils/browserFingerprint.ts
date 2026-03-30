// Browser fingerprinting utility for guest user identification
export interface BrowserFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  screen: string;
  timezone: string;
  canvas: string;
  memory: string | number;
  cores: string | number;
}

/**
 * Generate a unique browser fingerprint based on device/browser characteristics
 * @returns A unique fingerprint string
 */
export const generateBrowserFingerprint = (): string => {
  try {
    // Create canvas fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint canvas', 2, 2);
    }
    
    const fingerprint: BrowserFingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      memory: (navigator as any).deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown'
    };
    
    // Create hash from fingerprint
    const fingerprintString = JSON.stringify(fingerprint);
    const hash = btoa(fingerprintString)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 32);
    
    return hash;
  } catch (error) {
    console.warn('Error generating browser fingerprint:', error);
    // Fallback to random string if fingerprinting fails
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
};

/**
 * Get or create a unique guest ID for the current browser
 * @returns A persistent guest ID
 */
export const getGuestId = (): string => {
  const GUEST_ID_KEY = 'barcode_guest_id';
  
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  
  if (!guestId) {
    const fingerprint = generateBrowserFingerprint();
    const timestamp = Date.now();
    guestId = `guest_${fingerprint}_${timestamp}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
    
    console.log('✅ New guest ID created:', guestId);
  }
  
  return guestId;
};

/**
 * Get guest ID without creating a new one if it doesn't exist
 * @returns Existing guest ID or null
 */
export const getExistingGuestId = (): string | null => {
  return localStorage.getItem('barcode_guest_id');
};

/**
 * Clear guest ID (useful for testing or privacy)
 */
export const clearGuestId = (): void => {
  localStorage.removeItem('barcode_guest_id');
  console.log('🗑️ Guest ID cleared');
};

/**
 * Check if current user is a guest (not logged in)
 * @returns True if user is a guest
 */
export const isGuestUser = (): boolean => {
  // Check if user has authentication token or session
  const userSession = localStorage.getItem('userSession');
  const authToken = localStorage.getItem('authToken');
  
  return !userSession && !authToken;
};

/**
 * Get guest info for logging and debugging
 * @returns Guest information object
 */
export const getGuestInfo = () => {
  const guestId = getExistingGuestId();
  const isGuest = isGuestUser();
  
  return {
    guestId,
    isGuest,
    hasFingerprint: !!guestId,
    createdAt: guestId ? new Date(parseInt(guestId.split('_')[2])).toISOString() : null
  };
};
