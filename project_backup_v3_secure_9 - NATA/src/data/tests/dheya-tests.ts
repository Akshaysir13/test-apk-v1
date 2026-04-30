import { Test } from '../../types';
import { dheyaFreeQuestions } from '../questions/dheya/free-tests';
import { nata2026Bank } from '../questions/nata-2026/bank';

const DEFAULT_TEST_DURATION = 3600;

export const dheyaTests: Test[] = [
    //Dheya
    
    {
        id: 'dheya-nata-2026-aptitude-only-01',
        name: 'FREE: NATA 2026 Aptitude Only 01 (B1+B2)',
        description: 'Part B only (42 MCQ + 8 NCQ): 108 sec/question, auto-next, no revisit.',
        duration: 90 * 60,
        questions: nata2026Bank.slice(3, 53),
        category: 'nata',
        course: 'dheya',
        perQuestionTimeSec: 108,
        disableBackNavigation: true,
        sections: [
            { id: 'b1', name: 'B1 (MCQ)', type: 'aptitude', questionIndices: Array.from({ length: 42 }, (_, i) => i) },
            { id: 'b2', name: 'B2 (NCQ)', type: 'math', questionIndices: Array.from({ length: 8 }, (_, i) => i + 42) },
        ],
    },
    {
        id: 'dheya-nata-2026-full-mock-01',
        name: 'FREE: NATA 2026 Full Mock 01',
        description: 'NATA 2026 full pattern: Part A (Offline) + Part B (Online).',
        duration: 180 * 60,
        questions: nata2026Bank.slice(0, 53),
        category: 'nata',
        course: 'dheya',
        perQuestionTimeSec: 108,
        disableBackNavigation: true,
        sections: [
            { id: 'part-a', name: 'Part A (Offline)', type: 'drawing', questionIndices: [0, 1, 2] },
            { id: 'b1', name: 'B1 (MCQ)', type: 'aptitude', questionIndices: Array.from({ length: 42 }, (_, i) => i + 3) },
            { id: 'b2', name: 'B2 (NCQ)', type: 'math', questionIndices: Array.from({ length: 8 }, (_, i) => i + 45) },
        ],
    },
    { id: 'dheya-jee-barch-pyq-2023-january-attempt', name: 'Dheya: PYQ 2023 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(0, 50), category: 'pyq', course: 'dheya' },
    { id: 'dheya-jee-barch-pyq-2023-april-attempt', name: 'Dheya: PYQ 2023 (Apr Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(50, 100), category: 'pyq', course: 'dheya' },
    //{ id: 'dheya-jee-barch-pyq-2024-january-attempt', name: 'dheya-jee-barch-pyq-2024-january-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(100, 150), category: 'pyq', course: 'dheya' },
    //{ id: 'dheya-jee-barch-pyq-2024-april-attempt', name: 'dheya-jee-barch-pyq-2024-april-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(150, 200), category: 'pyq', course: 'dheya' },
    //{ id: 'dheya-jee-barch-pyq-2025-january-attempt', name: 'dheya-jee-barch-pyq-2025-january-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(200, 250), category: 'pyq', course: 'dheya' },
    //{ id: 'dheya-jee-barch-pyq-2025-april-attempt', name: 'dheya-jee-barch-pyq-2025-april-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(250, 300), category: 'pyq', course: 'dheya' },
];
