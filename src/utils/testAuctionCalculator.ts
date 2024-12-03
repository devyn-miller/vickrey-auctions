import { calculateVickreyAuction } from './auctionCalculator';
import { Bid } from '../types/auction';

// Test the example case
const bids: Bid[] = [
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

// Run the test with 6 items
const result = calculateVickreyAuction(bids, 6);

// Print the results
console.log('Test Results:');
console.log('=============');
console.log(result.explanation.join('\n'));
