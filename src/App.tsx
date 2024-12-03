import React from 'react';
import { Header } from './components/Header';
import { AuctionCalculator } from './components/AuctionCalculator';
import { LearnMode } from './components/LearnMode';
import { Footer } from './components/Footer';
import { useAuctionStore } from './store/auctionStore';

export function App() {
  const mode = useAuctionStore((state) => state.mode);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="container mx-auto py-8 flex-grow">
        {mode === 'calculator' ? <AuctionCalculator /> : <LearnMode />}
      </main>
      <Footer />
    </div>
  );
}

export default App;