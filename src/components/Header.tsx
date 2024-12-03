import React from 'react';
import VickreyImage from '../assets/william-vickrey.jpg';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export function Header() {
  return (
    <header className="bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left side - Image with caption */}
          <div className="relative shrink-0">
            <img 
              src={VickreyImage} 
              alt="William Vickrey" 
              className="rounded-lg shadow-lg w-[200px] h-[200px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/40 text-white p-2 rounded-b-lg">
              <p className="text-xs">
                William Vickrey (1914-1996)<br />Nobel Prize in Economics
              </p>
            </div>
          </div>

          {/* Right side - Title and description */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Vickrey Auction Helper</h1>
            <p className="text-lg text-indigo-600 mb-4">Multi-Unit Auction Calculator</p>
            
            <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-purple-100 mb-4">
              <h2 className="text-xl font-bold text-indigo-800 mb-2">Multi-Unit Vickrey Auctions</h2>
              <div className="bg-gray-50 p-3 rounded-lg mb-3 text-center">
                <p className="text-sm text-gray-600 mb-2">Vickrey Price Formula:</p>
                <InlineMath math="P_j = V^*_{-j} - (V^* - \sum_{i \in W_j} b_i)" />
                <div className="text-xs text-gray-500 mt-2 text-left">
                  Where: P_j = price for bidder j, V*_-j = value without j's bids,<br />
                  V* = total value, W_j = winning bids of j
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-2">
                Calculate prices for auctions where multiple identical items are sold simultaneously. 
                Each bidder can bid for multiple units with different values per unit.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Submit sealed bids per unit</li>
                  <li>Winners pay opportunity costs</li>
                </ul>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Promotes truthful bidding</li>
                  <li>Efficient price discovery</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl shadow-sm border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-800 mb-2">Quick Start</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
                <div>1. Set available units</div>
                <div>2. Add/generate bids</div>
                <div>3. View results instantly</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}