import React, { useState } from 'react';
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
  bids,
  currentStep,
  highlightedCells,
  showPrices = true,
  onBidSelect,
  selectedBids = []
}: EnhancedBidTableProps) {
  const { setBids } = useAuctionStore();
  const bidderMap = groupBidsByBidder(bids);
  const maxUnits = Math.max(...bids.map(bid => bid.unitIndex || 0)) + 1;
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
    setEditingCell({ bidderId, unitIndex });
    setEditValue(bid ? bid.amount.toString() : '');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setEditValue(value);
  };

  const finishEditing = () => {
    if (editingCell) {
      const { bidderId, unitIndex } = editingCell;
      const newAmount = parseInt(editValue) || 0;
      
      const updatedBids = [...bids];
      const existingBidIndex = bids.findIndex(
        b => b.bidderId === bidderId && b.unitIndex === unitIndex
      );

      if (existingBidIndex >= 0) {
        updatedBids[existingBidIndex] = {
          ...updatedBids[existingBidIndex],
          amount: newAmount
        };
      } else {
        updatedBids.push({
          bidderId,
          unitIndex,
          amount: newAmount
        });
      }

      setBids(updatedBids);
      setEditingCell(null);
    }
  };

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
              {Array.from({ length: maxUnits }, (_, unitIndex) => {
                const bid = bidderBids.find(b => b.unitIndex === unitIndex);
                const highlight = getCellHighlight(highlightedCells, bidderId, unitIndex);
                const isEditing = editingCell?.bidderId === bidderId && editingCell?.unitIndex === unitIndex;

                return (
                  <td
                    key={unitIndex}
                    className={`border p-2 cursor-pointer hover:bg-gray-50 ${
                      getHighlightClass(highlight)
                    } ${isSelected(bid || { bidderId, unitIndex, amount: 0 }) ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => {
                      if (onBidSelect && bid) {
                        onBidSelect(bid);
                      } else {
                        startEditing(bidderId, unitIndex);
                      }
                    }}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={finishEditing}
                        onKeyDown={(e) => e.key === 'Enter' && finishEditing()}
                        className="w-full p-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      bid ? `$${bid.amount}` : '—'
                    )}
                  </td>
                );
              })}
              {showPrices && currentStep >= 3 && (
                <td className="border p-2">
                  {highlight?.vickreyPrice !== undefined ? `$${highlight.vickreyPrice}` : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}