import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';

export function StepExplanation() {
  const { currentStep, bids, itemCount, results } = useAuctionStore();

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return {
          title: 'Step 1: Sort Bids',
          content: [
            'All bids are sorted in descending order.',
            `The top ${itemCount} bids will be winning bids.`,
            'Winning bids are highlighted in green.'
          ]
        };
      case 1:
        return {
          title: 'Step 2: Calculate Total Value (V*)',
          content: [
            'Sum all winning bids to get V*.',
            `Current V* = $${results?.totalValue || 0}`,
            'This represents the maximum value achievable from the auction.'
          ],
          formula: 'V* = sum(winning bids)'
        };
      case 2:
        return {
          title: 'Step 3: Calculate V*j',
          content: [
            'For each winner, remove their bids.',
            'Recalculate the total with replacement bids.',
            'This shows what the auction value would be without each winner.'
          ],
          formula: 'V*j = sum(top k bids excluding bidder j)'
        };
      case 3:
        return {
          title: 'Step 4: Compute Vickrey Prices',
          content: [
            'Calculate what each winner must pay.',
            'Price = V*j - (V* - value of winner\'s bids)',
            'This represents the impact each winner had on others.'
          ],
          formula: 'Pj = V*j - (V* - value of winner\'s bids)'
        };
      default:
        return {
          title: 'Complete',
          content: ['All steps completed. Review the results or start over.']
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
          <p className="mt-1 font-mono text-sm">{stepContent.formula}</p>
        </div>
      )}
    </div>
  );
}