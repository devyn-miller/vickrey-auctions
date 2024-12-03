import { Bid } from '../types/auction';

export interface CellHighlight {
  className: string;
  tooltip?: string;
}

export interface HighlightedCell {
  bidderId: number;
  unitIndex: number;
  type: 'winner' | 'excluded' | 'replacement';
  excludedFor?: number;
}

export function getCellHighlight(
  bid: Bid | undefined,
  currentStep: number,
  highlightedCells: HighlightedCell[]
): CellHighlight {
  if (!bid) return { className: '' };

  const highlight = highlightedCells.find(
    h => h.bidderId === bid.bidderId && h.unitIndex === bid.unitIndex
  );

  if (!highlight) return { className: '' };

  switch (highlight.type) {
    case 'winner':
      return {
        className: 'bg-green-100 border-green-300',
        tooltip: 'Winning bid'
      };
    case 'excluded':
      return {
        className: 'bg-yellow-100 border-yellow-300',
        tooltip: highlight.excludedFor 
          ? `Excluded for V*${highlight.excludedFor} calculation`
          : 'Excluded for V*j calculation'
      };
    case 'replacement':
      return {
        className: 'bg-blue-100 border-blue-300',
        tooltip: highlight.excludedFor 
          ? `Replacement bid for V*${highlight.excludedFor}`
          : 'Replacement bid'
      };
    default:
      return { className: '' };
  }
}

export function calculateHighlightedCells(
  step: number,
  bids: Bid[],
  itemCount: number,
  currentBidder?: number
): HighlightedCell[] {
  const highlights: HighlightedCell[] = [];
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const winningBids = sortedBids.slice(0, itemCount);

  // Step 1: Highlight winning bids
  if (step >= 1) {
    winningBids.forEach(bid => {
      highlights.push({
        bidderId: bid.bidderId,
        unitIndex: bid.unitIndex || 0,
        type: 'winner'
      });
    });
  }

  // Step 2: Highlight excluded and replacement bids for V*j calculation
  if (step >= 2 && currentBidder) {
    const bidderBids = bids.filter(b => b.bidderId === currentBidder);
    
    // Mark all bids from the current bidder as excluded
    bidderBids.forEach(bid => {
      highlights.push({
        bidderId: bid.bidderId,
        unitIndex: bid.unitIndex || 0,
        type: 'excluded',
        excludedFor: currentBidder
      });
    });

    // Mark replacement bids
    const replacementBids = sortedBids
      .filter(b => b.bidderId !== currentBidder)
      .slice(0, itemCount);

    replacementBids.forEach(bid => {
      highlights.push({
        bidderId: bid.bidderId,
        unitIndex: bid.unitIndex || 0,
        type: 'replacement',
        excludedFor: currentBidder
      });
    });
  }

  return highlights;
}