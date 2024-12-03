import React from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { Calculator, BookOpen } from 'lucide-react';
import { BidTable } from './BidTable';
import { AuctionResults } from './AuctionResults';
import { StepByStepGuide } from './learning/StepByStepGuide';
import { NavigationControls } from './learning/NavigationControls';
import { ColorLegend } from './learning/ColorLegend';
import { AuctionSettings } from './auction-settings/AuctionSettings';

export function AuctionCalculator() {
  const {
    mode,
    bids,
    results,
    currentStep,
    generateRandomBids,
    clearAll,
    setMode,
  } = useAuctionStore();

  const isLearningMode = mode === 'learn';

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Mode Toggle */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isLearningMode ? 'Interactive Learning Mode' : 'Auction Calculator'}
        </h1>
        <button
          onClick={() => setMode(isLearningMode ? 'calculator' : 'learn')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
        >
          {isLearningMode ? <Calculator size={20} /> : <BookOpen size={20} />}
          <span>{isLearningMode ? 'Switch to Calculator' : 'Switch to Learning Mode'}</span>
        </button>
      </div>

      {isLearningMode ? (
        <StepByStepGuide />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Settings and Bid Table */}
          <div className="space-y-6">
            {/* Auction Settings Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Auction Settings</h2>
              <AuctionSettings />
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={generateRandomBids}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Generate Random Bids
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Bid Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Bids</h2>
              <ColorLegend />
              <BidTable />
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {results && <AuctionResults />}
          </div>
        </div>
      )}
    </div>
  );
}