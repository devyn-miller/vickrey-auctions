import { create } from 'zustand';
import { Bid, AuctionResult, BidderConfig, QuizQuestion } from '../types/auction';
import { calculateVickreyAuction } from '../utils/auctionCalculator';
import { generateQuizQuestions } from '../utils/quizGenerator';

interface AuctionStore {
  mode: 'calculator' | 'learn';
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
  setMode: (mode: 'calculator' | 'learn') => void;
  setBidderConfigs: (configs: BidderConfig[]) => void;
  setEqualBidsPerBidder: (equal: boolean) => void;
  setBidsPerBidder: (count: number) => void;
  setCurrentStep: (step: number) => void;
  calculateResults: () => void;
  generateRandomBids: () => void;
  clearAll: () => void;
  regenerateAuction: () => void;
  startQuiz: () => void;
  nextQuestion: () => void;
  checkAnswer: (answer: number | number[]) => boolean;
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
    if (get().mode === 'calculator') {
      const results = calculateVickreyAuction(bids, get().itemCount);
      set({ results });
    }
    // Update highlighted cells in learn mode
    if (get().mode === 'learn') {
      const highlightedCells = calculateHighlightedCells(get().currentStep, bids, get().itemCount);
      set({ highlightedCells });
    }
  },

  setItemCount: (count) => set({ itemCount: count }),
  setBidderCount: (count) => set({ bidderCount: count }),
  setMode: (mode) => {
    set({ mode });
    // Keep the same bids when switching modes
    const { bids, itemCount } = get();
    if (mode === 'calculator') {
      const results = calculateVickreyAuction(bids, itemCount);
      set({ results });
    } else {
      const highlightedCells = calculateHighlightedCells(0, bids, itemCount);
      set({ currentStep: 0, highlightedCells });
    }
  },
  setBidderConfigs: (configs) => set({ bidderConfigs: configs }),
  setEqualBidsPerBidder: (equal) => set({ equalBidsPerBidder: equal }),
  setBidsPerBidder: (count) => set({ bidsPerBidder: count }),
  setCurrentStep: (step) => {
    set({ currentStep: step });
    const { bids, itemCount } = get();
    const highlightedCells = calculateHighlightedCells(step, bids, itemCount);
    set({ highlightedCells });
  },

  calculateResults: () => {
    const { bids, itemCount } = get();
    const results = calculateVickreyAuction(bids, itemCount);
    set({ results });
  },

  generateRandomBids: () => {
    const { bidderCount, equalBidsPerBidder, bidsPerBidder, bidderConfigs } = get();
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
    
    set({ bids, currentStep: 0, highlightedCells: [] });
  },

  clearAll: () => {
    set(DEFAULT_STATE);
  },

  regenerateAuction: () => {
    const store = get();
    store.clearAll();
    store.generateRandomBids();
  },

  startQuiz: () => {
    const questions = generateQuizQuestions();
    set({ 
      currentQuiz: questions[0],
      quizProgress: 0
    });
  },

  nextQuestion: () => {
    const questions = generateQuizQuestions();
    const progress = get().quizProgress + 1;
    if (progress < questions.length) {
      set({
        currentQuiz: questions[progress],
        quizProgress: progress
      });
    } else {
      set({
        currentQuiz: null,
        quizProgress: 0
      });
    }
  },

  checkAnswer: (answer: number | number[]) => {
    const { currentQuiz } = get();
    if (!currentQuiz) return false;

    if (Array.isArray(currentQuiz.correctAnswer) && Array.isArray(answer)) {
      return currentQuiz.correctAnswer.every((v, i) => v === answer[i]);
    }
    return currentQuiz.correctAnswer === answer;
  }
}));

function calculateHighlightedCells(step: number, bids: Bid[], itemCount: number) {
  const highlightedCells: Array<{
    bidderId: number;
    unitIndex: number;
    type: 'winner' | 'excluded' | 'replacement';
    excludedFor?: number;
    vickreyPrice?: number;
  }> = [];

  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const winningBids = sortedBids.slice(0, itemCount);

  if (step >= 1) {
    winningBids.forEach(bid => {
      highlightedCells.push({
        bidderId: bid.bidderId,
        unitIndex: bid.unitIndex || 0,
        type: 'winner'
      });
    });
  }

  if (step >= 2) {
    const currentBidder = Math.floor((step - 2) / winningBids.length);
    if (currentBidder < winningBids.length) {
      const bidder = winningBids[currentBidder].bidderId;
      const bidderBids = bids.filter(b => b.bidderId === bidder);
      
      bidderBids.forEach(bid => {
        highlightedCells.push({
          bidderId: bid.bidderId,
          unitIndex: bid.unitIndex || 0,
          type: 'excluded'
        });
      });

      const remainingBids = sortedBids
        .filter(b => b.bidderId !== bidder)
        .slice(0, itemCount);

      remainingBids.forEach(bid => {
        highlightedCells.push({
          bidderId: bid.bidderId,
          unitIndex: bid.unitIndex || 0,
          type: 'replacement'
        });
      });
    }
  }

  return highlightedCells;
}