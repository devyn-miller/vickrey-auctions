import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

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

  const stepInstructions = [
    {
      title: 'Sort Bids',
      description: 'Identify the highest bids to allocate the available items.',
      tasks: [
        'Combine all bids from all bidders into a single list.',
        'Sort the bids in descending order.',
        'Select the top k bids, where k is the number of items for sale.',
        'Assign the winning bids back to the corresponding bidders.'
      ],
      color: 'green'
    },
    {
      title: 'Calculate Total Value (V*)',
      description: 'Compute the total value of the winning bids.',
      tasks: [
        'Sum the values of the k winning bids identified in Step 1.',
        'Store this value as V*, the total value from the allocation.'
      ],
      color: 'green'
    },
    {
      title: 'Calculate V*j',
      description: 'Determine the total value of the auction if a specific bidder is excluded.',
      tasks: [
        'For each winning bidder:',
        '- Remove ALL of their winning bids from the pool.',
        '- Recompute the top k bids from the remaining bids.',
        '- Sum these bids to calculate V*j, the total value without this bidder\'s participation.'
      ],
      color: 'yellow-blue'
    },
    {
      title: 'Determine Prices',
      description: 'Calculate the Vickrey price each winning bidder must pay.',
      tasks: [
        'For each winning bidder, calculate their Vickrey price:',
        '- Price = V*j - (V* - Value of Bidder\'s Winning Bids)',
        'Assign this price to the corresponding bidder.'
      ],
      color: 'final'
    }
  ];

  const currentStepInfo = stepInstructions[currentStep];

  return (
    <div className="flex flex-col space-y-4">
      <div className={`
        p-4 rounded-lg border 
        ${currentStepInfo.color === 'green' ? 'bg-green-50 border-green-100' : 
          currentStepInfo.color === 'yellow-blue' ? 'bg-gradient-to-r from-yellow-50 to-blue-50 border-yellow-100' : 
          'bg-indigo-50 border-indigo-100'}
      `}>
        <h4 className="text-lg font-semibold mb-2 text-gray-800">
          {currentStepInfo.title}
        </h4>
        <p className="text-gray-700 mb-3">
          {currentStepInfo.description}
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">Tasks:</p>
          <ul className="list-disc list-inside space-y-1">
            {currentStepInfo.tasks.map((task, index) => (
              <li key={index} className="text-sm text-gray-700">{task}</li>
            ))}
          </ul>
        </div>
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