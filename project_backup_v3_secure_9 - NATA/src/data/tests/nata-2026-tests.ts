import { Test } from '../../types';
import { nata2026Bank } from '../questions/nata-2026/bank';

/**
 * Bank layout (same as JEE full mocks: fixed block size, slice by absolute range):
 *   Each full mock = 53 questions in `nata2026Bank`:
 *     [0..2]   Part A (drawing)
 *     [3..44]  B1 (42 MCQ)
 *     [45..52] B2 (8 NCQ)
 *
 * Full Mock k  → slice((k-1)*53, k*53)
 * Aptitude only → skip first 3 of that block → slice((k-1)*53 + 3, k*53)
 */
const FULL_MOCK_DURATION = 10800; // 180 minutes
const APTITUDE_ONLY_DURATION = 90 * 60;

const fullMockSections: Test['sections'] = [
  { id: 'part-a', name: 'Part A (Offline)', type: 'drawing', questionIndices: [0, 1, 2] },
  { id: 'b1', name: 'B1 (MCQ)', type: 'aptitude', questionIndices: Array.from({ length: 42 }, (_, i) => i + 3) },
  { id: 'b2', name: 'B2 (NCQ)', type: 'math', questionIndices: Array.from({ length: 8 }, (_, i) => i + 3 + 42) },
];

const aptitudeOnlySections: Test['sections'] = [
  { id: 'b1', name: 'B1 (MCQ)', type: 'aptitude', questionIndices: Array.from({ length: 42 }, (_, i) => i) },
  { id: 'b2', name: 'B2 (NCQ)', type: 'math', questionIndices: Array.from({ length: 8 }, (_, i) => i + 42) },
];

export const nata2026Tests: Test[] = [
  // --- Full mocks (JEE-style: explicit bank slice per test) ---
  {
    id: 'nata-2026-full-mock-1',
    name: 'NATA 2026: Full Mock 01',
    description: 'NATA 2026 pattern: Part A (Offline) + Part B (Online).',
    duration: FULL_MOCK_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(0, 53),
    sections: fullMockSections,
  },
  {
    id: 'nata-2026-full-mock-2',
    name: 'NATA 2026: Full Mock 02',
    description: 'NATA 2026 pattern: Part A (Offline) + Part B (Online).',
    duration: FULL_MOCK_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(53, 106),
    sections: fullMockSections,
  },
  {
    id: 'nata-2026-full-mock-3',
    name: 'NATA 2026: Full Mock 03',
    description: 'NATA 2026 pattern: Part A (Offline) + Part B (Online).',
    duration: FULL_MOCK_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(106, 159),
    sections: fullMockSections,
  },
  {
    id: 'nata-2026-full-mock-4',
    name: 'NATA 2026: Full Mock 04',
    description: 'NATA 2026 pattern: Part A (Offline) + Part B (Online).',
    duration: FULL_MOCK_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(159, 212),
    sections: fullMockSections,
  },
  {
    id: 'nata-2026-full-mock-5',
    name: 'NATA 2026: Full Mock 05',
    description: 'NATA 2026 pattern: Part A (Offline) + Part B (Online).',
    duration: FULL_MOCK_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(212, 265),
    sections: fullMockSections,
  },

  // --- Aptitude only (same block, range starts after 3 drawing questions) ---
  {
    id: 'nata-2026-aptitude-only-1',
    name: 'NATA 2026: Aptitude Only 01 (B1+B2)',
    description: 'Part B only: 42 MCQ + 8 NCQ (same as Full Mock 01, without Part A).',
    duration: APTITUDE_ONLY_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(265, 315),
    sections: aptitudeOnlySections,
  },
  {
    id: 'nata-2026-aptitude-only-2',
    name: 'NATA 2026: Aptitude Only 02 (B1+B2)',
    description: 'Part B only: 42 MCQ + 8 NCQ (same as Full Mock 02, without Part A).',
    duration: APTITUDE_ONLY_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(315, 365),
    sections: aptitudeOnlySections,
  },
  {
    id: 'nata-2026-aptitude-only-3',
    name: 'NATA 2026: Aptitude Only 03 (B1+B2)',
    description: 'Part B only: 42 MCQ + 8 NCQ (same as Full Mock 03, without Part A).',
    duration: APTITUDE_ONLY_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(365, 415),
    sections: aptitudeOnlySections,
  },
  {
    id: 'nata-2026-aptitude-only-4',
    name: 'NATA 2026: Aptitude Only 04 (B1+B2)',
    description: 'Part B only: 42 MCQ + 8 NCQ (same as Full Mock 04, without Part A).',
    duration: APTITUDE_ONLY_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(415, 465),
    sections: aptitudeOnlySections,
  },
  {
    id: 'nata-2026-aptitude-only-5',
    name: 'NATA 2026: Aptitude Only 05 (B1+B2)',
    description: 'Part B only: 42 MCQ + 8 NCQ (same as Full Mock 05, without Part A).',
    duration: APTITUDE_ONLY_DURATION,
    category: 'nata',
    course: 'nata_2026',
    perQuestionTimeSec: 108,
    disableBackNavigation: true,
    questions: nata2026Bank.slice(465, 515),
    sections: aptitudeOnlySections,
  },
];
