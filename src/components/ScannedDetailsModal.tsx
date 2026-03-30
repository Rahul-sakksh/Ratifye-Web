import React from 'react';
import { X, Scan, Calendar, MapPin, Monitor, Globe, Loader, Smartphone } from 'lucide-react';

interface ScanLocation {
  city?: string;
  country?: string;
  latitude?: string | number;
  longitude?: string | number;
}

interface ScanData {
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
  location?: ScanLocation;
  deviceType?: string;
  device?: string;
  latitude?: string | number;
  longitude?: string | number;
}

interface ScannedDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  barcodeTitle: string;
  scanData?: ScanData[];
  isLoading?: boolean;
}

const ScannedDetailsModal: React.FC<ScannedDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  barcodeTitle, 
  scanData = [],
  isLoading = false
}) => {
  if (!isOpen) return null;
console.log(scanData,"scanData");

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationText = (location?: ScanLocation): string => {
    if (!location) return 'Not available';
    
    const city = location.city || 'Unknown';
    const country = location.country || 'Unknown';
    return `${city}, ${country}`;
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
      case 'iphone':
      case 'android':
        return <Smartphone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />;
      case 'desktop':
      case 'tablet':
        return <Monitor className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />;
      default:
        return <Monitor className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{backgroundColor:'#00000080'}}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Scan className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Scan Details
              </h3>
              <p className="text-sm text-gray-500">{barcodeTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">Loading Scan Data</h4>
              <p className="text-gray-500 text-sm">
                Fetching scan records for this barcode...
              </p>
            </div>
          ) : scanData.length > 0 ? (
            // Data Loaded State
            <div className="space-y-4">
              {scanData.map((scan, index) => (
                <div 
                  key={`${scan.createdAt}-${index}`} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {/* Date & Time */}
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700 block">Scanned At</span>
                        <p className="text-gray-600 text-xs mt-1">
                          {formatDateTime(scan.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700 block">Coardinates</span>
                        <p className="text-gray-600 text-xs mt-1">
                          {`${scan.latitude || 'N/A'},  ${scan.longitude || 'N/A'}`}
                        </p>
                      </div>
                    </div>

                    {/* Device Type */}
                    <div className="flex items-start gap-2">
                      {getDeviceIcon(scan.deviceType || scan.device)}
                      <div>
                        <span className="font-medium text-gray-700 block">Device Type</span>
                        <p className="text-gray-600 text-xs mt-1">
                          {scan.deviceType || scan.device || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* IP Address */}
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700 block">IP Address</span>
                        <p className="text-gray-600 text-xs mt-1 font-mono">
                          {scan.ipAddress || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Agent - Full width */}
                  {scan.userAgent && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-700 text-sm block mb-1">User Agent</span>
                      <p className="text-gray-600 text-xs font-mono bg-gray-50 p-2 rounded break-all">
                        {scan.userAgent}
                      </p>
                    </div>
                  )}

                  {/* Device-specific information for Device type barcodes */}
                  {scan.device && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-700 text-sm block mb-1">Targeted Device</span>
                      <p className="text-gray-600 text-xs bg-blue-50 p-2 rounded">
                        {scan.device}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-12">
              <Scan className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-500 mb-2">No Scan Records</h4>
              <p className="text-gray-400 text-sm">
                No scans have been recorded for this barcode yet.
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {!isLoading && (
              <span className="font-medium">Total scans: {scanData.length}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScannedDetailsModal;