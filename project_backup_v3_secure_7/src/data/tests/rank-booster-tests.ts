import { Test } from '../../types';
import { rankBoosterWhiteQuestions } from '../questions/rank-booster/white-tests';
import { rankBoosterBlueQuestions } from '../questions/rank-booster/blue-tests';
import { rankBoosterGreyQuestions } from '../questions/rank-booster/grey-tests';
import { rankBoosterPYQQuestions } from '../questions/rank-booster/pyq';
import { rankBoosterlatestQuestions } from '../questions/rank-booster/latest';

const DEFAULT_TEST_DURATION = 3600;

export const rankBoosterTests: Test[] = [
    //{ id: 'rank_booster-white-mock-test-1', name: 'Rank Booster: White Mock 01', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: rankBoosterWhiteQuestions.slice(0, 50), category: 'white', course: 'rank_booster' },
    //{ id: 'rank_booster-blue-mock-test-6', name: 'Rank Booster: Blue Mock 06', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: rankBoosterBlueQuestions.slice(0, 50), category: 'blue', course: 'rank_booster' },
    //{ id: 'rank_booster-grey-mock-test-25', name: 'Rank Booster: Grey Mock 25', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: rankBoosterGreyQuestions.slice(0, 50), category: 'grey', course: 'rank_booster' },
    { id: 'rank_booster-jee-barch-pyq-2023-january-attempt', name: 'PYQ 2023 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(0, 50), category: 'pyq', course: 'rank_booster' },
    { id: 'rank_booster-jee-barch-pyq-2023-april-attempt', name: 'PYQ 2023 (Apr Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(50, 100), category: 'pyq', course: 'rank_booster' },
    { id: 'rank_booster-jee-barch-pyq-2024-january-attempt', name: 'PYQ 2024 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(100, 150), category: 'pyq', course: 'rank_booster' },
    { id: 'rank_booster-jee-barch-pyq-2024-april-attempt', name: 'PYQ 2024 (Apr Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(150, 200), category: 'pyq', course: 'rank_booster' },
    { id: 'rank_booster-jee-barch-pyq-2025-january-attempt', name: 'PYQ 2025 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(200, 250), category: 'pyq', course: 'rank_booster' },
    { id: 'rank_booster-jee-barch-pyq-2025-april-attempt', name: 'PYQ 2025 (Apr Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(250, 300), category: 'pyq', course: 'rank_booster' },
    //{ id: 'latest pattern test rank booster', name: 'Rank Booster: Mock 1 (2026)', description: 'Solve the expected paper of this year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterlatestQuestions.slice(0, 50), category: 'latest', course: 'rank_booster' },
 {
    id: 'Rankbooster-latest-full-mock-1 ( 3 hr )',
    name: 'Rank Boosteer: Full Mock 1 (2026)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 10800, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'rank_booster',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+1 = 76)
    questions: rankBoosterlatestQuestions.slice(0, 77),
    sections: [
      // Section 1: Aptitude (Indices 0-49)
      {
        id: "aptitude",
        name: "Aptitude",
        type: "aptitude",
        // Creates an array [0, 1, 2, ... 49]
        questionIndices: Array.from({ length: 50 }, (_, i) => i)
      },
      // Section 2: Mathematics MCQ (Indices 50-69)
      {
        id: "math-mcq",
        name: "Mathematics (MCQ)",
        type: "math",
        // Creates an array [50, 51, ... 69]
        questionIndices: Array.from({ length: 20 }, (_, i) => i + 50)
      },
      // Section 3: Mathematics Numeric (Indices 70-74)
      {
        id: "math-numeric",
        name: "Mathematics (Numeric)",
        type: "math",
        // Creates an array [70, 71, ... 74]
        questionIndices: Array.from({ length: 5 }, (_, i) => i + 70)
      },
      // Section 4: Drawing (Index 75)
      {
        id: "drawing",
        name: "Drawing",
        type: "drawing",
        // Single index [75]
        questionIndices: [75, 76]

      }
    ]
  },
{
  id: 'rank_booster-white-full-mock-1',
  name: 'Rank Booster: White Full Mock 01',
  description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
  duration: 10800,
  category: 'white',
  course: 'rank_booster',

  questions: rankBoosterWhiteQuestions.slice(0, 77),

  sections: [
    {
      id: "aptitude",
      name: "Aptitude",
      type: "aptitude",
      questionIndices: Array.from({ length: 50 }, (_, i) => i)
    },
    {
      id: "math-mcq",
      name: "Mathematics (MCQ)",
      type: "math",
      questionIndices: Array.from({ length: 20 }, (_, i) => i + 50)
    },
    {
      id: "math-numeric",
      name: "Mathematics (Numeric)",
      type: "math",
      questionIndices: Array.from({ length: 5 }, (_, i) => i + 70)
    },
    {
      id: "drawing",
      name: "Drawing",
      type: "drawing",
      questionIndices: [75, 76]
    }
  ]
},
{
  id: 'rank_booster-blue-full-mock-1',
  name: 'Rank Booster: Blue Full Mock 01',
  description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
  duration: 10800,
  category: 'blue',
  course: 'rank_booster',

  questions: rankBoosterBlueQuestions.slice(0, 77),

  sections: [
    {
      id: "aptitude",
      name: "Aptitude",
      type: "aptitude",
      questionIndices: Array.from({ length: 50 }, (_, i) => i)
    },
    {
      id: "math-mcq",
      name: "Mathematics (MCQ)",
      type: "math",
      questionIndices: Array.from({ length: 20 }, (_, i) => i + 50)
    },
    {
      id: "math-numeric",
      name: "Mathematics (Numeric)",
      type: "math",
      questionIndices: Array.from({ length: 5 }, (_, i) => i + 70)
    },
    {
      id: "drawing",
      name: "Drawing",
      type: "drawing",
      questionIndices: [75, 76]
    }
  ]
},
{
  id: 'rank_booster-grey-full-mock-1',
  name: 'Rank Booster: Grey Full Mock 01',
  description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
  duration: 10800,
  category: 'grey',
  course: 'rank_booster',

  questions: rankBoosterGreyQuestions.slice(0, 77),

  sections: [
    {
      id: "aptitude",
      name: "Aptitude",
      type: "aptitude",
      questionIndices: Array.from({ length: 50 }, (_, i) => i)
    },
    {
      id: "math-mcq",
      name: "Mathematics (MCQ)",
      type: "math",
      questionIndices: Array.from({ length: 20 }, (_, i) => i + 50)
    },
    {
      id: "math-numeric",
      name: "Mathematics (Numeric)",
      type: "math",
      questionIndices: Array.from({ length: 5 }, (_, i) => i + 70)
    },
    {
      id: "drawing",
      name: "Drawing",
      type: "drawing",
      questionIndices: [75, 76]
    }
  ]
},

























































    
];




