import React, { useState } from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../../types/auction';
import { SelectableBidGrid } from './SelectableBidGrid';
import { ColorLegend } from './ColorLegend';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onSubmit: (answer: number) => void;
  onNext: () => void;
}

export function QuizQuestion({ question, onSubmit, onNext }: QuizQuestionProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    explanation?: string;
  } | null>(null);

  const handleSubmit = () => {
    const answer = Number(userAnswer);
    const isCorrect = answer === question.correctAnswer;
    
    setFeedback({
      isCorrect,
      message: isCorrect ? 'Correct! Well done!' : 'Not quite right. Let\'s see why:',
      explanation: !isCorrect ? question.explanation : undefined
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Question {question.id}</h3>
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <HelpCircle size={20} />
          <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium mb-4">{question.question}</p>

        {showHint && question.steps && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Helpful Steps:</p>
            <ol className="list-decimal list-inside space-y-2">
              {question.steps.map((step, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {step.title}: {step.description}
                  {step.formula && (
                    <span className="block ml-6 mt-1 font-mono text-xs">
                      {step.formula}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-lg font-medium mb-4">Auction Setup</h4>
          <ColorLegend />
          <div className="mt-4">
            <SelectableBidGrid
              bids={question.bids}
              currentStep={3}
              highlightedCells={[]}
              showPrices={false}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <div className="flex space-x-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your answer"
            />
            <button
              onClick={handleSubmit}
              disabled={!userAnswer}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </div>

        {feedback && (
          <div className={`mt-6 p-4 rounded-lg ${
            feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <p className={`font-medium ${
              feedback.isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {feedback.message}
            </p>
            {feedback.explanation && (
              <p className="mt-2 text-sm text-gray-600">
                {feedback.explanation}
              </p>
            )}
            {feedback.isCorrect && (
              <button
                onClick={onNext}
                className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <span>Next Question</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}