import React from 'react';
import { FileDown, Share2 } from 'lucide-react';
import { AuctionResult } from '../types/auction';
import { exportToPDF, shareResults } from '../utils/exportUtils';

interface ExportButtonsProps {
  results: AuctionResult;
}

export function ExportButtons({ results }: ExportButtonsProps) {
  return (
    <div className="flex space-x-4 mt-6">
      <button
        onClick={() => exportToPDF(results)}
        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        <FileDown size={20} />
        <span>Export to PDF</span>
      </button>
      
      <button
        onClick={() => shareResults(results)}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <Share2 size={20} />
        <span>Share Results</span>
      </button>
    </div>
  );
}