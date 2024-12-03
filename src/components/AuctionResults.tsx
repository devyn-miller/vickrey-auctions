import React, { useState } from 'react';
import { AuctionResult } from '../types/auction';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ExportButtons } from './ExportButtons';

interface AuctionResultsProps {
  results: AuctionResult;
}

export function AuctionResults({ results }: AuctionResultsProps) {
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Results</h3>
      <p className="mb-4 text-lg">Total Value: <span className="font-bold">${results.totalValue}</span></p>
      
      <div className="space-y-4">
        {results.winners.map((winner, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-lg mb-2">Bidder {winner.bidderId}</h4>
            <div className="space-y-1">
              <p className="text-gray-600">Won with bid: <span className="font-semibold text-gray-900">${winner.winningBid}</span></p>
              <p className="text-gray-600">Vickrey price: <span className="font-semibold text-gray-900">${winner.vickreyPrice}</span></p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowFullExplanation(!showFullExplanation)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          {showFullExplanation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <span>Show {showFullExplanation ? 'Less' : 'Full'} Explanation</span>
        </button>

        {showFullExplanation && (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg space-y-4">
            {results.explanation.map((line, index) => (
              <p key={index} className="text-sm text-gray-700">{line}</p>
            ))}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h5 className="font-semibold mb-2">Detailed Calculations</h5>
              <div className="space-y-2">
                {results.winners.map((winner, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">For Bidder {winner.bidderId}:</p>
                    <p className="ml-4">1. Original winning bid: ${winner.winningBid}</p>
                    <p className="ml-4">2. Vickrey price: ${winner.vickreyPrice}</p>
                    <p className="ml-4">3. Savings: ${winner.winningBid - winner.vickreyPrice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <ExportButtons results={results} />
    </div>
  );
}