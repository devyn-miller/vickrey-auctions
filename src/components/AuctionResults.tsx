import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuctionStore } from '../store/auctionStore';

export function AuctionResults() {
  const { results } = useAuctionStore();
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  if (!results) return null;

  // Sort winners by highest winning bid first
  const sortedWinners = [...results.winners].sort((a, b) => {
    const maxBidA = Math.max(...a.winningBids);
    const maxBidB = Math.max(...b.winningBids);
    return maxBidB - maxBidA;
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Results Summary</h3>
        <p className="text-lg">
          Total Value: <span className="font-bold text-green-600">${results.totalValue}</span>
        </p>
      </div>
      
      <div className="space-y-4">
        {sortedWinners.map((winner, index) => (
          <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <h4 className="font-semibold text-lg mb-2">Bidder {winner.bidderId}</h4>
            <div className="space-y-2">
              <p className="text-gray-700">
                Winning bids: {winner.winningBids.map(bid => `$${bid}`).join(', ')}
              </p>
              <p className="text-gray-700">
                Vickrey price: <span className="font-semibold text-green-600">${winner.vickreyPrice}</span>
              </p>
              <p className="text-sm text-gray-500">
                Savings: ${winner.savings}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowFullExplanation(!showFullExplanation)}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {showFullExplanation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <span>{showFullExplanation ? 'Hide' : 'Show'} Detailed Explanation</span>
        </button>

        {showFullExplanation && (
          <div className="mt-4 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-100">
            <div className="space-y-4 whitespace-pre-wrap font-mono text-sm">
              {results.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}