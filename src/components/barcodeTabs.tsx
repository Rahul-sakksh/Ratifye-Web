import React from 'react';

const BarcodeTabs: React.FC<{
  activeTab: string;
  setActiveTab: (tab: any) => void;
}> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'gs1', label: 'GS1 Barcodes' },
    { key: '1dbarcodes/other', label: '1D Barcodes/Others' },
    { key: '2d', label: '2D Barcodes' },
  ];

  return (
    <div className="mb-6 flex justify-center sm:justify-start gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 border
            ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default BarcodeTabs