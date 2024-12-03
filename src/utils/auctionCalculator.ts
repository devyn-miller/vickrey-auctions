import { Bid, AuctionResult } from '../types/auction';

/**
 * Calculates V*j - the total value when excluding a specific bidder
 * This is the sum of the top k bids after removing the specified bidder's bids
 */
function calculateVStarJ(bids: Bid[], itemCount: number, excludedBidderId: number): number {
  const bidsWithoutBidder = bids.filter(b => b.bidderId !== excludedBidderId);
  const sortedBids = [...bidsWithoutBidder].sort((a, b) => b.amount - a.amount);
  return sortedBids.slice(0, itemCount).reduce((sum, bid) => sum + bid.amount, 0);
}

export function calculateVickreyAuction(bids: Bid[], itemCount: number): AuctionResult {
  // Step 1: Select winning bids (top k bids)
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const winningBids = sortedBids.slice(0, itemCount);
  
  // Step 2: Calculate V* (total auction value)
  const totalValue = winningBids.reduce((sum, bid) => sum + bid.amount, 0);
  
  // Step 3: Group winning bids by bidder
  const winningBidderMap = new Map<number, Bid[]>();
  winningBids.forEach(bid => {
    if (!winningBidderMap.has(bid.bidderId)) {
      winningBidderMap.set(bid.bidderId, []);
    }
    winningBidderMap.get(bid.bidderId)!.push(bid);
  });

  // Step 4: Calculate results for each winning bidder
  const winners = Array.from(winningBidderMap.entries()).map(([bidderId, bidderWins]) => {
    // Calculate V*j (value without this bidder)
    const vStarJ = calculateVStarJ(bids, itemCount, bidderId);
    
    // Calculate total value of this bidder's winning bids
    const bidderTotalValue = bidderWins.reduce((sum, bid) => sum + bid.amount, 0);
    
    // Calculate Vickrey price using the formula:
    // Vickrey Price = V*j - (V* - Value of Bidder's Winning Bids)
    const vickreyPrice = vStarJ - (totalValue - bidderTotalValue);
    
    return {
      bidderId,
      winningBids: bidderWins.map(b => b.amount).sort((a, b) => b - a),
      vickreyPrice,
      vStarJ,
      bidderTotalValue
    };
  });

  // Step 5: Generate explanation
  const explanation = [
    `Total Value: $${totalValue}`,
    '',
    'Winners:',
    ...winners.map(w => {
      const bidsStr = w.winningBids.length === 1 
        ? `$${w.winningBids[0]}`
        : `bids [${w.winningBids.map(b => `$${b}`).join(', ')}]`;
      return `Bidder ${w.bidderId}: Won with ${bidsStr}, pays $${w.vickreyPrice}`;
    }),
    '',
    `Total auction value (V*): $${totalValue}`,
    '',
    'For each winner:',
    '',
    ...winners.map(w => {
      const lines = [
        `Bidder ${w.bidderId}:`,
        `- Winning bids: ${w.winningBids.map(b => `$${b}`).join(', ')}`,
        `- Total value of winning bids: $${w.bidderTotalValue}`,
        `- V*j (value without bidder): $${w.vStarJ}`,
        `- Vickrey price calculation:`,
        `  V*j ($${w.vStarJ}) - (V* ($${totalValue}) - winning bids ($${w.bidderTotalValue}))`,
        `  = $${w.vickreyPrice}`,
        ''
      ];
      return lines.join('\n');
    }),
    'Detailed Calculations:',
    ...winners.map(w => {
      const lines = [
        `For Bidder ${w.bidderId}:`,
        `1. Original winning bid${w.winningBids.length > 1 ? 's' : ''}: ${w.winningBids.map(b => `$${b}`).join(', ')}`,
        `2. Total value of winning bids: $${w.bidderTotalValue}`,
        `3. Vickrey price: $${w.vickreyPrice}`,
        `4. Total savings: $${w.bidderTotalValue - w.vickreyPrice}`,
        ''
      ];
      return lines.join('\n');
    })
  ];

  return {
    winners: winners.map(({ bidderId, winningBids, vickreyPrice }) => ({
      bidderId,
      winningBid: Math.max(...winningBids),
      vickreyPrice
    })),
    totalValue,
    explanation
  };
}