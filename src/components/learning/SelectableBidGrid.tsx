import React from 'react';
import { Bid } from '../../types/auction';
import { InteractiveBidCell } from './InteractiveBidCell';

interface SelectableBidGridProps {
  bids: Bid[];
  currentStep: number;
  highlightedCells: Array<{
    bidderId: number;
    unitIndex: number;
    type: string;
    excludedFor?: number;
  }>;
  onBidSelect?: (bid: Bid) => void;
  isSelectable?: boolean;
  showPrices?: boolean;
}

export function SelectableBidGrid({
  bids,
  currentStep,
  highlightedCells,
  onBidSelect,
  isSelectable,
  showPrices = true
}: SelectableBidGridProps) {
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
            {showPrices && currentStep >= 3 && (
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
                {Array.from({ length: maxUnits }, (_, i) => (
                  <InteractiveBidCell
                    key={i}
                    bid={bidderBids.find(b => b.unitIndex === i)}
                    currentStep={currentStep}
                    highlightedCells={highlightedCells}
                    onSelect={onBidSelect}
                    isSelectable={isSelectable}
                  />
                ))}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}