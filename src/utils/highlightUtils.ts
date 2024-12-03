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
  vickreyPrice?: number;
}

export function getCellHighlight(
  highlightedCells: HighlightedCell[],
  bidderId: number,
  unitIndex: number
): HighlightedCell | undefined {
  if (!Array.isArray(highlightedCells)) return undefined;
  
  return highlightedCells.find(
    h => h.bidderId === bidderId && h.unitIndex === unitIndex
  );
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