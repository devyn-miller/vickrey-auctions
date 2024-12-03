import React from 'react';
import { Bid } from '../types/auction';

interface BidInputProps {
  bidderCount: number;
  newBid: Partial<Bid> & { amount: string };
  setNewBid: (bid: Partial<Bid> & { amount: string }) => void;
  onAdd: () => void;
}

export function BidInput({ bidderCount, newBid, setNewBid, onAdd }: BidInputProps) {
  return (
    <div className="flex items-center space-x-4">
      <select
        value={newBid.bidderId}
        onChange={(e) => setNewBid({ ...newBid, bidderId: Number(e.target.value) })}
        className="border rounded p-2"
      >
        {Array.from({ length: bidderCount }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            Bidder {i + 1}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={newBid.amount}
        onChange={(e) => setNewBid({ ...newBid, amount: e.target.value })}
        placeholder="Bid amount"
        className="border rounded p-2"
      />
      <button
        onClick={onAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Bid
      </button>
    </div>
  );
}