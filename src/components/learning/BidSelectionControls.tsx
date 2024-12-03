import React from 'react';
import { Bid } from '../../types/auction';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface BidSelectionControlsProps {
  currentBidder: number;
  onPrevious: () => void;
  onNext: () => void;
  onConfirm: () => void;
  selectedBids: Bid[];
  isValid: boolean;
}

export function BidSelectionControls({
  currentBidder,
  onPrevious,
  onNext,
  onConfirm,
  selectedBids,
  isValid
}: BidSelectionControlsProps) {
  return (
    <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
      <button
        onClick={onPrevious}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        disabled={currentBidder === 1}
      >
        <ArrowLeft size={20} />
        <span>Previous Bidder</span>
      </button>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Selected: {selectedBids.length} bids
        </span>
        <button
          onClick={onConfirm}
          disabled={!isValid}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded
            ${isValid 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          <Check size={20} />
          <span>Confirm Selection</span>
        </button>
      </div>

      <button
        onClick={onNext}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
      >
        <span>Next Bidder</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}