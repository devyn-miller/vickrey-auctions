import React from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { PlusCircle, MinusCircle, Dice6, RotateCcw, XCircle, Calculator, BookOpen, HelpCircle, Lightbulb } from 'lucide-react';
import { BidTable } from './BidTable';
import { AuctionResults } from './AuctionResults';
import { Slider } from './ui/Slider';

export function AuctionCalculator() {
  const {
    mode,
    bids,
    itemCount,
    bidderCount,
    bidsPerBidder,
    results,
    currentStep,
    setItemCount,
    setBidderCount,
    setBidsPerBidder,
    calculateResults,
    generateRandomBids,
    clearAll,
    regenerateAuction,
    setMode,
    setCurrentStep
  } = useAuctionStore();

  const isLearningMode = mode === 'learn';

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Mode Toggle */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Vickrey Auction Helper</h1>
        <button
          onClick={() => setMode(isLearningMode ? 'calculator' : 'learn')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
        >
          {isLearningMode ? <Calculator size={20} /> : <BookOpen size={20} />}
          <span>{isLearningMode ? 'Calculator Mode' : 'Learning Mode'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Settings and Bid Table */}
        <div className="space-y-6">
          {/* Auction Settings Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Auction Settings</h2>
            
            <div className="space-y-6">
              {/* Slider Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex justify-between text-gray-700 font-medium">
                    <span>Number of Items</span>
                    <span className="text-gray-500">{itemCount}</span>
                  </label>
                  <Slider
                    value={itemCount}
                    onChange={(value) => setItemCount(value)}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex justify-between text-gray-700 font-medium">
                    <span>Number of Bidders</span>
                    <span className="text-gray-500">{bidderCount}</span>
                  </label>
                  <Slider
                    value={bidderCount}
                    onChange={(value) => setBidderCount(value)}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex justify-between text-gray-700 font-medium">
                    <span>Bids per Bidder</span>
                    <span className="text-gray-500">{bidsPerBidder}</span>
                  </label>
                  <Slider
                    value={bidsPerBidder}
                    onChange={(value) => setBidsPerBidder(value)}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={generateRandomBids}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                >
                  <Dice6 size={20} />
                  <span>Generate Bids</span>
                </button>

                <button
                  onClick={regenerateAuction}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                >
                  <RotateCcw size={20} />
                  <span>Regenerate</span>
                </button>

                <button
                  onClick={calculateResults}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md col-span-2"
                >
                  <Calculator size={20} />
                  <span>Calculate Results</span>
                </button>

                <button
                  onClick={clearAll}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md col-span-2"
                >
                  <XCircle size={20} />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Bids Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Bids</h2>
            <BidTable />
          </div>
        </div>

        {/* Right Column: Results and Learning */}
        <div className="space-y-6">
          {/* Results Section */}
          <AuctionResults />

          {/* Learning Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <HelpCircle className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">How to Use</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">1</div>
                <p className="text-gray-700">Set the auction parameters using the sliders above.</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">2</div>
                <p className="text-gray-700">Either generate random bids or enter your own bids in the table.</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">3</div>
                <p className="text-gray-700">Click "Calculate Results" to see the auction outcome.</p>
              </div>

              <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                  <Lightbulb size={20} />
                  <span className="font-semibold">Pro Tip</span>
                </div>
                <p className="text-yellow-800">
                  Switch to Learning Mode to see a step-by-step explanation of how the Vickrey auction works!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}