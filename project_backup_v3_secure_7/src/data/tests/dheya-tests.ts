import { Test } from '../../types';
import { dheyaFreeQuestions } from '../questions/dheya/free-tests';

const DEFAULT_TEST_DURATION = 3600;

export const dheyaTests: Test[] = [
    //Dheya
    { id: 'dheya-jee-barch-pyq-2023-january-attempt', name: 'Dheya: PYQ 2023 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(0, 50), category: 'pyq', course: 'dheya' },
    { id: 'dheya-jee-barch-pyq-2023-april-attempt', name: 'Dheya: PYQ 2023 (Apr Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(50, 100), category: 'pyq', course: 'dheya' },
    //{ id: 'dheya-jee-barch-pyq-2024-january-attempt', name: 'dheya-jee-barch-pyq-2024-january-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(100, 150), category: 'pyq', course: 'dheya' },
    //{ id: 'dheya-jee-barch-pyq-2024-april-attempt', name: 'dheya-jee-barch-pyq-2024-april-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(150, 200), category: 'pyq', course: 'dheya' },
    //{ id: 'dheya-jee-barch-pyq-2025-january-attempt', name: 'dheya-jee-barch-pyq-2025-january-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(200, 250), category: 'pyq', course: 'dheya' },
    //{ id: 'dheya-jee-barch-pyq-2025-april-attempt', name: 'dheya-jee-barch-pyq-2025-april-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: dheyaFreeQuestions.slice(250, 300), category: 'pyq', course: 'dheya' },
];