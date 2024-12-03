import React from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function TableControls() {
  const { currentStep, setCurrentStep } = useAuctionStore();

  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
        disabled={currentStep === 0}
        className="flex items-center space-x-2 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft size={20} />
        <span>Previous Step</span>
      </button>

      <button
        onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
        disabled={currentStep === 3}
        className="flex items-center space-x-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Next Step</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}