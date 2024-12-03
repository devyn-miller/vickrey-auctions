// Test the example case
const bids = [
    // Bidder 1
    { bidderId: 1, amount: 200, unitIndex: 0 },
    { bidderId: 1, amount: 97, unitIndex: 1 },
    { bidderId: 1, amount: 35, unitIndex: 2 },
    // Bidder 2
    { bidderId: 2, amount: 187, unitIndex: 0 },
    { bidderId: 2, amount: 125, unitIndex: 1 },
    { bidderId: 2, amount: 100, unitIndex: 2 },
    // Bidder 3
    { bidderId: 3, amount: 180, unitIndex: 0 },
    { bidderId: 3, amount: 170, unitIndex: 1 },
    { bidderId: 3, amount: 160, unitIndex: 2 },
    // Bidder 4
    { bidderId: 4, amount: 300, unitIndex: 0 },
    { bidderId: 4, amount: 50, unitIndex: 1 },
    { bidderId: 4, amount: 0, unitIndex: 2 },
    // Bidder 5
    { bidderId: 5, amount: 150, unitIndex: 0 },
    { bidderId: 5, amount: 150, unitIndex: 1 },
    { bidderId: 5, amount: 130, unitIndex: 2 },
];

function calculateVStarJ(bids, itemCount, excludedBidderId) {
    const bidsWithoutBidder = bids.filter(b => b.bidderId !== excludedBidderId);
    const sortedBids = [...bidsWithoutBidder].sort((a, b) => b.amount - a.amount);
    return sortedBids.slice(0, itemCount).reduce((sum, bid) => sum + bid.amount, 0);
}

function calculateVickreyAuction(bids, itemCount) {
    // Sort all bids in descending order
    const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
    const winningBids = sortedBids.slice(0, itemCount);
    const totalValue = winningBids.reduce((sum, bid) => sum + bid.amount, 0);
    
    // Group winning bids by bidder
    const winningBidderMap = new Map();
    winningBids.forEach(bid => {
        if (!winningBidderMap.has(bid.bidderId)) {
            winningBidderMap.set(bid.bidderId, []);
        }
        winningBidderMap.get(bid.bidderId).push(bid);
    });

    // Calculate results for each winning bidder
    const winners = Array.from(winningBidderMap.entries()).map(([bidderId, bidderWins]) => {
        const vStarJ = calculateVStarJ(bids, itemCount, bidderId);
        const bidderTotalValue = bidderWins.reduce((sum, bid) => sum + bid.amount, 0);
        const vickreyPrice = vStarJ - (totalValue - bidderTotalValue);
        
        return {
            bidderId,
            winningBids: bidderWins.map(b => b.amount).sort((a, b) => b - a),
            vickreyPrice,
            vStarJ,
            bidderTotalValue
        };
    });

    console.log('\nDetailed Calculations:');
    console.log('=====================');
    console.log(`Total auction value (V*): $${totalValue}`);
    console.log('\nWinning bids:');
    winningBids.forEach(bid => {
        console.log(`Bidder ${bid.bidderId}: $${bid.amount}`);
    });
    
    console.log('\nVickrey prices:');
    winners.forEach(w => {
        console.log(`\nBidder ${w.bidderId}:`);
        console.log(`- Winning bids: ${w.winningBids.map(b => '$' + b).join(', ')}`);
        console.log(`- Total value of winning bids: $${w.bidderTotalValue}`);
        console.log(`- V*j (value without bidder): $${w.vStarJ}`);
        console.log(`- Vickrey price: $${w.vickreyPrice}`);
        console.log(`- Calculation: $${w.vStarJ} - ($${totalValue} - $${w.bidderTotalValue}) = $${w.vickreyPrice}`);
    });
}

// Run test with 6 items
calculateVickreyAuction(bids, 6);
