export interface Bid {
  bidderId: number;
  amount: number;
  unitIndex?: number;
  vickreyPrice?: number;
}

export interface BidderConfig {
  id: number;
  bidCount: number;
}

export interface AuctionResult {
  winners: {
    bidderId: number;
    winningBids: number[];
    vickreyPrice: number;
    savings: number;
  }[];
  totalValue: number;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  type: 'winners' | 'total-value' | 'vickrey-price';
  bids: Bid[];
  itemCount: number;
  question: string;
  correctAnswer: number | number[];
  explanation: string;
  steps?: {
    title: string;
    description: string;
    formula?: string;
  }[];
}

export interface StepHighlight {
  bidderId: number;
  unitIndex: number;
  type: 'winner' | 'excluded' | 'replacement';
}