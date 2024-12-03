import React from 'react';
import { Bid } from '../types/auction';

interface BidTableProps {
  bids: Bid[];
}

export function BidTable({ bids }: BidTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Bidder</th>
            <th className="text-right py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">Bidder {bid.bidderId}</td>
              <td className="text-right py-2">${bid.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}