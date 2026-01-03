import { Test } from '../../types';
import { rankBoosterWhiteQuestions } from '../questions/rank-booster/white-tests';
import { rankBoosterBlueQuestions } from '../questions/rank-booster/blue-tests';
import { rankBoosterGreyQuestions } from '../questions/rank-booster/grey-tests';
import { rankBoosterPYQQuestions } from '../questions/rank-booster/pyq';
import { rankBoosterlatestQuestions } from '../questions/rank-booster/latest';

const DEFAULT_TEST_DURATION = 3600;

export const rankBoosterTests: Test[] = [
    { id: 'rank_booster-white-mock-test-1', name: 'rank_booster-white-mock-test-1', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: rankBoosterWhiteQuestions.slice(0, 50), category: 'white', course: 'rank_booster' },
{ id: 'rank_booster-blue-mock-test-6', name: 'rank_booster-blue-mock-test-6', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: rankBoosterBlueQuestions.slice(0, 50), category: 'blue', course: 'rank_booster' },
{ id: 'rank_booster-grey-mock-test-25', name: 'rank_booster-grey-mock-test-25', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: rankBoosterGreyQuestions.slice(0, 50), category: 'grey', course: 'rank_booster' },
{ id: 'rank_booster-jee-barch-pyq-2023-january-attempt', name: 'rank_booster-jee-barch-pyq-2023-january-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(0, 50), category: 'pyq', course: 'rank_booster' },
{ id: 'rank_booster-jee-barch-pyq-2023-april-attempt', name: 'rank_booster-jee-barch-pyq-2023-april-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(50, 100), category: 'pyq', course: 'rank_booster' },
{ id: 'rank_booster-jee-barch-pyq-2024-january-attempt', name: 'rank_booster-jee-barch-pyq-2024-january-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(100, 150), category: 'pyq', course:'rank_booster' },
{ id: 'rank_booster-jee-barch-pyq-2024-april-attempt', name: 'rank_booster-jee-barch-pyq-2024-april-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(150, 200), category: 'pyq', course: 'rank_booster' },
{ id: 'rank_booster-jee-barch-pyq-2025-january-attempt', name: 'rank_booster-jee-barch-pyq-2025-january-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(200, 250), category: 'pyq', course: 'rank_booster' },
{ id: 'rank_booster-jee-barch-pyq-2025-april-attempt', name: 'rank_booster-jee-barch-pyq-2025-april-attempt', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterPYQQuestions.slice(250, 300), category: 'pyq', course: 'rank_booster' },
{ id: 'latest pattern test rank booster', name: 'Rank booster Mock 1 (2026)', description: 'Solve the expected paper of this year', duration: DEFAULT_TEST_DURATION, questions: rankBoosterlatestQuestions.slice(0, 50), category: 'latest', course: 'rank_booster' },
  
];

