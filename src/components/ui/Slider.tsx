import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export function Slider({ value, onChange, min, max, step }: SliderProps) {
  return (
    <div className="relative w-full h-6 flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 
          [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:hover:bg-indigo-700 [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 
          [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-all
          [&::-moz-range-thumb]:hover:bg-indigo-700 [&::-moz-range-thumb]:hover:scale-110"
      />
    </div>
  );
}
