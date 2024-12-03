import { Bid } from '../types/auction';

export function sortBidsByAmount(bids: Bid[]): Bid[] {
  return [...bids].sort((a, b) => b.amount - a.amount);
}

export function groupBidsByBidder(bids: Bid[]): Map<number, Bid[]> {
  const bidderMap = new Map<number, Bid[]>();
  
  bids.forEach(bid => {
    const bidderBids = bidderMap.get(bid.bidderId) || [];
    bidderBids.push(bid);
    bidderMap.set(bid.bidderId, bidderBids.sort((a, b) => 
      (a.unitIndex || 0) - (b.unitIndex || 0)
    ));
  });
  
  return bidderMap;
}

export function getWinningBids(bids: Bid[], itemCount: number): Bid[] {
  return sortBidsByAmount(bids).slice(0, itemCount);
}

export function getBidderTotalValue(bids: Bid[], bidderId: number): number {
  return bids
    .filter(bid => bid.bidderId === bidderId)
    .reduce((sum, bid) => sum + bid.amount, 0);
}