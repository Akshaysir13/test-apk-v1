import { useState } from 'react';
import { useTest } from '../contexts/TestContext';
import { useAuth } from '../contexts/AuthContext';
import { TestAttempt } from '../types';

export function TestHistory() {
  const { getStudentAttempts, tests } = useTest();
  const { currentUser } = useAuth();
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttempt | null>(null);

  if (!currentUser) return null;

  const attempts = getStudentAttempts(currentUser.email);

  if (attempts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No test attempts yet</p>
      </div>
    );
  }

  // If viewing a specific attempt
  if (selectedAttempt) {
    return (
      <AttemptDetailView 
        attempt={selectedAttempt} 
        onBack={() => setSelectedAttempt(null)}
        tests={tests}
      />
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Test History</h2>
      
      {attempts.map((attempt, index) => {
        const percentage = ((attempt.score / (attempt.totalQuestions * 4)) * 100).toFixed(1);
        const timeSpent = Math.floor(attempt.timeTaken / 60);
        const attemptDate = new Date(attempt.submittedAt);

        return (
          <div 
            key={attempt.id} 
            className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {attempt.testName}
                </h3>
                <p className="text-sm text-gray-500">
                  Attempt #{attempts.length - index} • {attemptDate.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {attempt.score}
                </div>
                <div className="text-sm text-gray-500">
                  / {attempt.totalQuestions * 4} marks
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 rounded p-3">
                <div className="text-green-600 text-sm font-medium">Correct</div>
                <div className="text-2xl font-bold text-green-700">
                  {attempt.correctAnswers}
                </div>
              </div>
              
              <div className="bg-red-50 rounded p-3">
                <div className="text-red-600 text-sm font-medium">Wrong</div>
                <div className="text-2xl font-bold text-red-700">
                  {attempt.wrongAnswers}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <div className="text-gray-600 text-sm font-medium">Unattempted</div>
                <div className="text-2xl font-bold text-gray-700">
                  {attempt.unattempted}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded p-3">
                <div className="text-blue-600 text-sm font-medium">Percentage</div>
                <div className="text-2xl font-bold text-blue-700">
                  {percentage}%
                </div>
              </div>
            </div>

            {/* Time & Violations */}
            <div className="flex flex-wrap gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">⏱️ Time Taken:</span>
                <span className="font-medium">{timeSpent} min</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📱 Tab Switches:</span>
                <span className="font-medium">{attempt.tabSwitchCount}</span>
              </div>
              
              {attempt.violations && attempt.violations.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️ Violations:</span>
                  <span className="font-medium text-red-600">
                    {attempt.violations.length}
                  </span>
                </div>
              )}
            </div>

            {/* View Details Button */}
            <button
              onClick={() => setSelectedAttempt(attempt)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              📝 View Complete Test & Answers
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// DETAILED ATTEMPT VIEW COMPONENT
// ==========================================
interface AttemptDetailViewProps {
  attempt: TestAttempt;
  onBack: () => void;
  tests: any[];
}

function AttemptDetailView({ attempt, onBack, tests }: AttemptDetailViewProps) {
  // Use stored questions from attempt if available, fallback to test questions
  const reviewQuestions = attempt.questions || tests.find(t => t.id === attempt.testId)?.questions;
  
  if (!reviewQuestions) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={onBack}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to History
        </button>
        <p className="text-red-500">Test questions not available</p>
      </div>
    );
  }

  const attemptDate = new Date(attempt.submittedAt);
  const percentage = ((attempt.score / (attempt.totalQuestions * 4)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={onBack}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          ← Back to History
        </button>
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{attempt.testName}</h2>
            <p className="text-gray-500">Attempted on: {attemptDate.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{attempt.score}</div>
            <div className="text-sm text-gray-500">/ {attempt.totalQuestions * 4} marks</div>
            <div className="text-lg font-medium text-gray-700">{percentage}%</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{attempt.correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">{attempt.wrongAnswers}</div>
            <div className="text-sm text-gray-600">Wrong</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-gray-600">{attempt.unattempted}</div>
            <div className="text-sm text-gray-600">Skipped</div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Question-wise Review</h3>
        
        {reviewQuestions.map((question: any, index: number) => {
          // Get student's answer and correct answer
          const studentAnswerIndex = attempt.answers?.[question.id];
          const correctAnswerKey = question.correctOption;
          
          // Check if question is shuffled (has shuffledOptions)
          const isShuffled = !!question.shuffledOptions;
          
          let isCorrect = false;
          if (studentAnswerIndex !== undefined) {
            if (isShuffled) {
              isCorrect = question.shuffledOptions[studentAnswerIndex]?.originalKey === correctAnswerKey;
            } else {
              // Fallback for non-shuffled questions if any
              isCorrect = String.fromCharCode(97 + studentAnswerIndex) === correctAnswerKey;
            }
          }
          
          const isUnattempted = studentAnswerIndex === undefined;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                isUnattempted
                  ? 'border-gray-400'
                  : isCorrect
                  ? 'border-green-500'
                  : 'border-red-500'
              }`}
            >
              {/* Question Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700">Q{index + 1}.</span>
                  <span
                    className={`text-sm px-2 py-1 rounded font-medium ${
                      isUnattempted
                        ? 'bg-gray-100 text-gray-700'
                        : isCorrect
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {isUnattempted ? 'Not Attempted' : isCorrect ? '✓ Correct' : '✗ Wrong'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {question.subject}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-gray-800 mb-4 font-medium">{question.question}</p>

              {/* Options */}
              <div className="space-y-2">
                {isShuffled ? (
                  question.shuffledOptions.map((opt: any, optIdx: number) => {
                    const isStudentAnswer = studentAnswerIndex === optIdx;
                    const isCorrectAnswer = opt.originalKey === correctAnswerKey;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded border-2 ${
                          isCorrectAnswer
                            ? 'bg-green-50 border-green-500'
                            : isStudentAnswer && !isCorrect
                            ? 'bg-red-50 border-red-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-bold min-w-[30px]">
                            ({letter})
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          <div className="flex flex-col items-end gap-1">
                          {isCorrectAnswer && (
                            <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-0.5 rounded">
                              ✓ Correct Answer
                            </span>
                          )}
                          {isStudentAnswer && !isCorrect && (
                            <span className="text-red-600 font-bold text-sm bg-red-100 px-2 py-0.5 rounded">
                              ✗ Your Answer
                            </span>
                          )}
                          {isStudentAnswer && isCorrect && (
                            <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-0.5 rounded">
                              ✓ Your Answer (Correct)
                            </span>
                          )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  ['a', 'b', 'c', 'd'].map((optionKey, optIdx) => {
                    const optionText = question[`option${optionKey.toUpperCase()}`];
                    const isStudentAnswer = studentAnswerIndex === optIdx;
                    const isCorrectAnswer = correctAnswerKey === optionKey;

                    return (
                      <div
                        key={optionKey}
                        className={`p-3 rounded border-2 ${
                          isCorrectAnswer
                            ? 'bg-green-50 border-green-500'
                            : isStudentAnswer && !isCorrect
                            ? 'bg-red-50 border-red-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-bold min-w-[30px]">
                            ({optionKey.toUpperCase()})
                          </span>
                          <span className="flex-1">{optionText}</span>
                          <div className="flex flex-col items-end gap-1">
                            {isCorrectAnswer && (
                              <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-0.5 rounded">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isStudentAnswer && !isCorrect && (
                              <span className="text-red-600 font-bold text-sm bg-red-100 px-2 py-0.5 rounded">
                                ✗ Your Answer
                              </span>
                            )}
                            {isStudentAnswer && isCorrect && (
                              <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-0.5 rounded">
                                ✓ Your Answer (Correct)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Unattempted Notice */}
              {isUnattempted && (
                <div className="mt-4 p-3 bg-gray-100 border-l-4 border-gray-400 rounded">
                  <p className="text-gray-700 font-medium">
                    ⚪ You did not attempt this question
                  </p>
                </div>
              )}

              {/* Solution/Explanation (if available) */}
              {question.solution && (
                <details className="mt-4 p-3 bg-blue-50 rounded">
                  <summary className="cursor-pointer font-medium text-blue-700">
                    💡 View Solution
                  </summary>
                  <p className="mt-2 text-gray-700">{question.solution}</p>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}