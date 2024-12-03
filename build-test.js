import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// First, compile TypeScript files
const tsc = exec('npx tsc src/utils/auctionCalculator.ts --outDir dist --module ES2020 --moduleResolution node --target ES2020', async (error, stdout, stderr) => {
    if (error) {
        console.error(`Error compiling TypeScript: ${error}`);
        return;
    }

    // Create test data
    const testCode = `
    import { calculateVickreyAuction } from '../dist/utils/auctionCalculator.js';

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

    // Run the test with 6 items
    const result = calculateVickreyAuction(bids, 6);

    // Print the results
    console.log('Test Results:');
    console.log('=============');
    console.log(result.explanation.join('\\n'));
    `;

    // Write test file
    await fs.mkdir('dist/test', { recursive: true });
    await fs.writeFile('dist/test/test.js', testCode);

    // Run the test
    exec('node dist/test/test.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running test: ${error}`);
            return;
        }
        console.log(stdout);
    });
});
