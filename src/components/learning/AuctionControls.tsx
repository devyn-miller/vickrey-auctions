import React from 'react';
import { PlusCircle, MinusCircle, Settings } from 'lucide-react';
import { useAuctionStore } from '../../store/auctionStore';

export function AuctionControls() {
  const {
    itemCount,
    bidderCount,
    bidsPerBidder,
    setItemCount,
    setBidderCount,
    setBidsPerBidder
  } = useAuctionStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Units for Sale:</label>
          <div className="flex items-center">
            <button
              onClick={() => itemCount > 1 && setItemCount(itemCount - 1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <MinusCircle size={20} className="text-gray-600" />
            </button>
            <span className="w-8 text-center">{itemCount}</span>
            <button
              onClick={() => setItemCount(itemCount + 1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <PlusCircle size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Bidders:</label>
          <div className="flex items-center">
            <button
              onClick={() => bidderCount > 1 && setBidderCount(bidderCount - 1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <MinusCircle size={20} className="text-gray-600" />
            </button>
            <span className="w-8 text-center">{bidderCount}</span>
            <button
              onClick={() => setBidderCount(bidderCount + 1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <PlusCircle size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Bids per Bidder:</label>
          <div className="flex items-center">
            <button
              onClick={() => bidsPerBidder > 1 && setBidsPerBidder(bidsPerBidder - 1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <MinusCircle size={20} className="text-gray-600" />
            </button>
            <span className="w-8 text-center">{bidsPerBidder}</span>
            <button
              onClick={() => setBidsPerBidder(bidsPerBidder + 1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <PlusCircle size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}