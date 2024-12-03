import { Bid, AuctionResult } from '../../types/auction';

interface CellHighlight {
  className: string;
  tooltip?: string;
}

export function getCellHighlight(
  bid: Bid | undefined,
  currentStep: number,
  highlightedCells: Array<{ bidderId: number; unitIndex: number; type: string }>
): CellHighlight {
  if (!bid) return { className: '' };

  const highlight = highlightedCells.find(
    h => h.bidderId === bid.bidderId && h.unitIndex === bid.unitIndex
  );

  if (!highlight) return { className: '' };

  switch (highlight.type) {
    case 'winner':
      return { 
        className: 'bg-green-100', 
        tooltip: 'Winning bid' 
      };
    case 'excluded':
      return { 
        className: 'bg-yellow-100', 
        tooltip: 'Excluded for V*j calculation' 
      };
    case 'replacement':
      return { 
        className: 'bg-blue-100', 
        tooltip: 'Replacement bid for V*j' 
      };
    default:
      return { className: '' };
  }
}

interface StepExplanation {
  title: string;
  details: string[];
  formula?: string;
}

export function getStepExplanation(
  currentStep: number,
  bids: Bid[],
  itemCount: number,
  results: AuctionResult | null
): StepExplanation {
  switch (currentStep) {
    case 0:
      return {
        title: 'Sort Bids',
        details: [
          'All bids are sorted in descending order.',
          `The top ${itemCount} bids will be winning bids.`,
          'Winning bids are highlighted in green.'
        ]
      };
    case 1:
      return {
        title: 'Calculate Total Value (V*)',
        details: [
          'Sum all winning bids to get V*.',
          `V* = ${results?.totalValue || 0}`
        ],
        formula: 'V* = sum(winning bids)'
      };
    case 2:
      return {
        title: 'Calculate V*j',
        details: [
          'For each winner, remove their bids.',
          'Recalculate the total with replacement bids.',
          'This shows the auction value without each winner.'
        ],
        formula: 'V*j = sum(top k bids excluding bidder j)'
      };
    case 3:
      return {
        title: 'Determine Vickrey Prices',
        details: [
          'Calculate what each winner must pay.',
          'Price = V*j - (V* - value of winner\'s bids)',
          'This represents the impact each winner had on others.'
        ],
        formula: 'Pj = V*j - (V* - value of winner\'s bids)'
      };
    default:
      return {
        title: '',
        details: []
      };
  }
}