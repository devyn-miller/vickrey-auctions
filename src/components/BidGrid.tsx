import React from 'react';
import { Bid, BidderConfig } from '../types/auction';
import { useAuctionStore } from '../store/auctionStore';

interface BidGridProps {
  bids: Bid[];
  onBidChange: (bid: Bid) => void;
}

export function BidGrid({ bids, onBidChange }: BidGridProps) {
  const {
    equalBidsPerBidder,
    bidsPerBidder,
    bidderConfigs,
    bidderCount
  } = useAuctionStore();

  const getBidderBids = (bidderId: number) => {
    return bids.filter(bid => bid.bidderId === bidderId)
      .sort((a, b) => (a.unitIndex || 0) - (b.unitIndex || 0));
  };

  const getMaxBids = () => {
    if (equalBidsPerBidder) return bidsPerBidder;
    return Math.max(...bidderConfigs.map(c => c.bidCount));
  };

  const maxBids = getMaxBids();
  const bidders = equalBidsPerBidder 
    ? Array.from({ length: bidderCount }, (_, i) => ({ id: i + 1, bidCount: bidsPerBidder }))
    : bidderConfigs;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Bidder</th>
            {Array.from({ length: maxBids }, (_, i) => (
              <th key={i} className="border p-2">Bid {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bidders.map(bidder => {
            const bidderBids = getBidderBids(bidder.id);
            return (
              <tr key={bidder.id}>
                <td className="border p-2">Bidder {bidder.id}</td>
                {Array.from({ length: bidder.bidCount }, (_, i) => {
                  const bid = bidderBids.find(b => b.unitIndex === i);
                  return (
                    <td key={i} className="border p-2">
                      <input
                        type="number"
                        value={bid?.amount || ''}
                        onChange={(e) => onBidChange({
                          bidderId: bidder.id,
                          amount: Number(e.target.value),
                          unitIndex: i
                        })}
                        className="w-full p-1 border rounded"
                        placeholder="Enter bid"
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}