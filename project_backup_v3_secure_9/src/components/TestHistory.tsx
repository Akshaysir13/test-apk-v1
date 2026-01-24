import { useState, useEffect } from 'react';
import { Shield, Maximize, AlertTriangle } from 'lucide-react';
import { useTest } from '../contexts/TestContext';
import { useAuth } from '../contexts/AuthContext';
import { TestAttempt, Test } from '../types';

// Screenshot Blocker Component
interface ScreenshotBlockerProps {
  onEnterFullscreen: () => void;
}

function ScreenshotBlocker({ onEnterFullscreen }: ScreenshotBlockerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const webViewDetected = userAgent.includes('wv') ||
      userAgent.includes('webview') ||
      (window as any).ReactNativeWebView !== undefined ||
      (window as any).flutter_inappwebview !== undefined;

    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    setIsWebView(webViewDetected);
    setIsMobile((isMobileUA || (isTouchDevice && isSmallScreen)) && !webViewDetected);
  }, []);

  if (isMobile || isWebView) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-auto">
      <div className="text-center p-4 sm:p-8 max-w-md bg-slate-900 rounded-xl border-2 border-red-600 shadow-2xl mx-4">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Shield className="text-red-500 animate-pulse w-16 h-16 sm:w-20 sm:h-20" />
            <AlertTriangle className="absolute top-0 right-0 text-red-600 animate-bounce w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-red-500 mb-4 uppercase">VIOLATION!</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Screenshot Detected</h2>
        <p className="text-red-300 mb-6 text-base sm:text-lg font-semibold">
          ⚠️ Taking screenshots is PROHIBITED
        </p>
        <p className="text-gray-300 mb-4 text-sm sm:text-base">This violation has been recorded and logged.</p>
        <p className="text-gray-400 mb-8 text-xs sm:text-sm">
          Continued attempts may result in immediate test termination and account suspension.
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEnterFullscreen();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 mx-auto cursor-pointer w-full sm:w-auto"
        >
          <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
          Continue
        </button>
        <p className="text-gray-500 mt-8 text-xs border-t border-gray-700 pt-4">
          All attempts are monitored and logged.
        </p>
      </div>
    </div>
  );
}

export function TestHistory() {
  const { getStudentAttempts, tests } = useTest();
  const { currentUser } = useAuth();
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttempt | null>(null);
  const [showBlocker, setShowBlocker] = useState(false);

  // Screenshot blocking effect
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Detect when window loses focus (possible screenshot attempt)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.warn('Page hidden - possible screenshot attempt detected');
        setShowBlocker(true);
      }
    };

    // Detect screenshot attempts via keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setShowBlocker(true);
      }
      // Ctrl/Cmd + Shift + S (Firefox screenshot)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setShowBlocker(true);
      }
      // Windows + Shift + S (Windows Snipping Tool)
      if (e.metaKey && e.shiftKey && e.key === 's') {
        e.preventDefault();
        setShowBlocker(true);
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleEnterFullscreen = () => {
    setShowBlocker(false);
    // Optionally try to enter fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen failed, but continue anyway
      });
    }
  };

  if (!currentUser) return null;

  const attempts = getStudentAttempts(currentUser.email);

  // Show screenshot blocker if triggered
  if (showBlocker) {
    return <ScreenshotBlocker onEnterFullscreen={handleEnterFullscreen} />;
  }

  if (attempts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No test attempts yet</p>
      </div>
    );
  }

  // Helper to calculate max marks based on test sections
  const calculateMaxMarks = (testId: string, totalQuestions: number) => {
    const test = tests.find(t => t.id === testId);
    if (test?.sections && test.sections.length > 0) {
      return test.sections.reduce((acc, section) => {
        const marks = section.type === 'drawing' ? 50 : 4;
        return acc + (section.questionIndices.length * marks);
      }, 0);
    }
    // Fallback for tests without sections
    return totalQuestions * 4;
  };

  // If viewing a specific attempt
  if (selectedAttempt) {
    return (
      <AttemptDetailView
        attempt={selectedAttempt}
        onBack={() => setSelectedAttempt(null)}
        tests={tests}
        calculateMaxMarks={calculateMaxMarks}
      />
    );
  }

  // List view
  return (
    <div className="space-y-4" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      <h2 className="text-2xl font-bold mb-4">My Test History</h2>

      {attempts.map((attempt, index) => {
        const maxMarks = calculateMaxMarks(attempt.testId, attempt.totalQuestions);
        const percentage = ((attempt.score / maxMarks) * 100).toFixed(1);
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
                  / {maxMarks} marks
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
  tests: Test[];
  calculateMaxMarks: (testId: string, totalQuestions: number) => number;
}

function AttemptDetailView({ attempt, onBack, tests, calculateMaxMarks }: AttemptDetailViewProps) {
  const [showBlocker, setShowBlocker] = useState(false);

  // Use stored questions from attempt if available, fallback to test questions
  const reviewQuestions = attempt.questions || tests.find(t => t.id === attempt.testId)?.questions;

  // Screenshot blocking effect for detail view
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.warn('Page hidden - possible screenshot attempt detected');
        setShowBlocker(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setShowBlocker(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setShowBlocker(true);
      }
      if (e.metaKey && e.shiftKey && e.key === 's') {
        e.preventDefault();
        setShowBlocker(true);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleEnterFullscreen = () => {
    setShowBlocker(false);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => { });
    }
  };

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

  // Show screenshot blocker if triggered
  if (showBlocker) {
    return <ScreenshotBlocker onEnterFullscreen={handleEnterFullscreen} />;
  }

  const attemptDate = new Date(attempt.submittedAt);
  const maxMarks = calculateMaxMarks(attempt.testId, attempt.totalQuestions);
  const percentage = ((attempt.score / maxMarks) * 100).toFixed(1);

  return (
    <div className="space-y-6" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
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
            <div className="text-sm text-gray-500">/ {maxMarks} marks</div>
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
          // Determine question type
          const isNumericType = question.type === 'numeric';
          const isMatchPairType = question.type === 'match-pair';

          // Get student's answer and correct answer
          const studentAnswerIndex = attempt.answers?.[question.id];
          const correctAnswerKey = question.correctOption;

          // Check if question is shuffled (has shuffledOptions)
          const isShuffled = !!question.shuffledOptions;

          let isCorrect = false;
          if (isNumericType) {
            // For numeric questions, compare the numeric answer
            // correctOption holds the correct answer for numeric questions
            if (studentAnswerIndex !== undefined) {
              const correctAns = question.correctOption;
              isCorrect = parseFloat(studentAnswerIndex) === parseFloat(correctAns);
            }
          } else {
            if (studentAnswerIndex !== undefined) {
              if (isShuffled) {
                isCorrect = question.shuffledOptions[studentAnswerIndex]?.originalKey === correctAnswerKey;
              } else {
                // Fallback for non-shuffled questions if any
                isCorrect = String.fromCharCode(97 + studentAnswerIndex) === correctAnswerKey;
              }
            }
          }

          const isUnattempted = studentAnswerIndex === undefined;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-lg shadow p-6 border-l-4 ${isUnattempted
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
                    className={`text-sm px-2 py-1 rounded font-medium ${isUnattempted
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

              {/* Question Image (if present) */}
              {question.image && (
                <div className="mb-4">
                  <img
                    src={question.image}
                    alt="Question illustration"
                    className="max-w-full h-auto rounded border border-gray-300 shadow-sm"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              )}

              {/* Match-Pair Type Display */}
              {isMatchPairType ? (
                <div className="space-y-4">
                  {/* Display the columns */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                      <h4 className="font-bold text-blue-800 mb-3">Column A</h4>
                      <div className="space-y-2">
                        {question.columnAItems.map((item: string, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded border border-blue-200">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                      <h4 className="font-bold text-purple-800 mb-3">Column B</h4>
                      <div className="space-y-2">
                        {question.columnBItems.map((item: string, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded border border-purple-200">
                            <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Display answer options */}
                  <div className="space-y-2">
                    {['a', 'b', 'c', 'd'].map((optionKey, optIdx) => {
                      const optionText = question[`option${optionKey.toUpperCase()}`];
                      if (!optionText) return null;

                      const isStudentAnswer = studentAnswerIndex === optIdx;
                      const isCorrectAnswer = correctAnswerKey === optionKey;

                      return (
                        <div
                          key={optionKey}
                          className={`p-3 rounded border-2 ${isCorrectAnswer
                            ? 'bg-green-50 border-green-500'
                            : isStudentAnswer && !isCorrect
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-1 font-mono">{optionText}</span>
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
                    })}
                  </div>
                </div>
              ) : isNumericType ? (
                /* Numeric Type Answer Display */
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border-2 border-green-500 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-700 font-bold text-sm">
                        Correct Answer:
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {question.correctOption}
                    </div>
                  </div>

                  {!isUnattempted && (
                    <div className={`p-4 border-2 rounded ${isCorrect
                        ? 'bg-green-50 border-green-500'
                        : 'bg-red-50 border-red-500'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-bold text-sm ${isCorrect
                            ? 'text-green-700'
                            : 'text-red-700'
                          }`}>
                          {isCorrect ? 'Your Answer: (Correct)' : 'Your Answer: (Wrong)'}
                        </span>
                      </div>
                      <div className={`text-2xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {studentAnswerIndex}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* MCQ Options Display */
                <div className="space-y-2">
                  {isShuffled ? (
                    question.shuffledOptions.map((opt: any, optIdx: number) => {
                      const isStudentAnswer = studentAnswerIndex === optIdx;
                      const isCorrectAnswer = opt.originalKey === correctAnswerKey;
                      const letter = String.fromCharCode(65 + optIdx);

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded border-2 ${isCorrectAnswer
                            ? 'bg-green-50 border-green-500'
                            : isStudentAnswer && !isCorrect
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <div className="flex items-start gap-3">
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
                          className={`p-3 rounded border-2 ${isCorrectAnswer
                            ? 'bg-green-50 border-green-500'
                            : isStudentAnswer && !isCorrect
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <div className="flex items-start gap-3">
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
              )}

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