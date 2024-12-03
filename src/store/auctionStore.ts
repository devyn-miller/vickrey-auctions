import { create } from 'zustand';
import { Bid, AuctionResult, BidderConfig, QuizQuestion } from '../types/auction';
import { calculateVickreyAuction } from '../utils/auctionCalculator';
import { generateQuizQuestions } from '../utils/quizGenerator';

interface AuctionStore {
  mode: 'calculator';
  bids: Bid[];
  itemCount: number;
  bidderCount: number;
  bidderConfigs: BidderConfig[];
  results: AuctionResult | null;
  equalBidsPerBidder: boolean;
  bidsPerBidder: number;
  currentQuiz: QuizQuestion | null;
  quizProgress: number;
  currentStep: number;
  highlightedCells: Array<{
    bidderId: number;
    unitIndex: number;
    type: 'winner' | 'excluded' | 'replacement';
    excludedFor?: number;
    vickreyPrice?: number;
  }>;
  selectedBids: Bid[];
  setBids: (bids: Bid[]) => void;
  setItemCount: (count: number) => void;
  setBidderCount: (count: number) => void;
  setBidderConfigs: (configs: BidderConfig[]) => void;
  setEqualBidsPerBidder: (equal: boolean) => void;
  setBidsPerBidder: (count: number) => void;
  calculateResults: () => void;
  generateRandomBids: () => void;
  clearAll: () => void;
  regenerateAuction: () => void;
}

const DEFAULT_STATE = {
  bids: [],
  itemCount: 3,
  bidderCount: 5,
  bidderConfigs: [],
  results: null,
  equalBidsPerBidder: true,
  bidsPerBidder: 3,
  currentQuiz: null,
  quizProgress: 0,
  currentStep: 0,
  highlightedCells: [],
  selectedBids: [],
};

export const useAuctionStore = create<AuctionStore>((set, get) => ({
  mode: 'calculator',
  ...DEFAULT_STATE,

  setBids: (bids) => {
    set({ bids });
    // Recalculate results when bids change
    const results = calculateVickreyAuction(bids, get().itemCount);
    set({ results });
  },

  setItemCount: (count) => set({ itemCount: count }),
  setBidderCount: (count) => set({ bidderCount: count }),
  setBidderConfigs: (configs) => set({ bidderConfigs: configs }),
  setEqualBidsPerBidder: (equal) => set({ equalBidsPerBidder: equal }),
  setBidsPerBidder: (count) => set({ bidsPerBidder: count }),

  calculateResults: () => {
    const { bids, itemCount } = get();
    const results = calculateVickreyAuction(bids, itemCount);
    set({ results });
  },

  generateRandomBids: () => {
    const { bidderCount, equalBidsPerBidder, bidsPerBidder, bidderConfigs, itemCount } = get();
    const bids: Bid[] = [];
    
    if (equalBidsPerBidder) {
      for (let i = 0; i < bidderCount; i++) {
        for (let j = 0; j < bidsPerBidder; j++) {
          bids.push({
            bidderId: i + 1,
            amount: Math.floor(Math.random() * 900) + 100,
            unitIndex: j
          });
        }
      }
    } else {
      bidderConfigs.forEach(config => {
        for (let j = 0; j < config.bidCount; j++) {
          bids.push({
            bidderId: config.id,
            amount: Math.floor(Math.random() * 900) + 100,
            unitIndex: j
          });
        }
      });
    }
    
    // Set bids and automatically calculate results
    set({ bids });
    const results = calculateVickreyAuction(bids, itemCount);
    set({ results });
  },

  clearAll: () => {
    set(DEFAULT_STATE);
  },

  regenerateAuction: () => {
    const store = get();
    store.clearAll();
    store.generateRandomBids();
  },
}));