import React from 'react';

export function ColorLegend() {
  return (
    <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Winning Bid</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Excluded for V*j</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Replacement Bid</span>
      </div>
    </div>
  );
}