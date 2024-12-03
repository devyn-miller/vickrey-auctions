// Test case with 3 bidders and 3 units
const bids = [
    // Bidder 1
    { bidderId: 1, amount: 100, unitIndex: 0 },
    { bidderId: 1, amount: 90, unitIndex: 1 },
    { bidderId: 1, amount: 60, unitIndex: 2 },
    // Bidder 2
    { bidderId: 2, amount: 150, unitIndex: 0 },
    { bidderId: 2, amount: 50, unitIndex: 1 },
    { bidderId: 2, amount: 40, unitIndex: 2 },
    // Bidder 3
    { bidderId: 3, amount: 65, unitIndex: 0 },
    { bidderId: 3, amount: 40, unitIndex: 1 },
    { bidderId: 3, amount: 30, unitIndex: 2 },
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

// Run test with 3 items
console.log('Test Case: 3 bidders, 3 units');
console.log('Initial bids:');
console.log('Bidder\tUnit 1\tUnit 2\tUnit 3');
console.log('1\t100\t90\t60');
console.log('2\t150\t50\t40');
console.log('3\t65\t40\t30');
console.log('\nCalculating results...');

calculateVickreyAuction(bids, 3);
