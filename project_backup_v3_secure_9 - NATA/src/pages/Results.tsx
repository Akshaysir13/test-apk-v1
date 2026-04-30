// src/pages/Results.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Maximize, AlertTriangle } from 'lucide-react';
import { useTest } from '../contexts/TestContext';

// Screenshot Blocker (same as Test History page)
function ScreenshotBlocker({ onContinue }: { onContinue: () => void }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const webViewDetected = userAgent.includes('wv') || userAgent.includes('webview') ||
      (window as any).ReactNativeWebView !== undefined || (window as any).flutter_inappwebview !== undefined;
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    setIsWebView(webViewDetected);
    setIsMobile((isMobileUA || (isTouchDevice && isSmallScreen)) && !webViewDetected);
  }, []);

  if (isMobile || isWebView) return null;

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
        <p className="text-red-300 mb-6 text-base sm:text-lg font-semibold">⚠️ Taking screenshots is PROHIBITED</p>
        <p className="text-gray-300 mb-4 text-sm sm:text-base">This violation has been recorded and logged.</p>
        <p className="text-gray-400 mb-8 text-xs sm:text-sm">
          Continued attempts may result in immediate test termination and account suspension.
        </p>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onContinue(); }}
          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 mx-auto cursor-pointer w-full sm:w-auto"
        >
          <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
          Continue
        </button>
        <p className="text-gray-500 mt-8 text-xs border-t border-gray-700 pt-4">All attempts are monitored and logged.</p>
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const { selectedTest: currentTest, answers, questions } = useTest();
  const [showBlocker, setShowBlocker] = useState(false);

  // Screenshot blocking (same as Test History page)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    const handleVisibilityChange = () => {
      if (document.hidden) setShowBlocker(true);
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

  const handleContinue = () => {
    setShowBlocker(false);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  if (!currentTest) {
    navigate('/dashboard');
    return null;
  }

  if (showBlocker) {
    return <ScreenshotBlocker onContinue={handleContinue} />;
  }

  // Calculate score
  const calculateDetailedScore = () => {
    let correct = 0;
    let incorrect = 0;
    let totalMarks = 0;

    questions.forEach((q: any) => {
      const userAnswer = answers[q.id];
      // Check if answered (not undefined and not empty string)
      if (userAnswer === undefined || userAnswer === "") return;

      if (q.type === 'numeric') {
        // Numeric questions: exact string match, no negative marks
        if (String(userAnswer) === String(q.correctOption)) {
          correct++;
          totalMarks += 4;
        } else {
          incorrect++;
          // No negative marks
        }
      } else if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
        // Drawing: Max 50 marks. 
        // For now, we do not award auto-marks for drawing.
        // It counts as "attempted".
      } else {
        // MCQ questions: +4 / -1
        if (userAnswer === q.correctIndex) {
          correct++;
          totalMarks += 4;
        } else {
          incorrect++;
          totalMarks -= 1;
        }
      }
    });

    return { correct, incorrect, totalMarks };
  };

  const { correct, incorrect, totalMarks: marksObtained } = calculateDetailedScore();
  const questionsList = questions || [];
  const totalQuestionsCount = questionsList.length;

  // Calculate Max Potential Marks
  const maxPotentialMarks = questionsList.reduce((acc: number, q: any) => {
    if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
      return acc + 50;
    }
    return acc + 4;
  }, 0);
  const percentageScore = maxPotentialMarks > 0 ? Math.round((marksObtained / maxPotentialMarks) * 100) : 0;

  const grade = percentageScore >= 90 ? 'A+' : percentageScore >= 80 ? 'A' : percentageScore >= 70 ? 'B' : percentageScore >= 60 ? 'C' : 'D';

  // Section-wise statistics: Attempted, Skipped, Incorrect
  const getSectionStats = () => {
    const sectionsToUse = currentTest?.sections && currentTest.sections.length > 0
      ? currentTest.sections
      : [{ id: 'overall', name: 'Overall', questionIndices: questionsList.map((_, i) => i) }];

    const sectionStats = sectionsToUse.map((section) => {
      let attempted = 0;
      let skipped = 0;
      let incorrect = 0;

      section.questionIndices.forEach((idx: number) => {
        const q = questionsList[idx];
        if (!q) return;
        const userAnswer = answers[q.id];
        const isAttempted = userAnswer !== undefined && userAnswer !== "";

        if (isAttempted) {
          attempted++;
          let isCorrect = false;
          if (q.type === 'numeric') {
            isCorrect = String(userAnswer) === String(q.correctOption);
          } else if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
            isCorrect = false; // Manual evaluation - counts as attempted
          } else {
            isCorrect = userAnswer === (q as any).correctIndex;
          }
          if (!isCorrect) incorrect++;
        } else {
          skipped++;
        }
      });

      return { name: section.name, attempted, skipped, incorrect, total: section.questionIndices.length };
    });

    const totals = sectionStats.reduce(
      (acc, s) => ({
        attempted: acc.attempted + s.attempted,
        skipped: acc.skipped + s.skipped,
        incorrect: acc.incorrect + s.incorrect,
        total: acc.total + s.total,
      }),
      { attempted: 0, skipped: 0, incorrect: 0, total: 0 }
    );

    return { sectionStats, totals };
  };

  const { sectionStats, totals } = getSectionStats();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Test Completed! 🎉</h1>
            <p className="text-lg opacity-90">{currentTest.name}</p>
          </div>

          {/* Score Section */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-8 mb-4">
                <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {marksObtained}
                </p>
                <p className="text-sm text-gray-500 font-medium">Total Marks</p>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">Grade: {grade}</p>
              <p className="text-gray-600">
                Score: {percentageScore}%
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{correct}</p>
                <p className="text-sm text-gray-600 mt-1">Correct</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-red-600">
                  {incorrect}
                </p>
                <p className="text-sm text-gray-600 mt-1">Incorrect</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">{totalQuestionsCount}</p>
                <p className="text-sm text-gray-600 mt-1">Total</p>
              </div>
            </div>

            {/* Section-wise Statistics */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Section-wise Statistics</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Section</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Attempted</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Skipped</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Incorrect</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionStats.map((s) => (
                      <tr key={s.name} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium text-gray-800">{s.name}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-blue-600">{s.attempted}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-gray-600">{s.skipped}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-red-600">{s.incorrect}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-gray-700">{s.total}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50 border-t-2 border-blue-200 font-bold">
                      <td className="py-3 px-4 text-gray-800">Overall Summary</td>
                      <td className="py-3 px-4 text-center text-blue-700">{totals.attempted}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{totals.skipped}</td>
                      <td className="py-3 px-4 text-center text-red-700">{totals.incorrect}</td>
                      <td className="py-3 px-4 text-center text-gray-800">{totals.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`p-6 rounded-lg mb-8 ${percentageScore >= 80
              ? 'bg-green-50 border-2 border-green-200'
              : percentageScore >= 60
                ? 'bg-yellow-50 border-2 border-yellow-200'
                : 'bg-red-50 border-2 border-red-200'
              }`}>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {percentageScore >= 80
                  ? '🌟 Excellent Performance!'
                  : percentageScore >= 60
                    ? '👍 Good Effort!'
                    : '💪 Keep Practicing!'}
              </p>
              <p className="text-gray-600">
                {percentageScore >= 80
                  ? 'You have shown great understanding of the concepts. Keep up the excellent work!'
                  : percentageScore >= 60
                    ? 'You are on the right track. Review the incorrect answers and keep practicing.'
                    : 'Don\'t be discouraged! Every test is a learning opportunity. Review the solutions and try again.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>

        {/* Question-wise Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Question-wise Review</h2>
          {questions.map((question: any, index: number) => {
            const studentAnswer = answers[question.id];
            const isUnattempted = studentAnswer === undefined || studentAnswer === "";
            let isCorrect = false;

            if (question.type === 'numeric') {
              isCorrect = String(studentAnswer) === String(question.correctOption);
            } else if (question.type === 'drawing' || question.correctOption === 'manual_evaluation') {
              isCorrect = false;
            } else {
              isCorrect = studentAnswer === question.correctIndex;
            }

            return (
              <div
                key={question.id}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${isUnattempted
                  ? 'border-gray-400'
                  : isCorrect
                    ? 'border-green-500'
                    : 'border-red-500'
                  }`}
              >
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-gray-700">Q{index + 1}.</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${isUnattempted
                        ? 'bg-gray-100 text-gray-700'
                        : isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {isUnattempted ? 'Not Attempted' : isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {question.subject || 'General'}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-gray-800 mb-6 text-lg font-medium leading-relaxed">
                  {question.question}
                </p>

                {/* Options */}
                {/* Options / Answer Display */}
                {question.type === 'numeric' ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="mb-2"><span className="font-bold text-gray-700">Your Answer:</span> <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{isUnattempted ? "N/A" : studentAnswer}</span></p>
                    <p><span className="font-bold text-gray-700">Correct Answer:</span> <span className="text-green-600 font-bold">{question.correctOption}</span></p>
                  </div>
                ) : (question.type === 'drawing' || question.correctOption === 'manual_evaluation') ? (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">This question requires manual evaluation.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {question.shuffledOptions.map((opt: any, optIdx: number) => {
                      const isStudentChoice = studentAnswer === optIdx;
                      const isCorrectChoice = question.correctIndex === optIdx;
                      const letter = String.fromCharCode(65 + optIdx);

                      return (
                        <div
                          key={optIdx}
                          className={`p-4 rounded-lg border-2 transition-all ${isCorrectChoice
                            ? 'bg-green-50 border-green-500 shadow-sm'
                            : isStudentChoice && !isCorrect
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-1 text-gray-700">{opt.text}</span>
                            <div className="flex flex-col items-end shrink-0 gap-1">
                              {isCorrectChoice && (
                                <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {isStudentChoice && !isCorrect && (
                                <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  ✗ Your Answer
                                </span>
                              )}
                              {isStudentChoice && isCorrect && (
                                <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  ✓ Your Answer (Correct)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Solution */}
                {question.solution && (
                  <div className="mt-6">
                    <details className="group">
                      <summary className="cursor-pointer font-bold text-blue-600 flex items-center gap-2 hover:text-blue-700">
                        <span className="bg-blue-100 p-1 rounded group-open:rotate-180 transition-transform">
                          💡
                        </span>
                        View Explanation
                      </summary>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-gray-700 border border-blue-100 italic">
                        {question.solution}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📚</span> Study Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Analyze incorrect answers carefully to understand the root cause of the error.",
              "Strengthen weak topics by solving similar practice problems from standard sources.",
              "Work on time management by setting stricter limits for future mock attempts.",
              "Maintain a 'Mistake Book' for complex questions encountered during this test."
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-blue-500 font-bold">•</span>
                <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}