import React from 'react';
import { Dice6, RotateCcw } from 'lucide-react';
import { useAuctionStore } from '../../store/auctionStore';

export function AuctionControls() {
  const {
    generateRandomBids,
    regenerateAuction
  } = useAuctionStore();

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <button
        onClick={generateRandomBids}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
      >
        <Dice6 size={20} />
        <span>Generate Random Bids</span>
      </button>

      <button
        onClick={regenerateAuction}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
      >
        <RotateCcw size={20} />
        <span>Regenerate Auction</span>
      </button>
    </div>
  );
}