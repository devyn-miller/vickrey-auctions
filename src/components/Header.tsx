import React from 'react';
import { useAuctionStore } from '../store/auctionStore';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Vickrey Auction Helper</h1>
            <span className="bg-blue-500 text-sm px-2 py-1 rounded">Beta</span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a
              href="https://en.wikipedia.org/wiki/Vickrey_auction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition-colors"
            >
              Learn More
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}