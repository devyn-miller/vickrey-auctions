import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  'Sort Bids',
  'Calculate Total Value',
  'Calculate V*j',
  'Determine Prices'
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {index < currentStep ? (
                <Check size={16} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className="ml-2 text-sm font-medium">
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="text-gray-400" size={20} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}