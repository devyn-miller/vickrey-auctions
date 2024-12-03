import React, { useState } from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { StepIndicator } from '../auction-table/StepIndicator';
import { AuctionControls } from './AuctionControls';
import { SelectableBidGrid } from './SelectableBidGrid';
import { StepExplanation } from './StepExplanation';
import { DetailedFormula } from './DetailedFormula';
import { BidSelectionControls } from './BidSelectionControls';
import { ColorLegend } from './ColorLegend';
import { Bid } from '../../types/auction';
import { validateBidSelection } from '../../utils/highlightUtils';

export function StepByStepAuction() {
  const { 
    generateRandomBids, 
    clearAll,
    bids,
    itemCount,
    currentStep,
    setCurrentStep,
    highlightedCells,
    setHighlightedCells
  } = useAuctionStore();

  const [selectedBids, setSelectedBids] = useState<Bid[]>([]);
  const [currentBidder, setCurrentBidder] = useState(1);

  const handleBidSelect = (bid: Bid) => {
    if (currentStep === 2) {
      const isAlreadySelected = selectedBids.some(
        selected => selected.bidderId === bid.bidderId && 
                   selected.unitIndex === bid.unitIndex
      );

      if (isAlreadySelected) {
        setSelectedBids(selectedBids.filter(
          selected => !(selected.bidderId === bid.bidderId && 
                       selected.unitIndex === bid.unitIndex)
        ));
      } else {
        setSelectedBids([...selectedBids, bid]);
      }
    }
  };

  const handleConfirmSelection = () => {
    if (validateBidSelection(bids, selectedBids, itemCount)) {
      setHighlightedCells([
        ...highlightedCells,
        ...selectedBids.map(bid => ({
          bidderId: bid.bidderId,
          unitIndex: bid.unitIndex || 0,
          type: 'excluded',
          excludedFor: currentBidder
        }))
      ]);
      setSelectedBids([]);
      setCurrentBidder(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <StepIndicator />
      </div>

      <AuctionControls />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Auction Setup</h3>
              <div className="space-x-2">
                <button
                  onClick={generateRandomBids}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Generate Random Bids
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>
            <ColorLegend />
          </div>
          
          <SelectableBidGrid
            bids={bids}
            currentStep={currentStep}
            highlightedCells={highlightedCells}
            onBidSelect={handleBidSelect}
            isSelectable={currentStep === 2}
          />

          {currentStep === 2 && (
            <BidSelectionControls
              currentBidder={currentBidder}
              onPrevious={() => setCurrentBidder(prev => Math.max(1, prev - 1))}
              onNext={() => setCurrentBidder(prev => prev + 1)}
              onConfirm={handleConfirmSelection}
              selectedBids={selectedBids}
              isValid={validateBidSelection(bids, selectedBids, itemCount)}
            />
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