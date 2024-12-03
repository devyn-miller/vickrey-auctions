import React, { useState, useMemo } from 'react';
import { Bid } from '../../types/auction';
import { groupBidsByBidder } from '../../utils/bidSorting';
import { getCellHighlight, HighlightedCell } from '../../utils/highlightUtils';
import { useAuctionStore } from '../../store/auctionStore';

interface EnhancedBidTableProps {
  bids: Bid[];
  currentStep: number;
  highlightedCells: HighlightedCell[];
  showPrices?: boolean;
  onBidSelect?: (bid: Bid) => void;
  selectedBids?: Bid[];
}

export function EnhancedBidTable({
  bids = [],
  currentStep,
  highlightedCells = [],
  showPrices = true,
  onBidSelect,
  selectedBids = []
}: EnhancedBidTableProps) {
  const { setBids } = useAuctionStore();
  
  // Defensive programming for bid processing
  const bidderMap = useMemo(() => {
    if (!bids || bids.length === 0) return new Map();
    return groupBidsByBidder(bids);
  }, [bids]);

  // Safe calculation of max units
  const maxUnits = useMemo(() => {
    if (!bids || bids.length === 0) return 0;
    return Math.max(...bids.map(bid => bid.unitIndex || 0)) + 1;
  }, [bids]);

  const [editingCell, setEditingCell] = useState<{bidderId: number, unitIndex: number} | null>(null);
  const [editValue, setEditValue] = useState('');

  const isSelected = (bid: Bid) => 
    selectedBids.some(selected => 
      selected.bidderId === bid.bidderId && 
      selected.unitIndex === bid.unitIndex
    );

  const getHighlightClass = (highlight?: HighlightedCell) => {
    if (!highlight) return '';
    switch (highlight.type) {
      case 'winner':
        return 'bg-green-100 border-green-300';
      case 'excluded':
        return 'bg-yellow-100 border-yellow-300';
      case 'replacement':
        return 'bg-blue-100 border-blue-300';
      default:
        return '';
    }
  };

  const startEditing = (bidderId: number, unitIndex: number) => {
    const bid = bids.find(b => b.bidderId === bidderId && b.unitIndex === unitIndex);
    if (bid) {
      setEditingCell({ bidderId, unitIndex });
      setEditValue(bid.amount.toString());
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setEditValue(value);
  };

  const finishEditing = () => {
    if (editingCell) {
      const { bidderId, unitIndex } = editingCell;
      const amount = parseInt(editValue) || 0;

      const newBids = [...bids];
      const existingBidIndex = newBids.findIndex(
        bid => bid.bidderId === bidderId && bid.unitIndex === unitIndex
      );

      if (existingBidIndex >= 0) {
        newBids[existingBidIndex] = { ...newBids[existingBidIndex], amount };
      } else {
        newBids.push({ bidderId, unitIndex, amount });
      }

      setBids(newBids);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditing();
    }
  };

  // If no bids, return null or a placeholder
  if (!bids || bids.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No bids available. Generate or enter bids to populate the table.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bidder
            </th>
            {[...Array(Math.max(1, maxUnits))].map((_, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bid {i + 1}
              </th>
            ))}
            {showPrices && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vickrey Price
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from(bidderMap.entries()).map(([bidderId, bidderBids]) => (
            <tr key={bidderId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Bidder {parseInt(bidderId) + 1}
              </td>
              {[...Array(Math.max(1, maxUnits))].map((_, unitIndex) => {
                const bid = bidderBids.find(b => b.unitIndex === unitIndex);
                const highlight = bid ? getCellHighlight(highlightedCells, bid) : undefined;

                return (
                  <td
                    key={unitIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer ${getHighlightClass(highlight)}`}
                    onClick={() => {
                      if (onBidSelect && bid) {
                        onBidSelect(bid);
                      }
                      if (bid) {
                        startEditing(bid.bidderId, bid.unitIndex);
                      }
                    }}
                  >
                    {editingCell?.bidderId === bidderId && editingCell?.unitIndex === unitIndex ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={finishEditing}
                        onKeyPress={handleKeyPress}
                        className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{bid ? `$${bid.amount}` : '—'}</span>
                        {bid && isSelected(bid) && <span className="text-green-500">✓</span>}
                      </div>
                    )}
                  </td>
                );
              })}
              {showPrices && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bidderBids[0]?.vickreyPrice !== undefined 
                    ? `$${bidderBids[0].vickreyPrice}` 
                    : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}