import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';

export function DetailedFormula() {
  const { currentStep, results, bids } = useAuctionStore();

  if (!results || currentStep < 1) return null;

  const getFormulaBreakdown = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Total Value (V*)',
          formula: 'V* = sum(winning bids)',
          breakdown: [
            'Winning bids:',
            ...results.winners.map(w => `  $${w.winningBid}`),
            `Total: $${results.totalValue}`
          ]
        };
      case 2:
        return {
          title: 'Value without Bidder (V*j)',
          formula: 'V*j = sum(top k bids excluding bidder j)',
          breakdown: results.winners.map(w => [
            `For Bidder ${w.bidderId}:`,
            '1. Remove all bids from this bidder',
            `2. Take top ${bids.length} remaining bids`,
            `3. V*${w.bidderId} = $${w.vStarJ}`
          ].join('\n'))
        };
      case 3:
        return {
          title: 'Vickrey Prices (Pj)',
          formula: 'Pj = V*j - (V* - value of winner\'s bids)',
          breakdown: results.winners.map(w => [
            `For Bidder ${w.bidderId}:`,
            `1. V*${w.bidderId} = $${w.vStarJ}`,
            `2. V* = $${results.totalValue}`,
            `3. Winner's bids = $${w.bidderTotalValue}`,
            `4. Price = $${w.vStarJ} - ($${results.totalValue} - $${w.bidderTotalValue})`,
            `         = $${w.vickreyPrice}`
          ].join('\n'))
        };
      default:
        return null;
    }
  };

  const breakdown = getFormulaBreakdown();
  if (!breakdown) return null;

  return (
    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold text-lg mb-2">{breakdown.title}</h4>
      <div className="font-mono text-sm bg-white p-3 rounded border border-blue-200 mb-4">
        {breakdown.formula}
      </div>
      <div className="mt-3 space-y-4">
        {Array.isArray(breakdown.breakdown) ? (
          breakdown.breakdown.map((line, i) => (
            <p key={i} className="text-sm whitespace-pre-wrap font-mono">{line}</p>
          ))
        ) : (
          <pre className="text-sm whitespace-pre-wrap font-mono">{breakdown.breakdown}</pre>
        )}
      </div>
    </div>
  );
}