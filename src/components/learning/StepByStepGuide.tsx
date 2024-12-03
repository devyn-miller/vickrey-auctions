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

          {results && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Auction Results</h3>
              <div className="space-y-2">
                <p>Total Auction Value (V*): ${results.totalValue}</p>
                <div>
                  <h4 className="font-medium">Winners:</h4>
                  {results.winners.map((winner, index) => (
                    <p key={index}>
                      Bidder {winner.bidderId}: 
                      Winning Bid ${winner.winningBid}, 
                      Vickrey Price ${winner.vickreyPrice}
                    </p>
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