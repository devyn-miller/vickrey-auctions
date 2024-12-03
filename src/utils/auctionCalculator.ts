import { Bid, AuctionResult } from '../types/auction';

/**
 * Maps winning bids to their respective bidders and validates the assignment
 */
function assignWinningBids(sortedBids: Bid[], itemCount: number): Map<number, Bid[]> {
  const winningBidderMap = new Map<number, Bid[]>();
  const winningBids = sortedBids.slice(0, itemCount);
  
  winningBids.forEach(bid => {
    if (!winningBidderMap.has(bid.bidderId)) {
      winningBidderMap.set(bid.bidderId, []);
    }
    winningBidderMap.get(bid.bidderId)!.push(bid);
  });
  
  return winningBidderMap;
}

/**
 * Calculates V*j - the total value when excluding a specific bidder
 * This is the sum of the top k bids after removing ALL of the specified bidder's bids
 */
function calculateVStarJ(bids: Bid[], itemCount: number, excludedBidderId: number): number {
  // Remove ALL bids from the excluded bidder
  const bidsWithoutBidder = bids.filter(b => b.bidderId !== excludedBidderId);
  const sortedBids = [...bidsWithoutBidder].sort((a, b) => b.amount - a.amount);
  return sortedBids.slice(0, itemCount).reduce((sum, bid) => sum + bid.amount, 0);
}

export function calculateVickreyAuction(bids: Bid[], itemCount: number): AuctionResult {
  if (!bids.length || itemCount <= 0) {
    throw new Error('Invalid input: Bids array must not be empty and item count must be positive');
  }

  // Step 1: Sort bids and assign winners
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const winningBidderMap = assignWinningBids(sortedBids, itemCount);
  
  // Step 2: Calculate V* (total auction value)
  const totalValue = sortedBids.slice(0, itemCount).reduce((sum, bid) => sum + bid.amount, 0);

  // Step 3 & 4: Calculate results for each winning bidder
  const winners = Array.from(winningBidderMap.entries()).map(([bidderId, bidderWins]) => {
    // Calculate V*j (value without this bidder)
    const vStarJ = calculateVStarJ(bids, itemCount, bidderId);
    
    // Calculate total value of this bidder's winning bids
    const bidderTotalValue = bidderWins.reduce((sum, bid) => sum + bid.amount, 0);
    
    // Calculate Vickrey price
    const vickreyPrice = Math.max(0, vStarJ - (totalValue - bidderTotalValue));
    
    // Calculate savings
    const savings = bidderTotalValue - vickreyPrice;
    
    return {
      bidderId,
      winningBids: bidderWins.map(b => b.amount).sort((a, b) => b - a),
      vickreyPrice,
      vStarJ,
      bidderTotalValue,
      savings
    };
  });

  // Step 5: Generate detailed explanation
  const explanation = [
    'Auction Summary:',
    `Total Items Available: ${itemCount}`,
    `Total Auction Value (V*): $${totalValue}`,
    '',
    'Step 1: Sorted Bids and Winners',
    ...winners.map(w => {
      const bidsStr = w.winningBids.map(b => `$${b}`).join(', ');
      return `Bidder ${w.bidderId}: Won ${w.winningBids.length} unit${w.winningBids.length > 1 ? 's' : ''} with bids [${bidsStr}]`;
    }),
    '',
    'Step 2: Total Value Calculation',
    `V* = $${totalValue} (sum of all winning bids)`,
    '',
    'Step 3: V*j Calculations',
    ...winners.map(w => 
      `Bidder ${w.bidderId}: V*j = $${w.vStarJ} (auction value without Bidder ${w.bidderId}'s bids)`
    ),
    '',
    'Step 4: Vickrey Price Calculations',
    ...winners.map(w => {
      return [
        `Bidder ${w.bidderId}:`,
        `- Total value of winning bids: $${w.bidderTotalValue}`,
        `- V*j (value without bidder): $${w.vStarJ}`,
        `- Vickrey price = V*j - (V* - winning bids)`,
        `  = $${w.vStarJ} - ($${totalValue} - $${w.bidderTotalValue})`,
        `  = $${w.vickreyPrice}`,
        `- Savings: $${w.savings}`,
        ''
      ].join('\n');
    })
  ];

  return {
    winners: winners.map(({ bidderId, winningBids, vickreyPrice, savings }) => ({
      bidderId,
      winningBids,
      vickreyPrice,
      savings
    })),
    totalValue,
    explanation: explanation.join('\n')
  };
}