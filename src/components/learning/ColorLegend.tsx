import React from 'react';

export function ColorLegend() {
  const legendItems = [
    {
      color: 'green',
      label: 'Winning Bids',
      description: 'Bids that win the auction and contribute to V*'
    },
    {
      color: 'yellow',
      label: 'Excluded Bids',
      description: 'Bids removed when calculating V*j for a specific bidder'
    },
    {
      color: 'blue',
      label: 'Replacement Bids',
      description: 'Bids that fill the auction slots after excluding a bidder'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100 mb-4">
      <h4 className="text-lg font-semibold mb-3 text-indigo-800">Color Legend</h4>
      <div className="space-y-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className={`
                w-6 h-6 rounded-md 
                ${item.color === 'green' ? 'bg-green-100 border-green-300' : 
                  item.color === 'yellow' ? 'bg-yellow-100 border-yellow-300' : 
                  'bg-blue-100 border-blue-300'} 
                border
              `}
            ></div>
            <div>
              <p className="font-semibold text-gray-800">{item.label}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500 italic">
        Use these colors to track how bids change during the Vickrey auction process.
      </div>
    </div>
  );
}