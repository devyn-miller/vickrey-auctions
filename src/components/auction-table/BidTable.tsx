import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { getCellHighlight } from './tableUtils';

export function BidTable() {
  const { bids, itemCount, currentStep, highlightedCells } = useAuctionStore((state) => ({
    bids: state.bids,
    itemCount: state.itemCount,
    currentStep: state.currentStep,
    highlightedCells: state.highlightedCells,
  }));

  const maxUnits = Math.max(...bids.map(bid => bid.unitIndex || 0)) + 1;

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
            {currentStep >= 4 && (
              <th className="border p-2 bg-gray-50">Vickrey Price</th>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from(new Set(bids.map(b => b.bidderId))).map(bidderId => {
            const bidderBids = bids.filter(b => b.bidderId === bidderId);
            const winner = currentStep >= 4 && bidderBids.some(b => 
              highlightedCells.some(h => h.bidderId === bidderId && h.type === 'winner')
            );

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
                      {bid?.amount || '-'}
                      {highlight.tooltip && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({highlight.tooltip})
                        </span>
                      )}
                    </td>
                  );
                })}
                {currentStep >= 4 && (
                  <td className="border p-2">
                    {winner ? (
                      <span className="font-semibold text-green-600">
                        ${bidderBids.find(b => 
                          highlightedCells.some(h => 
                            h.bidderId === bidderId && h.type === 'winner'
                          )
                        )?.vickreyPrice || 0}
                      </span>
                    ) : '-'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        {currentStep >= 2 && (
          <tfoot>
            <tr>
              <td colSpan={maxUnits + 1} className="border p-2 font-semibold">
                Total Value (V*):
              </td>
              <td className="border p-2 font-semibold text-blue-600">
                ${useAuctionStore(state => state.results?.totalValue || 0)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}