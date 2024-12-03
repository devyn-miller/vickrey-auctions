import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuctionStore } from '../../store/auctionStore';

export function NavigationControls() {
  const { 
    currentStep, 
    setCurrentStep, 
    generateRandomBids, 
    clearAll,
    bids,
    calculateResults
  } = useAuctionStore();

  const steps = [
    'Sort Bids',
    'Calculate Total Value',
    'Calculate V*j',
    'Determine Prices'
  ];

  const stepDescriptions = [
    'Identify the top bids that will win the auction by sorting in descending order.',
    'Calculate the total value of the auction by summing the top winning bids.',
    'Compute the auction value without each winning bidder to understand their economic impact.',
    'Determine the Vickrey price for each winner based on their impact on the auction.'
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          Current Step Explanation
        </h4>
        <p className="text-sm text-blue-700">
          {stepDescriptions[currentStep]}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={20} />
          <span>Previous Step</span>
        </button>

        <span className="text-sm font-medium text-gray-600">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </span>

        <button
          onClick={() => {
            // Ensure results are calculated when moving to the final step
            if (currentStep === steps.length - 2 && bids.length > 0) {
              calculateResults();
            }
            setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
          }}
          disabled={currentStep === steps.length - 1}
          className="flex items-center space-x-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next Step</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={generateRandomBids}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <RotateCcw size={20} />
          <span>Generate New Auction</span>
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}