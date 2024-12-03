import React from 'react';

export function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            V
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Vickrey Auction Calculator</h1>
        </div>
      </div>
    </header>
  );
}