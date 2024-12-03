import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuctionStore } from '../store/auctionStore';

export function AuctionResults() {
  const { results } = useAuctionStore();
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  if (!results) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Results Summary</h3>
        <p className="text-lg">
          Total Value: <span className="font-bold text-green-600">${results.totalValue}</span>
        </p>
      </div>
      
      <div className="space-y-4">
        {results.winners.map((winner, index) => (
          <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <h4 className="font-semibold text-lg mb-2">Bidder {winner.bidderId + 1}</h4>
            <div className="space-y-2">
              <p className="text-gray-700">
                Won with bid: <span className="font-semibold text-gray-900">${winner.winningBid}</span>
              </p>
              <p className="text-gray-700">
                Vickrey price: <span className="font-semibold text-green-600">${winner.vickreyPrice}</span>
              </p>
              <p className="text-sm text-gray-500">
                Savings: ${winner.winningBid - winner.vickreyPrice}
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
            <div className="space-y-4">
              {results.explanation.map((line, index) => (
                <p key={index} className="text-gray-700">{line}</p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-200">
              <h5 className="font-semibold mb-4 text-gray-800">Detailed Calculations</h5>
              <div className="space-y-4">
                {results.winners.map((winner, index) => (
                  <div key={index} className="bg-white bg-opacity-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800">Bidder {winner.bidderId + 1}</p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>1. Original winning bid: ${winner.winningBid}</p>
                      <p>2. Vickrey price: ${winner.vickreyPrice}</p>
                      <p>3. Total savings: ${winner.winningBid - winner.vickreyPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}