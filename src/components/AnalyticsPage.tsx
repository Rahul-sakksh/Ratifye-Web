import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from 'chart.js';
import { Pie, Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axiosInstancetandt from '../services/axiosInstance';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

// Type definitions
interface ScanData {
  id: string;
  deviceId: string | null;
  latitude: string | null;
  longitude: string | null;
  barcodeDetails: {
    [key: string]: {
      type: string;
      details: {
        url: string;
        device: string;
      };
    };
    defaultURL: string;
    barcodeImageUrl: string;
  };
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  companyName: string | null;
  barcode: {
    id: string;
  };
  userAgent: string;
  ipAddress: string;
  scanSource: string;
  deviceType: string;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsPageProps {}

interface DeviceTypeData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    borderWidth: number;
    borderColor: string;
  }[];
}

interface LocationState {
  barcodeId: string;
}

// Helper function to get week number - MOVED OUTSIDE COMPONENT
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const AnalyticsPage: React.FC<AnalyticsPageProps> = () => {
  const location = useLocation();
  const [scanData, setScanData] = useState<{ datas: ScanData[]; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'day' | 'week' | 'month'>('day');

  // Get barcodeId from location state
  const barcodeId = (location.state as LocationState)?.barcodeId;

  // Fetch scan data when component mounts
  useEffect(() => {
    const fetchScanData = async () => {
      if (!barcodeId) {
        setError('No barcode ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstancetandt.get(
          `/genbarcode/scanned/details/${barcodeId}`
        );
        
        setScanData(response.data);
      } catch (err) {
        console.error('Error fetching scan data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchScanData();
  }, [barcodeId]);

  // Process device type data for pie chart
  const deviceTypeData = useMemo((): DeviceTypeData => {
    if (!scanData?.datas) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: 2,
          borderColor: '#fff',
        }],
      };
    }

    const deviceCounts: { [key: string]: number } = {};
    
    scanData.datas.forEach(scan => {
      const deviceType = scan.deviceType || 'Unknown';
      deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
    });

    const devices = Object.keys(deviceCounts);
    const counts = Object.values(deviceCounts);

    return {
      labels: devices,
      datasets: [
        {
          data: counts,
          backgroundColor: [
            '#8B5CF6',
            '#06B6D4',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
          ],
          hoverBackgroundColor: [
            '#7C3AED',
            '#0891B2',
            '#059669',
            '#D97706',
            '#DC2626',
            '#7C3AED',
          ],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [scanData]);

  // Process data for combo time series chart
  const comboChartData = useMemo(() => {
    if (!scanData?.datas) {
      return { labels: [], lineData: [], barData: [] };
    }

    const timeData: { [key: string]: number } = {};
    const hourlyData: { [key: string]: number } = {};

    scanData.datas.forEach(scan => {
      const date = new Date(scan.createdAt);
      
      // For time scale (continuous)
      const timeKey = date.toISOString();
      
      // For grouping by time frame
      let groupKey: string;
      
      switch (selectedTimeFrame) {
        case 'day':
          groupKey = date.toISOString().split('T')[0];
          break;
        case 'week':
          const week = getWeekNumber(date);
          groupKey = `${date.getFullYear()}-W${week.toString().padStart(2, '0')}`;
          break;
        case 'month':
          groupKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
        default:
          groupKey = date.toISOString().split('T')[0];
      }
      
      timeData[groupKey] = (timeData[groupKey] || 0) + 1;
      
      // For hourly distribution (bar chart)
      const hourKey = `${date.getHours()}:00`;
      hourlyData[hourKey] = (hourlyData[hourKey] || 0) + 1;
    });

    // Sort time data
    const sortedTimeData = Object.entries(timeData)
      .sort(([a], [b]) => {
        if (selectedTimeFrame === 'week') {
          // For week format: "2024-W01"
          const [yearA, weekA] = a.split('-W');
          const [yearB, weekB] = b.split('-W');
          if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
          return parseInt(weekA) - parseInt(weekB);
        } else if (selectedTimeFrame === 'month') {
          // For month format: "2024-01"
          const [yearA, monthA] = a.split('-');
          const [yearB, monthB] = b.split('-');
          if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
          return parseInt(monthA) - parseInt(monthB);
        } else {
          // For day format and others
          return new Date(a).getTime() - new Date(b).getTime();
        }
      });

    // Sort hourly data
    const sortedHourlyData = Object.entries(hourlyData)
      .sort(([a], [b]) => parseInt(a) - parseInt(b));

    return {
      labels: sortedTimeData.map(([label]) => label),
      lineData: sortedTimeData.map(([, count]) => count),
      barLabels: sortedHourlyData.map(([label]) => label),
      barData: sortedHourlyData.map(([, count]) => count),
      timestamps: sortedTimeData.map(([label]) => new Date(label).getTime()),
    };
  }, [scanData, selectedTimeFrame]);

  // Combo chart configuration
  const comboChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Scan Activity - Time Series Analysis',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: selectedTimeFrame,
          tooltipFormat: selectedTimeFrame === 'week' ? '[Week] W - YYYY' : 
                         selectedTimeFrame === 'month' ? 'MMM YYYY' : 'MMM dd',
          displayFormats: {
            day: 'MMM dd',
            week: '[W]WW',
            month: 'MMM YYYY'
          }
        },
        title: {
          display: true,
          text: 'Time Period',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Number of Scans',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
    },
  };

  const comboChartConfig = {
    type: 'line' as const,
    data: {
      labels: comboChartData.labels,
      datasets: [
        {
          label: 'Scan Trend',
          data: comboChartData.lineData,
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#8B5CF6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 10,
          yAxisID: 'y',
        },
        {
          type: 'bar' as const,
          label: 'Daily Peaks',
          data: comboChartData.lineData.map((value, index, array) => {
            // Highlight peaks in the data
            if (index > 0 && index < array.length - 1 && 
                value > array[index - 1] && value > array[index + 1]) {
              return value;
            }
            return null;
          }),
          backgroundColor: 'rgba(239, 68, 68, 0.3)',
          borderColor: 'rgba(239, 68, 68, 0.8)',
          borderWidth: 1,
          yAxisID: 'y',
        },
      ],
    },
    options: comboChartOptions,
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: 'Device Distribution',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  // Calculate additional metrics
  const metrics = useMemo(() => {
    if (!scanData?.datas) return null;

    const totalScans = scanData.datas.length;
    const uniqueDevices = Object.keys(deviceTypeData.labels).length;
    
    // Calculate average scans per day
    const dates = scanData.datas.map(scan => new Date(scan.createdAt).toDateString());
    const uniqueDates = new Set(dates).size;
    const avgScansPerDay = (totalScans / uniqueDates).toFixed(1);

    // Most active device
    const mostActiveDevice = deviceTypeData.labels.reduce((maxDevice, device, index) => {
      return deviceTypeData.datasets[0].data[index] > 
        deviceTypeData.datasets[0].data[deviceTypeData.labels.indexOf(maxDevice)] 
        ? device : maxDevice;
    }, deviceTypeData.labels[0]);

    return {
      totalScans,
      uniqueDevices,
      avgScansPerDay,
      mostActiveDevice,
      dateRange: scanData.datas.length > 0 ? {
        start: new Date(scanData.datas[scanData.datas.length - 1]?.createdAt),
        end: new Date(scanData.datas[0]?.createdAt)
      } : null
    };
  }, [scanData, deviceTypeData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Analytics</h3>
          <p className="text-gray-600">Crunching the numbers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {!barcodeId && (
            <p className="text-sm text-gray-500">
              Please navigate to this page from a barcode with analytics data.
            </p>
          )}
        </div>
      </div>
    );
  }

  // No data state
  if (!scanData || !scanData.datas || scanData.datas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📊</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Data Yet</h2>
          <p className="text-gray-600">Start scanning to see analytics data appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Scan Analytics
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive insights into your barcode performance</p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Barcode ID:</span>
                <span className="font-mono bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {barcodeId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.totalScans}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Devices</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.uniqueDevices}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Scans/Day</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.avgScansPerDay}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Device</p>
                <p className="text-lg font-semibold text-gray-900 mt-2 truncate">{metrics?.mostActiveDevice}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="xl:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <Pie data={deviceTypeData} options={pieChartOptions} />
          </div>

          {/* Combo Chart */}
          <div className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Scan Activity Timeline</h3>
              <div className="flex space-x-2">
                {/* {(['day', 'week', 'month'] as const).map((frame) => (
                  <button
                    key={frame}
                    onClick={() => setSelectedTimeFrame(frame)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTimeFrame === frame
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {frame.charAt(0).toUpperCase() + frame.slice(1)}
                  </button>
                ))} */}
              </div>
            </div>
            <Chart {...comboChartConfig} />
          </div>
        </div>

        {/* Device Type Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Device Analytics</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Device Type</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Scan Count</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Percentage</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {deviceTypeData.labels.map((device, index) => {
                  const count = deviceTypeData.datasets[0].data[index];
                  const percentage = ((count / scanData.datas.length) * 100).toFixed(1);
                  return (
                    <tr key={device} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: deviceTypeData.datasets[0].backgroundColor[index] }}
                          ></div>
                          <span className="font-medium text-gray-900">{device}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{count}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className="text-gray-700 mr-2">{percentage}%</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: deviceTypeData.datasets[0].backgroundColor[index]
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ↗ Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;