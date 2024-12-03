import React from 'react';
import { Gavel } from 'lucide-react';
import { useAuctionStore } from '../store/auctionStore';

export function Header() {
  const { mode, setMode } = useAuctionStore();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gavel className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Vickrey Auction Helper</h1>
        </div>
        <nav className="space-x-6">
          <button
            onClick={() => setMode('calculator')}
            className={`transition-colors ${
              mode === 'calculator'
                ? 'text-white font-semibold'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setMode('learn')}
            className={`transition-colors ${
              mode === 'learn'
                ? 'text-white font-semibold'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Learn
          </button>
        </nav>
      </div>
    </header>
  );
}