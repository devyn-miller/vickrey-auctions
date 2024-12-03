import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { Bid } from '../../types/auction';

export function StepExplanation() {
  const { currentStep, bids, itemCount, results } = useAuctionStore();

  // Helper function to format bids array for display
  const formatBids = (bids: Bid[]) => {
    return `[${bids.map(b => b.amount).join(', ')}]`;
  };

  // Helper function to format mathematical expressions
  const formatMath = (expression: string) => {
    return expression.replace(/\*/g, '∗').replace(/_/g, '₍');
  };

  const getStepContent = () => {
    // Sort bids for display
    const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
    const winningBids = sortedBids.slice(0, itemCount);
    const totalValue = winningBids.reduce((sum, bid) => sum + bid.amount, 0);

    switch (currentStep) {
      case 0:
        return {
          title: 'Step 1: Sort Bids',
          content: [
            'All bids are sorted in descending order.',
            `The top ${itemCount} bids will be winning bids.`,
            'Winning bids are highlighted in green.'
          ],
          formula: `𝐵 = {𝑏₁, 𝑏₂, ..., 𝑏ₙ} where 𝑏₁ ≥ 𝑏₂ ≥ ... ≥ 𝑏ₙ`,
          details: [
            {
              title: 'Sorted Bids:',
              content: formatBids(sortedBids)
            },
            {
              title: 'Winning Bids:',
              content: formatBids(winningBids)
            }
          ],
          explanation: 'This step identifies the highest bids that will win the auction, ensuring optimal allocation.'
        };
      case 1:
        return {
          title: 'Step 2: Calculate Total Value (V*)',
          content: [
            'Sum all winning bids to get V*.',
            `Current V* = $${totalValue}`,
            'This represents the maximum value achievable from the auction.'
          ],
          formula: 'V* = ∑ᵢ₌₁ᵏ 𝑏ᵢ where k = number of items',
          details: [
            {
              title: 'Calculation:',
              content: winningBids.map(b => b.amount).join(' + ') + ` = ${totalValue}`
            }
          ],
          explanation: 'The total value (V*) represents the maximum economic value achievable from the auction.'
        };
      case 2:
        return {
          title: 'Step 3: Calculate V*j',
          content: [
            'For each winner, calculate the auction value without their bids.',
            'This shows the impact of each bidder on the total auction value.',
            'Recalculate total value with replacement bids.'
          ],
          formula: 'V*ⱼ = ∑ᵢ₌₁ᵏ 𝑏ᵢ where 𝑏ᵢ ∉ Bⱼ',
          details: winningBids.map(bid => {
            const bidsWithoutBidder = sortedBids.filter(b => b.bidderId !== bid.bidderId);
            const newTopBids = bidsWithoutBidder.slice(0, itemCount);
            const vStarJ = newTopBids.reduce((sum, b) => sum + b.amount, 0);
            return {
              title: `For Bidder ${bid.bidderId}:`,
              content: `V*ⱼ = ${formatBids(newTopBids)} = ${vStarJ}`
            };
          }),
          explanation: 'V*j shows what the auction value would be without each winner, helping determine their true economic impact.'
        };
      case 3:
        return {
          title: 'Step 4: Compute Vickrey Prices',
          content: [
            'Calculate what each winner must pay.',
            'Price is based on the economic impact of their bids.',
            'Ensures bidders pay the opportunity cost they create.'
          ],
          formula: 'Pⱼ = V*ⱼ - (V* - ∑ᵢ∈Wⱼ 𝑏ᵢ)',
          details: results?.winners.map(winner => ({
            title: `Bidder ${winner.bidderId}:`,
            content: `Winning Bid: $${winner.winningBid}\nVickrey Price: $${winner.vickreyPrice}`
          })) || [],
          explanation: 'The Vickrey price ensures winners pay based on their impact on other bidders, promoting truthful bidding.'
        };
      default:
        return {
          title: 'Complete',
          content: ['All steps completed. Review the results or start over.'],
          explanation: 'You have now seen how a Vickrey auction determines winners and prices.'
        };
    }
  };

  const stepContent = getStepContent();

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{stepContent.title}</h3>
      <div className="space-y-4">
        {stepContent.content.map((text, index) => (
          <p key={index} className="text-sm text-gray-700">{text}</p>
        ))}
      </div>
      
      {stepContent.formula && (
        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Formula:</p>
          <div className="mt-1 font-mono text-sm bg-gray-50 p-3 rounded text-center">
            {stepContent.formula}
          </div>
        </div>
      )}

      {stepContent.details && stepContent.details.length > 0 && (
        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Detailed Calculations:</p>
          {stepContent.details.map((detail, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <p className="text-sm font-medium text-gray-700">{detail.title}</p>
              <pre className="mt-1 text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                {detail.content}
              </pre>
            </div>
          ))}
        </div>
      )}

      {stepContent.explanation && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">{stepContent.explanation}</p>
        </div>
      )}
    </div>
  );
}