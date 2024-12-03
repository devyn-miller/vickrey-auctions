import { Bid, AuctionResult } from '../types/auction';

function calculateVStarJ(bids: Bid[], itemCount: number, excludedBidderId: number): number {
  const bidsWithoutBidder = bids.filter(b => b.bidderId !== excludedBidderId);
  const sortedBids = [...bidsWithoutBidder].sort((a, b) => b.amount - a.amount);
  return sortedBids.slice(0, itemCount).reduce((sum, bid) => sum + bid.amount, 0);
}

export function calculateVickreyAuction(bids: Bid[], itemCount: number): AuctionResult {
  // Sort bids in descending order
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const winningBids = sortedBids.slice(0, itemCount);
  const totalValue = winningBids.reduce((sum, bid) => sum + bid.amount, 0);
  
  const winners = winningBids.map(bid => {
    // Get all winning bids from this bidder
    const bidderWinningBids = winningBids.filter(b => b.bidderId === bid.bidderId);
    const bidderTotalValue = bidderWinningBids.reduce((sum, b) => sum + b.amount, 0);
    
    // Calculate V*j (total value without this bidder)
    const vStarJ = calculateVStarJ(bids, itemCount, bid.bidderId);
    
    // Calculate Vickrey price using the correct formula
    const vickreyPrice = Math.max(0, vStarJ - (totalValue - bidderTotalValue));
    
    return {
      bidderId: bid.bidderId,
      winningBid: bid.amount,
      vickreyPrice,
      vStarJ,
      bidderTotalValue
    };
  });

  // Remove duplicate winners (same bidder winning multiple units)
  const uniqueWinners = winners.reduce((acc, winner) => {
    const existing = acc.find(w => w.bidderId === winner.bidderId);
    if (!existing) {
      acc.push(winner);
    }
    return acc;
  }, [] as typeof winners);

  const explanation = [
    `Total auction value (V*): $${totalValue}`,
    '',
    'For each winner:',
    ...uniqueWinners.map(w => [
      `Bidder ${w.bidderId}:`,
      `- Total winning bids: $${w.bidderTotalValue}`,
      `- V*j (value without bidder): $${w.vStarJ}`,
      `- Vickrey price: $${w.vickreyPrice}`,
      `  = V*j ($${w.vStarJ}) - (V* ($${totalValue}) - winning bids ($${w.bidderTotalValue}))`
    ].join('\n'))
  ];

  return {
    winners: uniqueWinners,
    totalValue,
    explanation
  };
}