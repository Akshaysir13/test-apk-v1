// src/types.ts - UPDATED VERSION

export type QuestionType = 'normal' | 'match-pair' | 'statement' | 'numeric' | 'drawing';

export interface Section {
  id: string;
  name: string;
  questionIndices: number[]; // Indices of questions in the test.questions array
  type: 'aptitude' | 'math' | 'drawing';
}

export interface Question {
  id: number;
  question: string;
  type?: QuestionType;
  columnAItems?: string[];
  columnBItems?: string[];
  statement1?: string;
  statement2?: string;
  image?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}

export interface ShuffledQuestion extends Question {
  shuffledOptions: { text: string; originalKey: string }[];
  correctIndex: number;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  duration: number;
  questions: Question[];
  sections?: Section[];
  category?: 'white' | 'blue' | 'grey' | 'pyq' | 'latest' | 'full_tests_2025';
  course?: 'foundation' | 'rank_booster' | 'dheya' | 'advance_2026';


export interface UserAccount {
  email: string;
  password: string;
  role: 'admin' | 'student';
  approved: boolean;
  courses?: string[]; // ← ADD THIS LINE
}

export interface SavedTestState {
  testId: string;
  userEmail: string;
  answers: Record<number, number | string>;
  markedForReview: Record<number, boolean>;
  visitedQuestions: Record<number, boolean>;
  currentQuestion: number;
  timeLeft: number;
  shuffledQuestions: ShuffledQuestion[];
  savedAt: number;
}

export interface TestAttempt {
  id: string;
  studentEmail: string;
  testId: string;
  testName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  timeTaken: number;
  totalTime: number;
  violations: string[];
  tabSwitchCount: number;
  submittedAt: number;
  answers?: Record<number, number | string>; // Stores question_id: answer_index mapping
  questions?: ShuffledQuestion[]; // Stores the exact shuffled questions for this attempt
}

export interface TestCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}