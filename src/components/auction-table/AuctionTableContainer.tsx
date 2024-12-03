import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { StepIndicator } from './StepIndicator';
import { BidTable } from './BidTable';
import { StepExplanation } from './StepExplanation';
import { TableControls } from './TableControls';

export function AuctionTableContainer() {
  const { currentStep, setCurrentStep } = useAuctionStore((state) => ({
    currentStep: state.currentStep,
    setCurrentStep: state.setCurrentStep,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <StepIndicator currentStep={currentStep} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <BidTable />
        </div>
        <div>
          <StepExplanation />
        </div>
      </div>
      
      <TableControls />
    </div>
  );
}