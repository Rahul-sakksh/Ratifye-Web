// Guest barcode storage utility for managing local barcode history
import { getGuestId } from './browserFingerprint';

export interface GuestBarcodeData {
  id: string;
  guestId: string;
  barcodeImageUrl: string;
  title: string;
  qrType: string;
  selectedType: string;
  defaultURL: string;
  data: any;
  createdAt: string;
  fromDatabase?: boolean;
  jsonData?: any;
}

const GUEST_BARCODES_KEY = 'guest_barcodes_history';
const MAX_STORED_BARCODES = 10; // Limit to prevent localStorage bloat

/**
 * Store a generated barcode for quick local access
 * @param barcodeData The barcode data to store
 */
export const storeGuestBarcode = (barcodeData: Omit<GuestBarcodeData, 'id' | 'guestId' | 'createdAt'>): void => {
  try {
    const guestId = getGuestId();
    const barcodeId = `barcode_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const newBarcode: GuestBarcodeData = {
      id: barcodeId,
      guestId,
      ...barcodeData,
      createdAt: new Date().toISOString()
    };
    
    const existingBarcodes = getStoredGuestBarcodes();
    const updatedBarcodes = [newBarcode, ...existingBarcodes];
    
    // Keep only the most recent barcodes
    const limitedBarcodes = updatedBarcodes.slice(0, MAX_STORED_BARCODES);
    
    localStorage.setItem(GUEST_BARCODES_KEY, JSON.stringify(limitedBarcodes));
    
    console.log('📱 Guest barcode stored locally:', {
      id: barcodeId,
      title: barcodeData.title,
      type: barcodeData.selectedType
    });
  } catch (error) {
    console.error('Error storing guest barcode:', error);
  }
};

/**
 * Retrieve all stored guest barcodes for the current guest
 * @returns Array of stored barcode data
 */
export const getStoredGuestBarcodes = (): GuestBarcodeData[] => {
  try {
    const stored = localStorage.getItem(GUEST_BARCODES_KEY);
    if (!stored) return [];
    
    const barcodes: GuestBarcodeData[] = JSON.parse(stored);
    const currentGuestId = getGuestId();
    
    // Filter barcodes for current guest only
    return barcodes.filter(barcode => barcode.guestId === currentGuestId);
  } catch (error) {
    console.error('Error retrieving guest barcodes:', error);
    return [];
  }
};

/**
 * Get a specific barcode by ID
 * @param barcodeId The ID of the barcode to retrieve
 * @returns The barcode data or null if not found
 */
export const getGuestBarcodeById = (barcodeId: string): GuestBarcodeData | null => {
  const barcodes = getStoredGuestBarcodes();
  return barcodes.find(barcode => barcode.id === barcodeId) || null;
};

/**
 * Remove a specific barcode from storage
 * @param barcodeId The ID of the barcode to remove
 */
export const removeGuestBarcode = (barcodeId: string): void => {
  try {
    const barcodes = getStoredGuestBarcodes();
    const filteredBarcodes = barcodes.filter(barcode => barcode.id !== barcodeId);
    
    localStorage.setItem(GUEST_BARCODES_KEY, JSON.stringify(filteredBarcodes));
    console.log('🗑️ Guest barcode removed:', barcodeId);
  } catch (error) {
    console.error('Error removing guest barcode:', error);
  }
};

/**
 * Clear all stored guest barcodes
 */
export const clearGuestBarcodes = (): void => {
  try {
    localStorage.removeItem(GUEST_BARCODES_KEY);
    console.log('🗑️ All guest barcodes cleared');
  } catch (error) {
    console.error('Error clearing guest barcodes:', error);
  }
};

/**
 * Get guest barcode statistics
 * @returns Statistics about stored barcodes
 */
export const getGuestBarcodeStats = () => {
  const barcodes = getStoredGuestBarcodes();
  const typeCount = barcodes.reduce((acc, barcode) => {
    acc[barcode.selectedType] = (acc[barcode.selectedType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalBarcodes: barcodes.length,
    typeBreakdown: typeCount,
    oldestBarcode: barcodes[barcodes.length - 1]?.createdAt,
    newestBarcode: barcodes[0]?.createdAt,
    storageUsed: new Blob([JSON.stringify(barcodes)]).size
  };
};

/**
 * Export guest barcodes for backup or transfer
 * @returns JSON string of all guest barcodes
 */
export const exportGuestBarcodes = (): string => {
  const barcodes = getStoredGuestBarcodes();
  return JSON.stringify(barcodes, null, 2);
};

/**
 * Import guest barcodes from backup
 * @param importData JSON string of barcode data
 */
export const importGuestBarcodes = (importData: string): boolean => {
  try {
    const importedBarcodes: GuestBarcodeData[] = JSON.parse(importData);
    const existingBarcodes = getStoredGuestBarcodes();
    
    // Merge and deduplicate
    const mergedBarcodes = [...existingBarcodes];
    
    importedBarcodes.forEach(imported => {
      if (!mergedBarcodes.find(existing => existing.id === imported.id)) {
        mergedBarcodes.push(imported);
      }
    });
    
    // Keep within limit
    const limitedBarcodes = mergedBarcodes.slice(0, MAX_STORED_BARCODES);
    localStorage.setItem(GUEST_BARCODES_KEY, JSON.stringify(limitedBarcodes));
    
    console.log('📥 Guest barcodes imported:', importedBarcodes.length);
    return true;
  } catch (error) {
    console.error('Error importing guest barcodes:', error);
    return false;
  }
};
