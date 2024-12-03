import React, { useState } from 'react';
import { useAuctionStore } from '../../store/auctionStore';
import { Check, X, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import { HighlightedBidGrid } from './HighlightedBidGrid';
import { ColorLegend } from './ColorLegend';

export function QuizMode() {
  const { currentQuiz, checkAnswer, nextQuestion, startQuiz } = useAuctionStore();
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    breakdown?: string[];
  } | null>(null);

  if (!currentQuiz) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <button
          onClick={startQuiz}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          <RotateCcw size={20} />
          <span>Start New Quiz</span>
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    const answer = Number(userAnswer);
    const isCorrect = checkAnswer(answer);
    
    setFeedback({
      isCorrect,
      message: isCorrect 
        ? 'Correct! Well done!' 
        : 'Not quite right. Let\'s break it down:',
      breakdown: !isCorrect ? currentQuiz.steps?.map(step => 
        `${step.title}: ${step.description}${step.formula ? ` (${step.formula})` : ''}`
      ) : undefined
    });
  };

  const handleNext = () => {
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    nextQuestion();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Question {currentQuiz.id}</h3>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <HelpCircle size={20} />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 font-medium mb-4">{currentQuiz.question}</p>

          {showHint && currentQuiz.steps && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Helpful Tips:</p>
              <ul className="list-disc list-inside space-y-2">
                {currentQuiz.steps.map((step, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {step.title}: {step.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6">
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">Auction Setup</h4>
              <ColorLegend />
              <HighlightedBidGrid 
                bids={currentQuiz.bids} 
                itemCount={currentQuiz.itemCount}
                showPrices={false}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer:
              </label>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your answer"
              />
            </div>
          </div>
        </div>

        {feedback ? (
          <div>
            <div className={`p-4 rounded-lg mb-4 ${
              feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center mb-2">
                {feedback.isCorrect ? (
                  <Check className="text-green-500 mr-2" />
                ) : (
                  <X className="text-red-500 mr-2" />
                )}
                <span className={feedback.isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {feedback.message}
                </span>
              </div>
              {feedback.breakdown && (
                <ul className="mt-4 space-y-2">
                  {feedback.breakdown.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {step}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <span>Next Question</span>
              <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
}