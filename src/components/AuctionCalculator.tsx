import React, { useState } from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { PlusCircle, MinusCircle, Dice6, RotateCcw, XCircle } from 'lucide-react';
import { BidInput } from './BidInput';
import { BidTable } from './BidTable';
import { AuctionResults } from './AuctionResults';

export function AuctionCalculator() {
  const {
    bids,
    itemCount,
    bidderCount,
    results,
    setBids,
    setItemCount,
    setBidderCount,
    calculateResults,
    generateRandomBids,
    clearAll,
    regenerateAuction
  } = useAuctionStore();

  const [newBid, setNewBid] = useState({ bidderId: 1, amount: '' });

  const addBid = () => {
    if (newBid.amount && !isNaN(Number(newBid.amount))) {
      setBids([...bids, { ...newBid, amount: Number(newBid.amount) }]);
      setNewBid({ bidderId: 1, amount: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Auction Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-32">Number of Items:</label>
              <button 
                onClick={() => itemCount > 1 && setItemCount(itemCount - 1)}
                className="p-1 hover:text-blue-600"
              >
                <MinusCircle size={20} />
              </button>
              <span className="w-8 text-center">{itemCount}</span>
              <button 
                onClick={() => setItemCount(itemCount + 1)}
                className="p-1 hover:text-blue-600"
              >
                <PlusCircle size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-32">Number of Bidders:</label>
              <button 
                onClick={() => bidderCount > 1 && setBidderCount(bidderCount - 1)}
                className="p-1 hover:text-blue-600"
              >
                <MinusCircle size={20} />
              </button>
              <span className="w-8 text-center">{bidderCount}</span>
              <button 
                onClick={() => setBidderCount(bidderCount + 1)}
                className="p-1 hover:text-blue-600"
              >
                <PlusCircle size={20} />
              </button>
            </div>

            <BidInput
              bidderCount={bidderCount}
              newBid={newBid}
              setNewBid={setNewBid}
              onAdd={addBid}
            />

            <div className="space-y-2">
              <button
                onClick={generateRandomBids}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                <Dice6 size={20} />
                <span>Generate Random Bids</span>
              </button>

              <button
                onClick={regenerateAuction}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                <RotateCcw size={20} />
                <span>Regenerate Auction</span>
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={calculateResults}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Calculate Results
              </button>

              <button
                onClick={clearAll}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                <XCircle size={20} />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current Bids</h2>
          <BidTable bids={bids} />
          {results && <AuctionResults results={results} />}
        </div>
      </div>
    </div>
  );
}