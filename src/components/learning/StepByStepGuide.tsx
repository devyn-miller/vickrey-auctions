import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { NavigationControls } from './NavigationControls';
import { EnhancedBidTable } from '../auction-table/EnhancedBidTable';
import { StepExplanation } from './StepExplanation';
import { DetailedFormula } from './DetailedFormula';
import { ColorLegend } from './ColorLegend';

export function StepByStepGuide() {
  const { 
    bids,
    currentStep,
    highlightedCells,
    selectedBids,
    onBidSelect
  } = useAuctionStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Interactive Vickrey Auction Guide</h2>
        <p className="text-gray-600">
          Follow along step-by-step to understand how Vickrey auctions work.
          Each step will highlight the relevant parts of the calculation.
        </p>
      </div>

      <NavigationControls />

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
        </div>

        <div className="lg:col-span-1">
          <StepExplanation />
          <DetailedFormula />
        </div>
      </div>
    </div>
  );
}