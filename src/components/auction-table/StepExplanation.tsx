import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { getStepExplanation } from './tableUtils';

export function StepExplanation() {
  const { currentStep, bids, itemCount, results } = useAuctionStore();
  const explanation = getStepExplanation(currentStep, bids, itemCount, results);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        Step {currentStep + 1}: {explanation.title}
      </h3>
      <div className="space-y-4">
        {explanation.details.map((detail, index) => (
          <p key={index} className="text-sm text-gray-700">
            {detail}
          </p>
        ))}
      </div>
      {explanation.formula && (
        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Formula:</p>
          <p className="mt-1 font-mono text-sm">{explanation.formula}</p>
        </div>
      )}
    </div>
  );
}