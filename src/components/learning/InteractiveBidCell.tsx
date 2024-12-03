import React from 'react';
import { Bid } from '../../types/auction';
import { getCellHighlight } from '../../utils/highlightUtils';

interface InteractiveBidCellProps {
  bid: Bid | undefined;
  currentStep: number;
  highlightedCells: Array<{
    bidderId: number;
    unitIndex: number;
    type: string;
    excludedFor?: number;
  }>;
  onSelect?: (bid: Bid) => void;
  isSelectable?: boolean;
}

export function InteractiveBidCell({
  bid,
  currentStep,
  highlightedCells,
  onSelect,
  isSelectable
}: InteractiveBidCellProps) {
  const highlight = getCellHighlight(bid, currentStep, highlightedCells);
  
  const handleClick = () => {
    if (isSelectable && bid && onSelect) {
      onSelect(bid);
    }
  };

  return (
    <td 
      className={`
        border p-2 transition-colors duration-300 
        ${highlight.className}
        ${isSelectable ? 'cursor-pointer hover:bg-gray-50' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <span>{bid?.amount || '-'}</span>
        {highlight.tooltip && (
          <span className="ml-2 text-xs text-gray-500 italic">
            {highlight.tooltip}
          </span>
        )}
      </div>
    </td>
  );
}