import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { getCellHighlight } from '../../utils/highlightUtils';

export function HighlightedBidGrid() {
  const { bids, currentStep, highlightedCells } = useAuctionStore();

  const maxUnits = Math.max(...bids.map(bid => bid.unitIndex || 0)) + 1;
  const uniqueBidders = Array.from(new Set(bids.map(b => b.bidderId))).sort();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-50">Bidder</th>
            {Array.from({ length: maxUnits }, (_, i) => (
              <th key={i} className="border p-2 bg-gray-50">
                Bid for Unit {i + 1}
              </th>
            ))}
            {currentStep >= 3 && (
              <th className="border p-2 bg-gray-50">Vickrey Price</th>
            )}
          </tr>
        </thead>
        <tbody>
          {uniqueBidders.map(bidderId => {
            const bidderBids = bids
              .filter(b => b.bidderId === bidderId)
              .sort((a, b) => (a.unitIndex || 0) - (b.unitIndex || 0));

            return (
              <tr key={bidderId}>
                <td className="border p-2">Bidder {bidderId}</td>
                {Array.from({ length: maxUnits }, (_, i) => {
                  const bid = bidderBids.find(b => b.unitIndex === i);
                  const highlight = getCellHighlight(bid, currentStep, highlightedCells);
                  
                  return (
                    <td 
                      key={i} 
                      className={`border p-2 transition-colors duration-300 ${highlight.className}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{bid?.amount || '-'}</span>
                        {highlight.tooltip && (
                          <span className="ml-2 text-xs text-gray-500 italic">
                            {highlight.tooltip}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
                {currentStep >= 3 && (
                  <td className="border p-2 font-semibold">
                    {bidderBids.some(b => 
                      highlightedCells.some(h => 
                        h.bidderId === bidderId && h.type === 'winner'
                      )
                    ) ? (
                      <span className="text-green-600">
                        ${bidderBids[0]?.vickreyPrice || 0}
                      </span>
                    ) : '-'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}