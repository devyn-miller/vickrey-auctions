import React from 'react';
import { useAuctionStore } from '../store/auctionStore';
import { Book, GraduationCap } from 'lucide-react';
import { StepByStepGuide } from './learning/StepByStepGuide';
import { QuizQuestion } from './learning/QuizQuestion';

export function LearnMode() {
  const { 
    mode, 
    currentQuiz, 
    startQuiz, 
    setMode,
    checkAnswer,
    nextQuestion
  } = useAuctionStore();

  if (mode === 'quiz' && currentQuiz) {
    return (
      <div className="max-w-7xl mx-auto">
        <QuizQuestion
          question={currentQuiz}
          onSubmit={(answer) => checkAnswer(answer)}
          onNext={nextQuestion}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {mode === 'learn' ? (
        <StepByStepGuide />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <Book className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">
            Welcome to Learning Mode
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Learn how Vickrey auctions work through an interactive, step-by-step guide
            or test your knowledge with our quiz mode.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setMode('learn')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <Book size={20} />
              <span>Start Interactive Guide</span>
            </button>
            <button
              onClick={() => {
                startQuiz();
                setMode('quiz');
              }}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              <GraduationCap size={20} />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}