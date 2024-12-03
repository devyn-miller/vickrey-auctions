import React, { useState, useEffect } from 'react';
import { Bid } from '../types/auction';
import { useAuctionStore } from '../store/auctionStore';
import { Edit3 } from 'lucide-react';

interface BidTableProps {
  bids: Bid[];
}

interface GroupedBids {
  [bidderId: number]: number[];
}

export function BidTable({ bids }: BidTableProps) {
  const { setBids, bidderCount, bidsPerBidder, setBidderCount, setBidsPerBidder } = useAuctionStore();
  const [editingCell, setEditingCell] = useState<{bidderId: number, bidIndex: number} | null>(null);
  const [editValue, setEditValue] = useState('');

  // Group bids by bidder
  const groupedBids: GroupedBids = {};
  bids.forEach((bid) => {
    if (!groupedBids[bid.bidderId]) {
      groupedBids[bid.bidderId] = [];
    }
    groupedBids[bid.bidderId][bid.unitIndex || 0] = bid.amount;
  });

  // Handle dimension changes
  const handleBidderCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value) || 1;
    setBidderCount(Math.max(1, newCount));
  };

  const handleBidsPerBidderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value) || 1;
    setBidsPerBidder(Math.max(1, newCount));
  };

  // Handle cell editing
  const startEditing = (bidderId: number, bidIndex: number) => {
    const value = groupedBids[bidderId]?.[bidIndex];
    setEditingCell({ bidderId, bidIndex });
    setEditValue(value !== undefined ? value.toString() : '');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setEditValue(value);
  };

  const finishEditing = () => {
    if (editingCell) {
      const newBids = [...bids];
      const existingBidIndex = bids.findIndex(
        bid => bid.bidderId === editingCell.bidderId && (bid.unitIndex || 0) === editingCell.bidIndex
      );

      // Only create/update bid if there's a value (including 0)
      if (editValue !== '') {
        const newBid = {
          bidderId: editingCell.bidderId,
          amount: parseInt(editValue),
          unitIndex: editingCell.bidIndex
        };

        if (existingBidIndex >= 0) {
          newBids[existingBidIndex] = newBid;
        } else {
          newBids.push(newBid);
        }
      } else {
        // Remove bid if it exists and user cleared the input
        if (existingBidIndex >= 0) {
          newBids.splice(existingBidIndex, 1);
        }
      }

      setBids(newBids);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  // Create bidder rows based on bidderCount
  const bidderRows = Array.from({ length: bidderCount }, (_, i) => i + 1);
  const bidColumns = Array.from({ length: bidsPerBidder }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Bidders:</label>
          <input
            type="number"
            min="1"
            value={bidderCount}
            onChange={handleBidderCountChange}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Bids per Bidder:</label>
          <input
            type="number"
            min="1"
            value={bidsPerBidder}
            onChange={handleBidsPerBidderChange}
            className="w-20 px-2 py-1 border rounded"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-blue-600" />
            <span className="text-sm text-gray-600">Click any cell to edit. Enter a value (including 0) to place a bid, or clear the input to remove a bid.</span>
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Bidder</th>
                {bidColumns.map((i) => (
                  <th key={i} className="text-right py-2 px-4">Bid {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bidderRows.map((bidderId) => (
                <tr key={bidderId} className="border-b">
                  <td className="py-2 px-4">Bidder {bidderId}</td>
                  {bidColumns.map((bidIndex) => {
                    const isEditing = editingCell?.bidderId === bidderId && editingCell?.bidIndex === bidIndex;
                    const value = groupedBids[bidderId]?.[bidIndex];

                    return (
                      <td 
                        key={bidIndex} 
                        className="text-right py-2 px-4"
                        onClick={() => !isEditing && startEditing(bidderId, bidIndex)}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={handleEditChange}
                            onBlur={finishEditing}
                            onKeyDown={handleKeyDown}
                            className="w-24 px-3 py-1 border rounded text-right bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter bid"
                            autoFocus
                          />
                        ) : (
                          <div className="group relative cursor-pointer">
                            <span className={`
                              inline-block min-w-[3rem] px-3 py-1 rounded
                              ${value !== undefined ? 'bg-gray-50' : 'text-gray-400'}
                              group-hover:bg-blue-50 group-hover:ring-1 group-hover:ring-blue-200
                            `}>
                              {value !== undefined ? `$${value}` : '—'}
                            </span>
                            <Edit3 size={14} className="absolute top-1/2 -translate-y-1/2 -right-5 text-blue-500 opacity-0 group-hover:opacity-100" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}