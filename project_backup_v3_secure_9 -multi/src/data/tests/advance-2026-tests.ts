import { Test } from '../../types';
import { advance2026Questions } from '../questions/advance-2026/latest';

const DEFAULT_TEST_DURATION = 3600;

export const advance2026Tests: Test[] = [
    { id: 'advanced-jee-barch-2026-January-attempt', name: 'Advance 2026: Jan Mock', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: advance2026Questions.slice(0, 50), category: 'latest', course: 'advance_2026' },

    // ADD MORE ADVANCE TESTS HERE
];