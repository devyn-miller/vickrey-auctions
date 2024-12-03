import React, { useState, useEffect } from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { BidTable } from './BidTable';
import { AuctionResults } from './AuctionResults';
import { AuctionSettings } from './auction-settings/AuctionSettings';

export function AuctionCalculator() {
  const { 
    bids, 
    setBids, 
    results, 
    generateRandomBids, 
    clearAll
  } = useAuctionStore();

  const [localBids, setLocalBids] = useState(bids);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalBids(bids);
  }, [bids]);

  const handleBidChange = (bidderId: number, unitIndex: number, amount: number) => {
    const updatedBids = localBids.map(bid => 
      bid.bidderId === bidderId && bid.unitIndex === unitIndex 
        ? { ...bid, amount } 
        : bid
    );
    setLocalBids(updatedBids);
    // Automatically update bids when changed
    setBids(updatedBids);
  };

  const handleShareResults = () => {
    if (!results) return;

    const shareText = `Vickrey Auction Results:
Total Auction Value: $${results.totalValue}

Winners:
${results.winners.map(winner => 
  `Bidder ${winner.bidderId}:
  - Winning Bids: ${winner.winningBids.map(b => `$${b}`).join(', ')}
  - Vickrey Price: $${winner.vickreyPrice}`
).join('\n\n')}

Calculated using Vickrey Auction Helper: ${window.location.href}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Auction Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Settings and Bid Table */}
        <div className="space-y-6">
          {/* Auction Settings Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Auction Settings</h2>
            <AuctionSettings />
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={generateRandomBids}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Generate Random Bids
              </button>
              <button
                onClick={clearAll}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Bid Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Bids</h2>
            <BidTable 
              bids={localBids} 
              handleBidChange={handleBidChange} 
            />
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
          {results && (
            <div>
              <AuctionResults />
              <button 
                onClick={handleShareResults}
                className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : ''
                }`}
              >
                {copied ? 'Copied!' : 'Share Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}