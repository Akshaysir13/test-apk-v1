import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, RotateCcw, User, LogOut, AlertTriangle, Shield, BookOpen, Menu, Trophy, BarChart3, PlayCircle, RefreshCw, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';
import ScreenshotBlocker from '../components/ScreenshotBlocker';
import MobileQuestionPanel from '../components/MobileQuestionPanel';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Test() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const {
    tests,
    selectedTest,
    testStarted,
    questions,
    currentQuestion,
    answers,
    markedForReview,
    visitedQuestions,
    timeLeft,
    testCompleted,
    showResults,
    violations,
    tabSwitchCount,
    isFullscreen,
    screenshotBlocked,
    selectTest,
    startTest,
    resumeTest,
    clearSavedState,
    handleAnswer,
    clearResponse,
    handleSaveAndNext,
    handleMarkAndNext,
    handleSubmit,
    restartTest,
    handleQuestionNavigation,
    addViolation,
    setTabSwitchCount,
    setFullscreenExitCount,
    setIsFullscreen,
    setTestCompleted,
    setShowResults,
    setTimeLeft,
    setScreenshotBlocked,
    getStatusCounts,
    calculateScore,
    getStudentAttempts,
    saveTestAttempt,
    checkSavedProgress, // Added
  } = useTest();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [numericInput, setNumericInput] = useState('');

  const activeQuestion = questions[currentQuestion];
  const activeSection = selectedTest?.sections?.find(s => s.questionIndices.includes(currentQuestion));

  const handleNumericInput = (val: string) => {
    if (val === 'clear') {
      setNumericInput('');
      handleAnswer(activeQuestion.id, -1); // Clear answer
      return;
    }

    const newVal = numericInput + val;
    // Basic validation: only one decimal point, max 10 chars
    if ((val === '.' && numericInput.includes('.')) || newVal.length > 10) return;

    setNumericInput(newVal);
    // Store numeric answer as string in answers
    handleAnswer(activeQuestion.id, newVal as any);
  };

  useEffect(() => {
    // Reset numeric input when moving to a new question
    if (activeQuestion?.type === 'numeric') {
      setNumericInput(answers[currentQuestion]?.toString() || '');
    }
  }, [currentQuestion]);

  const studentAttempts = currentUser ? getStudentAttempts(currentUser.email) : [];
  useEffect(() => {
    const saveResults = async () => {
      if (showResults && !resultSaved && currentUser && selectedTest) {
        setResultSaved(true);
        saveTestAttempt(currentUser.email);

        const scoreData = calculateScore();
        const totalMarks = scoreData.totalMarks;
        const totalQuestions = questions.length;
        const maxMarks = totalQuestions * 4;
        const percentageValue = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "0.00";

        try {
          const { error } = await supabase.from('test_results').insert({
            user_email: currentUser.email,
            test_name: selectedTest.name,
            score: totalMarks,
            total_questions: totalQuestions,
            percentage: parseFloat(percentageValue)
            // time_taken removed as it's not in the current schema
          });

          if (error) {
            console.error('Error saving result to Supabase:', error);
            // Optional: You could show a UI toast here if you have a toast system
          } else {
            console.log('✅ Result saved to leaderboard');
          }
        } catch (err) {
          console.error('Unexpected error during result save:', err);
        }
      }
    }

    saveResults();
  }, [showResults, currentUser, selectedTest, questions.length, timeLeft, resultSaved, saveTestAttempt, calculateScore]);
  useEffect(() => {
    if (!showResults) {
      setResultSaved(false);
    }
  }, [showResults]);

  const showViolationWarning = (message: string) => {
    addViolation(message);
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  useEffect(() => {
    if (!testStarted) return;
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showViolationWarning('Right-click detected');
    };
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, [testStarted]);

  useEffect(() => {
    if (!testStarted) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let lastVisibilityTime = Date.now();
    let visibilityChangeCount = 0;
    let touchStartTime = 0;
    let lastResizeTime = 0;

    const preventShortcuts = (e: KeyboardEvent) => {
      const screenshotKeys = [
        () => e.key === 'PrintScreen',
        () => e.ctrlKey && e.shiftKey && e.key === 'S',
        () => e.shiftKey && e.key === 'PrintScreen',
        () => e.altKey && e.key === 'PrintScreen',
        () => (e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key),
        () => e.ctrlKey && e.key === 'PrintScreen',
      ];

      const devtoolsKeys = [
        () => e.key === 'F12',
        () => e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'),
        () => e.ctrlKey && e.key === 'K',
        () => e.metaKey && e.altKey && e.key === 'I',
        () => e.metaKey && e.altKey && e.key === 'U',
      ];

      const systemBlockKeys = [
        () => (e.ctrlKey || e.metaKey) && e.key === 'p',
        () => (e.ctrlKey || e.metaKey) && e.key === 's',
        () => (e.ctrlKey || e.metaKey) && e.key === 'a',
        () => (e.ctrlKey || e.metaKey) && e.key === 'c',
        () => (e.ctrlKey || e.metaKey) && e.key === 'x',
      ];

      if (screenshotKeys.some(check => check())) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        showViolationWarning('Screenshot attempt detected - VIOLATION RECORDED');
        setScreenshotBlocked(true);
        return false;
      }

      if (devtoolsKeys.some(check => check())) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        showViolationWarning('DevTools access attempt - VIOLATION RECORDED');
        return false;
      }

      if (systemBlockKeys.some(check => check())) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const handleVisibilityChange = () => {
      const now = Date.now();
      const timeSinceLastChange = now - lastVisibilityTime;

      if (document.hidden || document.visibilityState === 'hidden') {
        if (isMobile) {
          showViolationWarning('Mobile screenshot detected - VIOLATION RECORDED');
          setScreenshotBlocked(true);
        } else {
          showViolationWarning('Screenshot detected - App focus lost');
        }

        if (timeSinceLastChange < 3000) {
          visibilityChangeCount++;
          if (visibilityChangeCount >= 2) {
            setScreenshotBlocked(true);
          }
        } else {
          visibilityChangeCount = 1;
        }
      }
      lastVisibilityTime = now;
    };

    const handleWindowBlur = () => {
      if (isMobile) {
        showViolationWarning('Mobile screenshot detected - Screen capture attempt');
        setScreenshotBlocked(true);
      }
    };

    const handleTouchStart = () => {
      touchStartTime = Date.now();
    };

    const handleTouchCancel = () => {
      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration < 200 && isMobile) {
        showViolationWarning('Mobile screenshot detected - Touch interrupted');
        setScreenshotBlocked(true);
      }
    };

    const handleResize = () => {
      const now = Date.now();
      if (isMobile && now - lastResizeTime < 500) {
        showViolationWarning('Mobile screenshot detected - Screen resize');
        setScreenshotBlocked(true);
      }
      lastResizeTime = now;
    };

    const handlePageHide = () => {
      if (isMobile) {
        showViolationWarning('Mobile screenshot detected - Page hidden');
        setScreenshotBlocked(true);
      }
    };

    const handleWindowFocus = () => {
      if (isMobile && document.visibilityState === 'visible') {
        const now = Date.now();
        if (now - lastVisibilityTime < 2000) {
          showViolationWarning('Mobile screenshot detected - Quick focus change');
          setScreenshotBlocked(true);
        }
      }
    };

    document.addEventListener('keydown', preventShortcuts, true);
    document.addEventListener('keyup', preventShortcuts, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('pagehide', handlePageHide);

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchcancel', handleTouchCancel);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('keydown', preventShortcuts, true);
      document.removeEventListener('keyup', preventShortcuts, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('pagehide', handlePageHide);

      if (isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchcancel', handleTouchCancel);
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [testStarted]);

  useEffect(() => {
    if (!testStarted || testCompleted) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        showViolationWarning('Tab switched or window minimized');
      }
    };
    const handleBlur = () => {
      setTabSwitchCount(prev => prev + 1);
      showViolationWarning('Focus lost from test window');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [testStarted, testCompleted]);

  useEffect(() => {
    if (!testStarted || testCompleted) return;
    const enterFullscreen = () => {
      if (containerRef.current && !document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {
          showViolationWarning('Fullscreen denied by user');
          setFullscreenExitCount(prev => prev + 1);
        });
      }
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && testStarted && !testCompleted) {
        setFullscreenExitCount(prev => prev + 1);
        showViolationWarning('Exited fullscreen mode - Violation recorded');
        setScreenshotBlocked(true); // ✅ ADD THIS LINE - Shows violation screen
        if (!testCompleted) {
          setTimeout(enterFullscreen, 1000);
        }
      }
    };
    enterFullscreen();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [testStarted, testCompleted]);

  useEffect(() => {
    if (!testStarted) return;
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
      img {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [testStarted]);

  useEffect(() => {
    if (!testStarted) return;
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showViolationWarning('Copy/Cut attempt detected');
    };
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
    };
  }, [testStarted]);

  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTestCompleted(true);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted, timeLeft]);

  const handleLogout = () => {
    restartTest();
    logout();
    navigate('/login');
  };

  const handleEnterFullscreen = () => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen().then(() => {
        setScreenshotBlocked(false);
        setIsFullscreen(true);
      }).catch(() => {
        console.error('Failed to enter fullscreen');
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // If it's a Dheya test, we allow access without full authentication
    const isDheyaTest = selectedTest?.course === 'dheya';

    if (!isAuthenticated && !isDheyaTest) {
      navigate('/login');
    } else if (currentUser?.role === 'admin' && !testStarted) {
      navigate('/admin');
    }
  }, [isAuthenticated, currentUser, testStarted, navigate, selectedTest]);

  if (!isAuthenticated && selectedTest?.course !== 'dheya') {
    return null;
  }

  if (currentUser?.role === 'admin' && !testStarted) {
    return null;
  }

  const handleResumeTest = () => {
    const success = resumeTest();
    if (!success) {
      clearSavedState();
    }
  };

  if (!testStarted && !selectedTest) {
    // Filter by user's enrolled courses FIRST
    // Special handling: 'free_tests' users should see 'dheya' tests
    const userCourseTests = tests.filter(test => {
      if (currentUser?.courses?.includes('free_tests') && test.course === 'dheya') {
        return true; // Free test users can access dheya tests
      }
      return currentUser?.courses?.includes(test.course);
    });

    // Then apply category filter
    const filteredTests = selectedCategory
      ? userCourseTests.filter(t => t.category === selectedCategory)
      : userCourseTests;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Shield className="text-blue-600" size={28} />
                <span className="text-xl font-bold text-gray-800">JEE B.Arch</span>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <Link to="/leaderboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                  <Trophy size={20} />
                  Leaderboard
                </Link>
                <Link to="/analytics" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                  <BarChart3 size={20} />
                  Analytics
                </Link>
                <span className="text-gray-600">{currentUser?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden pb-4 space-y-2">
                <Link to="/leaderboard" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Trophy size={20} />
                  Leaderboard
                </Link>
                <Link to="/analytics" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <BarChart3 size={20} />
                  Analytics
                </Link>
                <div className="px-4 py-2 text-gray-600">{currentUser?.email}</div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Welcome to JEE B.Arch Mock Tests</h1>
            <p className="text-gray-600">Select a category and test to begin your preparation</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {testCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`p-4 rounded-xl border-2 transition transform hover:scale-105 ${selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : `${category.color} hover:shadow-md`
                  }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-semibold text-gray-800 text-sm">{category.name}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Available Tests</h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <History size={18} />
              {showHistory ? 'Hide History' : 'My Test History'}
            </button>
          </div>

          {showHistory && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <History className="text-purple-600" size={24} />
                Your Test History
              </h3>
              {studentAttempts.length === 0 ? (
                <div className="text-center py-8">
                  <History className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No tests attempted yet. Start a test to see your history here!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Test Name</th>
                        <th className="text-center py-3 px-4 text-gray-600 font-semibold">Score</th>
                        <th className="text-center py-3 px-4 text-gray-600 font-semibold">Correct</th>
                        <th className="text-center py-3 px-4 text-gray-600 font-semibold">Wrong</th>
                        <th className="text-center py-3 px-4 text-gray-600 font-semibold">Time Taken</th>
                        <th className="text-center py-3 px-4 text-gray-600 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentAttempts.map(attempt => (
                        <tr key={attempt.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{attempt.testName}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-bold ${attempt.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {attempt.score} / {attempt.totalQuestions * 4}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-green-600 font-semibold">{attempt.correctAnswers}</td>
                          <td className="py-3 px-4 text-center text-red-600 font-semibold">{attempt.wrongAnswers}</td>
                          <td className="py-3 px-4 text-center text-gray-600">
                            {Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-500 text-sm">
                            {new Date(attempt.submittedAt).toLocaleDateString()} {new Date(attempt.submittedAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No tests available in this category</p>
              </div>
            ) : (
              filteredTests.map(test => (
                <div key={test.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-300 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{test.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{test.description}</p>
                    </div>
                    <BookOpen className="text-blue-600" size={24} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {test.duration / 60} min
                    </span>
                    <span>{test.questions.length} Questions</span>
                  </div>
                  <button
                    onClick={() => selectTest(test)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                  >
                    Start Test
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedTest && !testStarted) {
    const savedProgress = checkSavedProgress(selectedTest.id);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <BookOpen className="text-blue-600 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTest.name}</h2>
            <p className="text-gray-600">{selectedTest.description}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-blue-900 mb-4">Test Instructions:</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                This test contains {selectedTest.questions.length} questions
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                Duration: {selectedTest.duration / 60} minutes
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                Aptitude & Math MCQ: +4 for correct, -1 for incorrect
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">4.</span>
                Math Numeric: +4 for correct, 0 for incorrect (No negative marks)
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">5.</span>
                Drawing: 50 Marks each (Submit via WhatsApp after test)
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">6.</span>
                Fullscreen mode is required; violations are tracked
              </li>
            </ul>
          </div>

          {savedProgress ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="text-orange-500" size={24} />
                <div>
                  <h4 className="font-bold text-orange-800">Unfinished Attempt Found</h4>
                  <p className="text-sm text-orange-700">
                    You have saved progress from {new Date(savedProgress.savedAt).toLocaleString()}.
                    Time remaining: {Math.floor(savedProgress.timeLeft / 60)} min {savedProgress.timeLeft % 60} sec.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleResumeTest()}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <PlayCircle size={20} />
                  Resume Test
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to discard your saved progress and start fresh? This cannot be undone.")) {
                      clearSavedState(selectedTest.id);
                      startTest();
                    }
                  }}
                  className="flex-1 bg-white border-2 border-orange-200 text-orange-700 hover:bg-orange-50 font-bold py-3 rounded-lg transition"
                >
                  Discard & Start Fresh
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => restartTest()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition"
              >
                Back
              </button>
              <button
                onClick={() => startTest()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                I Agree - Start Test
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showResults) {
    const { correct, incorrect, unattempted, totalMarks, maxMarks } = calculateScore();
    const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Test Results</h1>
              <p className="text-gray-600">{selectedTest?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">{currentUser?.email}</span>
            </div>
          </div>

          {violations.length > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="text-red-600" size={24} />
                <h3 className="text-lg font-semibold text-red-900">Security Violations: {violations.length}</h3>
              </div>
              <div className="text-sm text-red-800 max-h-32 overflow-y-auto space-y-1">
                {violations.map((v, idx) => (
                  <div key={idx} className="py-1 border-b border-red-200 last:border-0">* {v}</div>
                ))}
              </div>
            </div>
          )}

          {tabSwitchCount > 0 && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-6">
              <p className="text-orange-800 font-semibold">
                Tab Switches / Focus Loss: {tabSwitchCount} times
              </p>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-8 mb-8 text-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">Your Score</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{correct}</div>
                <div className="text-sm mt-1">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{incorrect}</div>
                <div className="text-sm mt-1">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{unattempted}</div>
                <div className="text-sm mt-1">Unattempted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{questions.length}</div>
                <div className="text-sm mt-1">Total</div>
              </div>
            </div>
            <div className="border-t-2 border-white/30 pt-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{totalMarks} / {maxMarks}</div>
                <div className="text-xl">Marks Obtained ({percentage}%)</div>
                <div className="text-sm mt-3 opacity-90">
                  Marking: +4 correct, -1 incorrect
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isAttempted = userAnswer !== undefined && userAnswer !== "";

              let isCorrect = false;
              if (q.type === 'numeric') {
                isCorrect = String(userAnswer) === String(q.correctOption);
              } else if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
                isCorrect = false; // Manual evaluation
              } else {
                isCorrect = userAnswer === q.correctIndex;
              }

              return (
                <div key={q.id} className={`border-2 rounded-lg p-4 ${isCorrect ? 'border-green-300 bg-green-50' : isAttempted ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 flex-1">
                      Q{idx + 1}. {q.question}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="text-green-600" size={24} />
                          <span className="text-green-600 font-bold text-sm">+4</span>
                        </>
                      ) : isAttempted ? (
                        q.type === 'numeric' ? (
                          <>
                            <XCircle className="text-red-600" size={24} />
                            <span className="text-red-600 font-bold text-sm">0</span>
                          </>
                        ) : (q.type === 'drawing' || q.correctOption === 'manual_evaluation') ? (
                          <span className="text-blue-600 font-bold text-sm">Manual Review</span>
                        ) : (
                          <>
                            <XCircle className="text-red-600" size={24} />
                            <span className="text-red-600 font-bold text-sm">-1</span>
                          </>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm font-semibold">Not Answered (0)</span>
                      )}
                    </div>
                  </div>
                  {q.image && (
                    <div className="mb-3">
                      <img src={q.image} alt="Question" className="max-w-xs h-auto border border-gray-300 rounded" />
                    </div>
                  )}
                  <div className="ml-4 space-y-1">
                    {q.type === 'numeric' ? (
                      <>
                        <p className="text-gray-700 text-sm">Your answer: <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isAttempted ? userAnswer : 'N/A'}</span></p>
                        <p className="text-green-600 text-sm font-semibold">Correct: <span className="font-semibold">{q.correctOption}</span></p>
                      </>
                    ) : (q.type === 'drawing' || q.correctOption === 'manual_evaluation') ? (
                      <p className="text-blue-600 text-sm font-semibold">Uploaded for Manual Evaluation</p>
                    ) : (
                      <>
                        {isAttempted && !isCorrect && (
                          <p className="text-red-600 text-sm">Your answer: <span className="font-semibold">{String.fromCharCode(65 + (userAnswer as number))} - {q.shuffledOptions[userAnswer as number]?.text}</span></p>
                        )}
                        <p className="text-green-600 text-sm font-semibold">Correct: <span className="font-semibold">{String.fromCharCode(65 + q.correctIndex)} - {q.shuffledOptions[q.correctIndex]?.text}</span></p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center flex gap-4 justify-center">
            <button
              onClick={() => {
                restartTest();
                // Redirect free/dheya tests to free test dashboard
                if (selectedTest?.course === 'dheya' || currentUser?.courses?.includes('free_tests')) {
                  navigate('/free-tests');
                  return;
                }
                // Navigate to user's specific course dashboard
                if (currentUser?.courses?.includes('advance_2026')) {
                  navigate('/dashboard/advance-2026');
                } else if (currentUser?.courses?.includes('foundation')) {
                  navigate('/dashboard/foundation');
                } else if (currentUser?.courses?.includes('rank_booster')) {
                  navigate('/dashboard/rank-booster');
                } else if (currentUser?.courses?.includes('dheya')) {
                  navigate('/dashboard/dheya');
                } else {
                  navigate('/dashboard'); // Fallback
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition"
            >
              <RotateCcw size={20} />
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || testCompleted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading questions...</div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  if (!q) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Invalid question index.</div>;
  }

  const statusCounts = getStatusCounts();

  return (
    <div ref={containerRef} className="min-h-screen bg-white relative">
      {screenshotBlocked && (
        <ScreenshotBlocker onEnterFullscreen={handleEnterFullscreen} />
      )}

      <MobileQuestionPanel />

      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-pulse">
          <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <AlertTriangle size={24} />
            <span className="font-bold">{warningMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-full px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {selectedTest?.sections?.map((section) => {
              const isActive = activeSection?.id === section.id;
              const isVisited = section.questionIndices.some(idx => visitedQuestions.has(idx));

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    const firstIdx = section.questionIndices[0];
                    handleQuestionNavigation(firstIdx);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap border-2 ${isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                >
                  {section.name}
                  {isVisited && !isActive && <span className="ml-2 w-2 h-2 bg-blue-400 rounded-full inline-block"></span>}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-4">
              {!isFullscreen && (
                <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Not in fullscreen
                </div>
              )}
              <div className="text-lg font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-70px)]">
        <div className="flex-1 overflow-auto">
          <div className="bg-blue-500 text-white px-6 py-3 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Question No. {currentQuestion + 1}</span>
              {activeSection && (
                <span className="bg-blue-400/50 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold border border-blue-300">
                  {activeSection.name}
                </span>
              )}
            </div>
            {activeQuestion.type === 'match-pair' && (
              <span className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full font-bold">Match the Pair</span>
            )}
          </div>

          <div className="p-6 pb-32 md:pb-24">
            <h3 className="text-lg font-medium text-gray-800 mb-6">{q.question}</h3>

            {q.type === 'match-pair' && q.columnAItems && (
              <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg border-2 border-blue-300 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-blue-900 mb-3 text-base flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">A</span>
                      Column A:
                    </h4>
                    <div className="space-y-2">
                      {q.columnAItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-white p-3 rounded shadow-sm border-l-4 border-blue-500">
                          <span className="font-bold text-blue-600 text-lg min-w-[24px]">{idx + 1}.</span>
                          <span className="text-gray-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {q.columnBItems && (
                    <div>
                      <h4 className="font-bold text-purple-900 mb-3 text-base flex items-center gap-2">
                        <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">B</span>
                        Column B:
                      </h4>
                      <div className="space-y-2">
                        {q.columnBItems.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start bg-white p-3 rounded shadow-sm border-l-4 border-purple-500">
                            <span className="text-gray-800">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {q.image && (
              <div className="mb-6 flex justify-center relative">
                <img
                  src={q.image}
                  alt="Question visual"
                  className="max-w-full h-auto max-h-96 object-contain border-2 border-gray-300 rounded-lg shadow-md"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </div>
            )}

            <div className="space-y-3">
              {activeQuestion.type === 'numeric' ? (
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4 text-center">
                    <input
                      type="text"
                      value={numericInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^[0-9.]*$/.test(val) && val.length <= 10 && (val.match(/\./g) || []).length <= 1) {
                          setNumericInput(val);
                          handleAnswer(activeQuestion.id, val);
                        }
                      }}
                      placeholder="ENTER VALUE"
                      className="text-2xl font-mono font-bold tracking-widest text-blue-600 bg-transparent text-center w-full focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'clear'].map((key) => (
                      <button
                        key={key}
                        onClick={() => handleNumericInput(key.toString())}
                        className={`p-4 text-xl font-bold rounded-lg transition-colors ${key === 'clear'
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {key === 'clear' ? 'C' : key}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Note: Numeric questions have no negative marking.
                  </p>
                </div>
              ) : activeSection?.type === 'drawing' ? (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-8 text-center">
                  <h3 className="text-xl font-bold text-orange-800 mb-4 text-center">Drawing Task</h3>
                  <p className="text-gray-700 mb-6 text-center">
                    Please complete this drawing on your physical sheet.
                    Once the test is over, share a clear photo of your work on WhatsApp.
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="https://wa.me/YOUR_NUMBER"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition"
                    >
                      Share on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                activeQuestion.shuffledOptions.map((option, idx) => (
                  <label key={idx} className="flex items-start cursor-pointer group">
                    <input
                      type="radio"
                      name={`question-${activeQuestion.id}`}
                      checked={answers[activeQuestion.id] === idx}
                      onChange={() => handleAnswer(activeQuestion.id, idx)}
                      className="mt-1 w-4 h-4"
                    />
                    <span className="ml-3 text-base text-gray-700">
                      <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option.text}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 md:right-80 bg-white border-t-2 border-gray-200 p-4 z-50">
            <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-center md:justify-start">
              <button
                type="button"
                onClick={handleMarkAndNext}
                className="px-3 md:px-6 py-2 bg-white border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-50 font-medium cursor-pointer text-sm md:text-base"
              >
                Mark & Next
              </button>
              <button
                type="button"
                onClick={clearResponse}
                className="px-3 md:px-6 py-2 bg-white border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-50 font-medium cursor-pointer text-sm md:text-base"
              >
                Clear
              </button>
              <div className="flex-1 hidden md:block"></div>
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-4 md:px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium cursor-pointer text-sm md:text-base"
              >
                Save & Next
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 md:px-8 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 font-medium cursor-pointer text-sm md:text-base"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-80 bg-gray-50 border-l-2 border-gray-200 overflow-auto">
          <div className="bg-white border-b-2 border-gray-200 p-4 flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
              <User size={32} className="text-gray-600" />
            </div>
            <div>
              <div className="text-blue-600 font-medium">Profile</div>
              <div className="text-xs text-gray-600 truncate max-w-[180px]" title={currentUser?.email}>{currentUser?.email}</div>
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
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {statusCounts.answered}
                </div>
                <span className="text-xs font-medium text-gray-700">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {statusCounts.visitedNotAnswered}
                </div>
                <span className="text-xs font-medium text-gray-700">Not Answered</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {statusCounts.notVisited}
                </div>
                <span className="text-xs font-medium text-gray-700">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {statusCounts.markedForReviewCount}
                </div>
                <span className="text-xs font-medium text-gray-700">Review</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-green-500">
                {statusCounts.answeredMarked}
              </div>
              <span className="text-xs text-gray-700">Answered & Marked</span>
            </div>
          </div>

          <div className="p-4">
            <div className="bg-blue-600 text-white text-center py-2 mb-3 font-semibold text-sm">
              {selectedTest?.name}
            </div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Choose a Question</h4>
            <div className="grid grid-cols-4 gap-2">
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
                    onClick={() => handleQuestionNavigation(idx)}
                    className={`w-12 h-12 rounded-lg font-bold text-sm ${bgColor} ${borderClass} hover:opacity-80 transition`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
