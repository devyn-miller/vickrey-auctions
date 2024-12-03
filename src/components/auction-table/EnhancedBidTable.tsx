import React from 'react';
import { Bid } from '../../types/auction';
import { groupBidsByBidder } from '../../utils/bidSorting';
import { getCellHighlight, HighlightedCell } from '../../utils/highlightUtils';

interface EnhancedBidTableProps {
  bids: Bid[];
  currentStep: number;
  highlightedCells: HighlightedCell[];
  showPrices?: boolean;
  onBidSelect?: (bid: Bid) => void;
  selectedBids?: Bid[];
}

export function EnhancedBidTable({
  bids,
  currentStep,
  highlightedCells,
  showPrices = true,
  onBidSelect,
  selectedBids = []
}: EnhancedBidTableProps) {
  const bidderMap = groupBidsByBidder(bids);
  const maxUnits = Math.max(...bids.map(bid => bid.unitIndex || 0)) + 1;

  const isSelected = (bid: Bid) => 
    selectedBids.some(selected => 
      selected.bidderId === bid.bidderId && 
      selected.unitIndex === bid.unitIndex
    );

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
            {showPrices && currentStep >= 3 && (
              <th className="border p-2 bg-gray-50">Vickrey Price</th>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from(bidderMap.entries()).map(([bidderId, bidderBids]) => (
            <tr key={bidderId}>
              <td className="border p-2">Bidder {bidderId}</td>
              {Array.from({ length: maxUnits }, (_, i) => {
                const bid = bidderBids.find(b => b.unitIndex === i);
                const highlight = getCellHighlight(bid, currentStep, highlightedCells);
                
                return (
                  <td 
                    key={i} 
                    onClick={() => bid && onBidSelect?.(bid)}
                    className={`
                      border p-2 transition-colors duration-300
                      ${highlight.className}
                      ${onBidSelect ? 'cursor-pointer hover:bg-gray-50' : ''}
                      ${isSelected(bid!) ? 'ring-2 ring-blue-500' : ''}
                    `}
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
              {showPrices && currentStep >= 3 && (
                <td className="border p-2 font-semibold">
                  {bidderBids.some(b => 
                    highlightedCells.some(h => 
                      h.bidderId === bidderId && 
                      h.type === 'winner'
                    )
                  ) ? (
                    <span className="text-green-600">
                      ${bidderBids[0]?.vickreyPrice || '-'}
                    </span>
                  ) : '-'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}