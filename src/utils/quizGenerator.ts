import { Bid, QuizQuestion } from '../types/auction';

function generateRandomBid(bidderId: number, unitIndex: number): Bid {
  return {
    bidderId,
    unitIndex,
    amount: Math.floor(Math.random() * 900) + 100 // Random bid between 100 and 999
  };
}

function generateAuctionSetup() {
  const bidderCount = Math.floor(Math.random() * 4) + 4; // 4-7 bidders
  const bidsPerBidder = Math.floor(Math.random() * 3) + 2; // 2-4 bids per bidder
  const itemCount = Math.floor(Math.random() * 4) + 2; // 2-5 items

  const bids: Bid[] = [];
  for (let i = 1; i <= bidderCount; i++) {
    for (let j = 0; j < bidsPerBidder; j++) {
      bids.push(generateRandomBid(i, j));
    }
  }

  return { bids, itemCount };
}

function generateQuestionForSetup(
  bids: Bid[], 
  itemCount: number, 
  excludePreviousTypes: string[] = []
): QuizQuestion {
  const questionTypes = ['total-value', 'vickrey-price', 'excluded-bids']
    .filter(type => !excludePreviousTypes.includes(type));
  
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const winningBids = sortedBids.slice(0, itemCount);
  
  switch (type) {
    case 'total-value':
      return {
        id: Math.random(),
        type,
        bids,
        itemCount,
        question: "What is the total value of the winning bids?",
        correctAnswer: winningBids.reduce((sum, bid) => sum + bid.amount, 0),
        explanation: "Sum the highest bids up to the number of items available.",
        steps: [
          {
            title: "Sort Bids",
            description: "Arrange bids from highest to lowest"
          },
          {
            title: "Select Top Bids",
            description: `Take the top ${itemCount} bids`
          },
          {
            title: "Sum Values",
            description: "Add the selected bid amounts"
          }
        ]
      };

    case 'vickrey-price':
      const randomWinner = winningBids[Math.floor(Math.random() * winningBids.length)];
      const winnerBids = winningBids.filter(b => b.bidderId === randomWinner.bidderId);
      const otherBids = sortedBids.filter(b => b.bidderId !== randomWinner.bidderId);
      const vickreyPrice = otherBids.slice(0, winnerBids.length)
        .reduce((sum, bid) => sum + bid.amount, 0);

      return {
        id: Math.random(),
        type,
        bids,
        itemCount,
        question: `What is the Vickrey price for Bidder ${randomWinner.bidderId}?`,
        correctAnswer: vickreyPrice,
        explanation: "Calculate the sum of the highest excluded bids",
        steps: [
          {
            title: "Identify Winner's Units",
            description: `Find all winning bids from Bidder ${randomWinner.bidderId}`
          },
          {
            title: "Find Excluded Bids",
            description: "Identify the highest bids from other bidders"
          },
          {
            title: "Calculate Price",
            description: "Sum the highest excluded bids"
          }
        ]
      };

    default: // excluded-bids
      const targetBidder = winningBids[Math.floor(Math.random() * winningBids.length)].bidderId;
      return {
        id: Math.random(),
        type,
        bids,
        itemCount,
        question: `Which bids should be excluded when calculating V*${targetBidder}?`,
        correctAnswer: bids.filter(b => b.bidderId === targetBidder)
          .map(b => b.amount),
        explanation: `All bids from Bidder ${targetBidder} should be excluded`,
        steps: [
          {
            title: "Identify Bidder",
            description: `Focus on Bidder ${targetBidder}'s bids`
          },
          {
            title: "Mark Exclusions",
            description: "Select all bids from this bidder"
          }
        ]
      };
  }
}

export function generateQuizQuestions(count = 5): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedTypes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const { bids, itemCount } = generateAuctionSetup();
    const question = generateQuestionForSetup(bids, itemCount, usedTypes);
    questions.push(question);
    usedTypes.push(question.type);
    
    // Reset used types after 3 questions to allow type repetition
    if (usedTypes.length >= 3) usedTypes.length = 0;
  }
  
  return questions;
}