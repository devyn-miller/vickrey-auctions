import React from 'react';
import { Header } from './components/Header';
import { AuctionCalculator } from './components/AuctionCalculator';
import { Footer } from './components/Footer';
import { useAuctionStore } from './store/auctionStore';

export function App() {
  const mode = 'calculator'; // force mode to 'calculator'

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="container mx-auto py-8 flex-grow">
        {/* Commented out mode selection for now */}
        {/* <div className="flex justify-center mb-6">
          <div className="bg-white shadow-md rounded-lg inline-flex">
            <button 
              onClick={() => setMode('calculator')} 
              className={`px-4 py-2 rounded-l-lg transition-colors ${
                mode === 'calculator' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Calculator
            </button>
            <button 
              onClick={() => setMode('learn')} 
              className={`px-4 py-2 rounded-r-lg transition-colors ${
                mode === 'learn' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Learn
            </button>
          </div>
        </div> */}
        
        <AuctionCalculator />
      </main>
      <Footer />
    </div>
  );
}

export default App;