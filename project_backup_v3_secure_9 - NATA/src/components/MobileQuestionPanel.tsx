import { useState } from 'react';
import { List, X, User, Shield } from 'lucide-react';
import { useTest } from '../contexts/TestContext';
import { useAuth } from '../contexts/AuthContext';

export default function MobileQuestionPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const {
    questions,
    currentQuestion,
    answers,
    markedForReview,
    visitedQuestions,
    violations,
    selectedTest,
    handleQuestionNavigation,
    getStatusCounts,
  } = useTest();

  const statusCounts = getStatusCounts();

  const handleNavigate = (idx: number) => {
    handleQuestionNavigation(idx);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-xl shadow-lg transition-all"
        aria-label="Open question panel"
      >
        <List size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-50 shadow-2xl overflow-auto animate-slide-in-right">
            <div className="bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between sticky top-0">
              <h2 className="font-bold text-gray-800">Question Panel</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="bg-white border-b-2 border-gray-200 p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                <User size={24} className="text-gray-600" />
              </div>
              <div>
                <div className="text-blue-600 font-medium text-sm">Profile</div>
                <div className="text-xs text-gray-600 truncate max-w-[180px]">{currentUser?.email}</div>
              </div>
            </div>

            {violations.length > 0 && (
              <div className="bg-red-50 border-b-2 border-red-200 p-3">
                <div className="flex items-center gap-2 text-red-700 text-xs font-semibold mb-2">
                  <Shield size={16} />
                  Security Alerts: {violations.length}
                </div>
                <div className="text-xs text-red-600 max-h-20 overflow-y-auto">
                  {violations.slice(-3).map((v, idx) => (
                    <div key={idx} className="py-1">* {v}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-white border-b-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {statusCounts.answered}
                  </div>
                  <span className="text-xs font-medium text-gray-700">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {statusCounts.visitedNotAnswered}
                  </div>
                  <span className="text-xs font-medium text-gray-700">Not Answered</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {statusCounts.notVisited}
                  </div>
                  <span className="text-xs font-medium text-gray-700">Not Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {statusCounts.markedForReviewCount}
                  </div>
                  <span className="text-xs font-medium text-gray-700">Review</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-green-500">
                  {statusCounts.answeredMarked}
                </div>
                <span className="text-xs text-gray-700">Answered & Marked</span>
              </div>
            </div>

            <div className="p-4">
              <div className="bg-blue-600 text-white text-center py-2 mb-3 font-semibold text-sm rounded">
                {selectedTest?.name}
              </div>
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Choose a Question</h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => {
                  const qId = questions[idx].id;
                  const isAnswered = answers[qId] !== undefined;
                  const isMarked = markedForReview[qId];
                  const isCurrent = idx === currentQuestion;
                  const isVisited = visitedQuestions.has(idx);

                  let bgColor = 'bg-gray-300 text-gray-700';
                  let borderClass = '';

                  if (isCurrent) {
                    bgColor = 'bg-orange-500 text-white shadow-lg';
                  } else if (isAnswered && isMarked) {
                    bgColor = 'bg-purple-600 text-white';
                    borderClass = 'ring-4 ring-green-500';
                  } else if (isAnswered) {
                    bgColor = 'bg-green-500 text-white';
                  } else if (isMarked) {
                    bgColor = 'bg-purple-600 text-white';
                  } else if (isVisited) {
                    bgColor = 'bg-red-500 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleNavigate(idx)}
                      className={`w-10 h-10 rounded-lg font-bold text-sm ${bgColor} ${borderClass} hover:opacity-80 transition`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
