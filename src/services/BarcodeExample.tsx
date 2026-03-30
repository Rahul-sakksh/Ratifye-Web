// Simple example showing how to use React Query with axiosInstancetandt
import React, { useState } from 'react';
import { useApiQuery, useApiPost, useInvalidateQueries } from '../services/apiHooks';

// Example types for your barcode application
interface BarcodeData {
  id: string;
  type: string;
  data: string;
  imageUrl?: string;
  createdAt: string;
}

interface CreateBarcodeRequest {
  type: 'qr' | 'ean13' | 'datamatrix';
  data: string;
  options?: Record<string, any>;
}

export const BarcodeExample: React.FC = () => {
  const [barcodeData, setBarcodeData] = useState('');
  const { invalidateByKey } = useInvalidateQueries();

  // Fetch barcodes list
  const { 
    data: barcodes, 
    isLoading, 
    error,
    refetch 
  } = useApiQuery<BarcodeData[]>(['barcodes'], '/api/barcodes');

  // Create barcode mutation
  const createBarcode = useApiPost<BarcodeData, CreateBarcodeRequest>('/api/barcodes', {
    onSuccess: () => {
      // Refresh the barcodes list after creating a new one
      invalidateByKey(['barcodes']);
      setBarcodeData(''); // Clear form
    },
    onError: (error: any) => {
      console.error('Failed to create barcode:', error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeData.trim()) return;

    createBarcode.mutate({
      type: 'qr',
      data: barcodeData,
      options: {
        width: 200,
        height: 200,
      },
    });
  };

  if (isLoading) {
    return <div className="p-4">Loading barcodes...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading barcodes: {error.message}
        <button 
          onClick={() => refetch()} 
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Barcode Generator</h2>
      
      {/* Create Barcode Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Create New Barcode</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={barcodeData}
            onChange={(e) => setBarcodeData(e.target.value)}
            placeholder="Enter data for barcode"
            className="flex-1 p-2 border rounded"
            disabled={createBarcode.isPending}
          />
          <button
            type="submit"
            disabled={createBarcode.isPending || !barcodeData.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {createBarcode.isPending ? 'Creating...' : 'Generate QR Code'}
          </button>
        </div>
        {createBarcode.error && (
          <p className="text-red-600 text-sm mt-2">
            Error: {createBarcode.error.message}
          </p>
        )}
      </form>

      {/* Barcodes List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Barcodes</h3>
          <button 
            onClick={() => refetch()} 
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Refresh
          </button>
        </div>
        
        {barcodes && barcodes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {barcodes.map((barcode) => (
              <div key={barcode.id} className="p-4 border rounded">
                <div className="text-sm text-gray-600 mb-2">
                  Type: {barcode.type.toUpperCase()}
                </div>
                <div className="text-sm mb-2">
                  Data: {barcode.data}
                </div>
                {barcode.imageUrl && (
                  <img 
                    src={barcode.imageUrl} 
                    alt="Barcode" 
                    className="w-full max-w-32 mx-auto"
                  />
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Created: {new Date(barcode.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No barcodes found. Create your first barcode above!</p>
        )}
      </div>
    </div>
  );
};

export default BarcodeExample;
