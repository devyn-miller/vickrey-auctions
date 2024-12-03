import React, { useEffect } from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { NavigationControls } from './NavigationControls';
import { EnhancedBidTable } from '../auction-table/EnhancedBidTable';
import { StepExplanation } from './StepExplanation';
import { DetailedFormula } from './DetailedFormula';
import { ColorLegend } from './ColorLegend';
import { X as XIcon } from 'lucide-react';
import { AuctionSettings } from '../auction-settings/AuctionSettings';

export function StepByStepGuide() {
  const { 
    bids,
    currentStep,
    highlightedCells,
    selectedBids,
    onBidSelect,
    itemCount,
    setMode,
    results,
    calculateResults
  } = useAuctionStore();

  // Ensure results are calculated when the component mounts or bids change
  useEffect(() => {
    if (bids.length > 0) {
      calculateResults();
    }
  }, [bids, calculateResults]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <button 
        onClick={() => setMode('calculator')}
        className="absolute top-4 right-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
      >
        <XIcon size={20} />
        <span>Return to Main Page</span>
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Interactive Vickrey Auction Guide</h2>
        <p className="text-gray-600">
          Follow along step-by-step to understand how Vickrey auctions work.
          Each step will highlight the relevant parts of the calculation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <NavigationControls />
        </div>
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Auction Settings</h3>
          <AuctionSettings />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Current Auction State</h3>
            <ColorLegend />
          </div>
          
          <EnhancedBidTable
            bids={bids}
            currentStep={currentStep}
            highlightedCells={highlightedCells}
            onBidSelect={currentStep === 2 ? onBidSelect : undefined}
            selectedBids={selectedBids}
          />

          {results && currentStep === 4 && (
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-100">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">Final Auction Results</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-lg mb-2 text-gray-800">Total Auction Value (V*)</h4>
                  <p className="text-green-600 text-2xl font-bold">${results.totalValue}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-gray-800">Winners and Prices</h4>
                  {results.winners.map((winner, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-semibold text-gray-800">Bidder {winner.bidderId}</h5>
                          <p className="text-gray-600">
                            Winning Bids: {winner.winningBids.map(bid => `$${bid}`).join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Vickrey Price</p>
                          <p className="text-green-600 font-bold text-xl">${winner.vickreyPrice}</p>
                          <p className="text-sm text-blue-600">Savings: ${winner.savings}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <StepExplanation />
          <DetailedFormula />
        </div>
      </div>
    </div>
  );
}