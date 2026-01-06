import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Question, ShuffledQuestion, Test, TestCategory, TestAttempt } from "../types";

// ==========================================
// 📦 IMPORT ALL TESTS FROM DATA FILES
// ==========================================
import { foundationTests } from "../data/tests/foundation-tests";
import { rankBoosterTests } from "../data/tests/rank-booster-tests";
import { dheyaTests } from "../data/tests/dheya-tests";
import { advance2026Tests } from "../data/tests/advance-2026-tests";

const TEST_ATTEMPTS_KEY = 'jee_mock_test_attempts';
const DEFAULT_TEST_DURATION = 3600;

export const testCategories: TestCategory[] = [
  {
    id: "white",
    name: "White Mock Tests",
    icon: "⚪",
    color: "bg-white border-gray-300",
    description: "Comprehensive mock tests",
  },
  {
    id: "blue",
    name: "Blue Mock Tests",
    icon: "🔵",
    color: "bg-blue-50 border-blue-300",
    description: "Advanced practice tests",
  },
  {
    id: "grey",
    name: "Grey Mock Tests",
    icon: "⚫",
    color: "bg-gray-50 border-gray-300",
    description: "Standard difficulty tests",
  },
  {
    id: "pyq",
    name: "PYQ (2005-2025)",
    icon: "📚",
    color: "bg-yellow-50 border-yellow-300",
    description: "Previous Year Questions",
  },
  {
    id: "latest",
    name: "Latest Pattern",
    icon: "🆕",
    color: "bg-green-50 border-green-300",
    description: "New test pattern",
  },
];

// ==========================================
// 🎯 COMBINE ALL TESTS FROM IMPORTED FILES
// ==========================================
import { exampleSectionedTests } from "../data/tests/example-sections";

const initialTests: Test[] = [
  ...foundationTests,
  ...rankBoosterTests,
  ...dheyaTests,
  ...advance2026Tests,
  ...exampleSectionedTests,
];

export function shuffleOptions(question: Question): ShuffledQuestion {
  const options = [
    { text: question.optionA, originalKey: "a" },
    { text: question.optionB, originalKey: "b" },
    { text: question.optionC, originalKey: "c" },
    { text: question.optionD, originalKey: "d" },
  ];
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const correctIndex = shuffled.findIndex(
    (opt) => opt.originalKey === question.correctOption,
  );
  return {
    ...question,
    shuffledOptions: shuffled,
    correctIndex,
  };
}

interface SavedTestState {
  testId: string;
  userEmail: string;
  answers: Record<number, number | string>;
  markedForReview: Record<number, boolean>;
  visitedQuestions: number[];
  currentQuestion: number;
  timeLeft: number;
  shuffledQuestions: ShuffledQuestion[];
  violations: string[];
  tabSwitchCount: number;
  savedAt: number;
}

interface TestContextType {
  tests: Test[];
  selectedTest: Test | null;
  testStarted: boolean;
  questions: ShuffledQuestion[];
  currentQuestion: number;
  answers: Record<number, number | string>;
  markedForReview: Record<number, boolean>;
  visitedQuestions: Set<number>;
  timeLeft: number;
  testCompleted: boolean;
  showResults: boolean;
  violations: string[];
  tabSwitchCount: number;
  fullscreenExitCount: number;
  isFullscreen: boolean;
  screenshotBlocked: boolean;
  checkSavedProgress: (testId: string) => SavedTestState | null;
  setTests: React.Dispatch<React.SetStateAction<Test[]>>;
  setSelectedTest: React.Dispatch<React.SetStateAction<Test | null>>;
  selectTest: (test: Test) => void;
  startTest: () => boolean;
  resumeTest: (testId?: string) => boolean;
  clearSavedState: (testId?: string) => void;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  handleAnswer: (questionId: number, answerIndex: number | string) => void;
  clearResponse: () => void;
  handleSaveAndNext: () => void;
  handleMarkAndNext: () => void;
  handleSubmit: () => void;
  restartTest: () => void;
  handleQuestionNavigation: (idx: number) => void;
  addViolation: (message: string) => void;
  setTabSwitchCount: React.Dispatch<React.SetStateAction<number>>;
  setFullscreenExitCount: React.Dispatch<React.SetStateAction<number>>;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  setTestCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setScreenshotBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  getStatusCounts: () => {
    answered: number;
    visitedNotAnswered: number;
    notVisited: number;
    markedForReviewCount: number;
    answeredMarked: number;
  };
  calculateScore: () => {
    correct: number;
    incorrect: number;
    unattempted: number;
    totalMarks: number;
    maxMarks: number;
  };
  addTest: (
    name: string,
    description: string,
    duration: number,
  ) => { success: boolean; message: string };
  deleteTest: (testId: string) => void;
  testAttempts: TestAttempt[];
  getStudentAttempts: (studentEmail: string) => TestAttempt[];
  getAllAttempts: () => TestAttempt[];
  saveTestAttempt: (studentEmail: string) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [markedForReview, setMarkedForReview] =
    useState<Record<number, boolean>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(
    new Set([0]),
  );
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TEST_DURATION);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshotBlocked, setScreenshotBlocked] = useState(false);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEST_ATTEMPTS_KEY);
      if (saved) {
        setTestAttempts(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading test attempts:', e);
    }
  }, []);

  const saveTestAttempt = useCallback((studentEmail: string) => {
    if (!selectedTest || questions.length === 0) return;

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let score = 0;

    // Store student answers for review
    const answerMapping: Record<number, number | string> = {};

    questions.forEach((q) => {
      const userAnswer = answers[q.id];

      if (userAnswer !== undefined && userAnswer !== "") {
        answerMapping[q.id] = userAnswer;

        if (q.type === 'numeric') {
          // Numeric logic: String match, no negative marking
          if (String(userAnswer) === String(q.correctOption)) {
            correct++;
            score += 4;
          } else {
            incorrect++;
            // No negative marks for numeric
          }
        } else if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
          // Drawing logic: 
          // For now, we count it as "attempted" but award 0 marks automatically.
          // Marks need manual evaluation. 
          // We do NOT penalize.
        } else {
          // MCQ logic: +4 for correct, -1 for incorrect
          if (userAnswer === q.correctIndex) {
            correct++;
            score += 4;
          } else {
            incorrect++;
            score -= 1;
          }
        }
      } else {
        unattempted++;
      }
    });

    const timeTaken = selectedTest.duration - timeLeft;

    const attempt: TestAttempt = {
      id: 'attempt_' + Date.now(),
      studentEmail,
      testId: selectedTest.id,
      testName: selectedTest.name,
      score: score,
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: incorrect,
      unattempted,
      timeTaken,
      totalTime: selectedTest.duration,
      violations,
      tabSwitchCount,
      submittedAt: Date.now(),
      answers: answerMapping, // Map of question ID to answer index/string
      questions: questions // Store the exact shuffled questions
    };

    setTestAttempts(prev => {
      const updated = [...prev, attempt];
      try {
        localStorage.setItem(TEST_ATTEMPTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving test attempt:', e);
      }
      return updated;
    });
  }, [selectedTest, questions, answers, timeLeft, violations, tabSwitchCount]);

  const getStudentAttempts = useCallback((studentEmail: string): TestAttempt[] => {
    return testAttempts.filter(a => a.studentEmail === studentEmail).sort((a, b) => b.submittedAt - a.submittedAt);
  }, [testAttempts]);

  const getAllAttempts = useCallback((): TestAttempt[] => {
    return [...testAttempts].sort((a, b) => b.submittedAt - a.submittedAt);
  }, [testAttempts]);

  const TEST_PROGRESS_PREFIX = 'jee_mock_test_progress_';

  const checkSavedProgress = useCallback((testId: string): SavedTestState | null => {
    try {
      const saved = localStorage.getItem(`${TEST_PROGRESS_PREFIX}${testId}`);
      if (saved) {
        return JSON.parse(saved) as SavedTestState;
      }
    } catch (e) {
      console.error('Error checking saved progress:', e);
    }
    return null;
  }, []);

  const saveTestState = useCallback(() => {
    if (testStarted && !testCompleted && selectedTest && questions.length > 0) {
      const stateToSave: SavedTestState = {
        testId: selectedTest.id,
        userEmail: '',
        answers,
        markedForReview,
        visitedQuestions: Array.from(visitedQuestions),
        currentQuestion,
        timeLeft,
        shuffledQuestions: questions,
        violations,
        tabSwitchCount,
        savedAt: Date.now()
      };
      try {
        localStorage.setItem(`${TEST_PROGRESS_PREFIX}${selectedTest.id}`, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Error saving test state:', e);
      }
    }
  }, [testStarted, testCompleted, selectedTest, questions, answers, markedForReview, visitedQuestions, currentQuestion, timeLeft, violations, tabSwitchCount]);

  const clearSavedState = useCallback((testId?: string) => {
    try {
      const id = testId || selectedTest?.id;
      if (id) {
        localStorage.removeItem(`${TEST_PROGRESS_PREFIX}${id}`);
      }
    } catch (e) {
      console.error('Error clearing saved state:', e);
    }
  }, [selectedTest]);

  // Auto-save effect
  useEffect(() => {
    if (testStarted && !testCompleted) {
      const interval = setInterval(saveTestState, 5000);
      return () => clearInterval(interval);
    }
  }, [testStarted, testCompleted, saveTestState]);

  // Save on specific changes
  useEffect(() => {
    if (testStarted && !testCompleted) {
      saveTestState();
    }
  }, [answers, markedForReview, currentQuestion, saveTestState, testStarted, testCompleted]);

  // Save on unload/visibility change
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (testStarted && !testCompleted) {
        saveTestState();
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden && testStarted && !testCompleted) {
        saveTestState();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testStarted, testCompleted, saveTestState]);


  const selectTest = (test: Test) => {
    setSelectedTest(test);
    setTestCompleted(false);
    setShowResults(false);
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setScreenshotBlocked(false);
  };

  const startTest = (): boolean => {
    if (!selectedTest) return false;
    const shuffled = selectedTest.questions.map(shuffleOptions);
    setQuestions(shuffled);
    setTestStarted(true);
    setTestCompleted(false);
    setShowResults(false);
    setTimeLeft(selectedTest.duration);
    setCurrentQuestion(0);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setScreenshotBlocked(false);
    return true;
  };

  const resumeTest = (testId?: string): boolean => {
    const id = testId || selectedTest?.id;
    if (!id) return false;

    const savedState = checkSavedProgress(id);
    if (!savedState) return false;

    const test = tests.find(t => t.id === savedState.testId);
    if (!test) return false;

    try {
      // If we are not already on this test, select it
      if (selectedTest?.id !== test.id) {
        setSelectedTest(test);
      }

      setQuestions(savedState.shuffledQuestions);
      setAnswers(savedState.answers);
      setMarkedForReview(savedState.markedForReview);
      setVisitedQuestions(new Set(savedState.visitedQuestions));
      setCurrentQuestion(savedState.currentQuestion);
      setTimeLeft(savedState.timeLeft);
      setViolations(savedState.violations || []);
      setTabSwitchCount(savedState.tabSwitchCount || 0);
      setTestStarted(true);
      setTestCompleted(false);
      setShowResults(false);
      setFullscreenExitCount(0);
      setScreenshotBlocked(false);
      return true;
    } catch (error) {
      console.error("Error resuming test:", error);
      return false;
    }
  };

  const handleAnswer = (questionId: number, answerIndex: number | string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex as any }));
  };

  const clearResponse = () => {
    const qId = questions[currentQuestion]?.id;
    if (qId !== undefined) {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[qId];
        return newAnswers;
      });
    }
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setVisitedQuestions((prev) => new Set(prev).add(nextQuestion));
    }
  };

  const handleMarkAndNext = () => {
    const qId = questions[currentQuestion]?.id;
    if (qId !== undefined) {
      setMarkedForReview((prev) => ({ ...prev, [qId]: true }));
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setVisitedQuestions((prev) => new Set(prev).add(nextQuestion));
      }
    }
  };

  const handleSubmit = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    let confirmMessage = "Are you sure you want to submit the test?";
    if (unansweredCount > 0) {
      confirmMessage = `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`;
    }
    const confirmed = window.confirm(confirmMessage);
    if (confirmed) {
      clearSavedState();
      setTestCompleted(true);
      setShowResults(true);
    }
  };

  const restartTest = () => {
    setTestStarted(false);
    setSelectedTest(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setTimeLeft(DEFAULT_TEST_DURATION);
    setTestCompleted(false);
    setShowResults(false);
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0);
    setScreenshotBlocked(false);
  };

  const addViolation = (message: string) => {
    setViolations((prev) => [...prev, message]);
  };

  const handleQuestionNavigation = (idx: number) => {
    setCurrentQuestion(idx);
    setVisitedQuestions((prev) => new Set(prev).add(idx));
  };

  const getStatusCounts = () => {
    let answered = 0;
    let visitedNotAnswered = 0;
    let notVisited = 0;
    let markedForReviewCount = 0;
    let answeredMarked = 0;
    questions.forEach((q, idx) => {
      const isAnswered = answers[q.id] !== undefined;
      const isMarked = markedForReview[q.id];
      const isVisited = visitedQuestions.has(idx);
      if (isAnswered && isMarked) {
        answeredMarked++;
      } else if (isAnswered) {
        answered++;
      } else if (isMarked) {
        markedForReviewCount++;
      } else if (isVisited) {
        visitedNotAnswered++;
      } else {
        notVisited++;
      }
    });
    return {
      answered,
      visitedNotAnswered,
      notVisited,
      markedForReviewCount,
      answeredMarked,
    };
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let totalMarks = 0;
    let maxMarks = 0;

    questions.forEach((q) => {
      // Calculate Max Marks
      if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
        maxMarks += 50;
      } else {
        maxMarks += 4;
      }

      const userAnswer = answers[q.id];
      if (userAnswer !== undefined && userAnswer !== "") {
        if (q.type === 'numeric') {
          // Numeric Logic
          if (String(userAnswer) === String(q.correctOption)) {
            correct++;
            totalMarks += 4;
          } else {
            incorrect++;
            // 0 Negative marks
          }
        } else if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
          // Drawing logic - No auto marks
          // User effectively "attempted" it
        } else {
          // MCQ Logic
          if (userAnswer === q.correctIndex) {
            correct++;
            totalMarks += 4;
          } else {
            incorrect++;
            totalMarks -= 1;
          }
        }
      } else {
        unattempted++;
      }
    });

    return { correct, incorrect, unattempted, totalMarks, maxMarks };
  };

  const addTest = (
    name: string,
    description: string,
    duration: number,
  ): { success: boolean; message: string } => {
    if (!name.trim()) {
      return { success: false, message: "Please enter test name" };
    }
    if (isNaN(duration) || duration <= 0) {
      return { success: false, message: "Please enter a valid duration" };
    }
    const newTest: Test = {
      id: "test" + Date.now(),
      name: name.trim(),
      description: description.trim() || "No description",
      duration: duration * 60,
      questions: [],
    };
    setTests((prev) => [...prev, newTest]);
    return {
      success: true,
      message: `Test "${newTest.name}" added successfully!`,
    };
  };

  const deleteTest = (testId: string) => {
    setTests((prev) => prev.filter((t) => t.id !== testId));
  };

  return (
    <TestContext.Provider
      value={{
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
        fullscreenExitCount,
        isFullscreen,
        screenshotBlocked,
        checkSavedProgress,
        setTests,
        setSelectedTest,
        selectTest,
        startTest,
        resumeTest,
        clearSavedState,
        setCurrentQuestion,
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
        addTest,
        deleteTest,
        testAttempts,
        getStudentAttempts,
        getAllAttempts,
        saveTestAttempt,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}

export { DEFAULT_TEST_DURATION };