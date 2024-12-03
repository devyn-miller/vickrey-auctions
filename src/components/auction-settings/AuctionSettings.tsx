import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { Slider } from '../ui/Slider';

export function AuctionSettings() {
  const {
    itemCount,
    bidderCount,
    bidsPerBidder,
    setItemCount,
    setBidderCount,
    setBidsPerBidder,
  } = useAuctionStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex justify-between text-gray-700 font-medium">
            <span>Number of Items</span>
            <span className="text-gray-500">{itemCount}</span>
          </label>
          <Slider
            value={itemCount}
            onChange={(value) => setItemCount(value)}
            min={1}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-gray-700 font-medium">
            <span>Number of Bidders</span>
            <span className="text-gray-500">{bidderCount}</span>
          </label>
          <Slider
            value={bidderCount}
            onChange={(value) => setBidderCount(value)}
            min={1}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-gray-700 font-medium">
            <span>Bids per Bidder</span>
            <span className="text-gray-500">{bidsPerBidder}</span>
          </label>
          <Slider
            value={bidsPerBidder}
            onChange={(value) => setBidsPerBidder(value)}
            min={1}
            max={10}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
