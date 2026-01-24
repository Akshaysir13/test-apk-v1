import { Test } from '../../types';
import { foundationWhiteQuestions } from '../questions/foundation/white-tests';
import { foundationBlueQuestions } from '../questions/foundation/blue-tests';
import { foundationGreyQuestions } from '../questions/foundation/grey-tests';
import { foundationPYQQuestions } from '../questions/foundation/pyq';
import { foundationlatestQuestions } from '../questions/foundation/latest';



const DEFAULT_TEST_DURATION = 3600;

export const foundationTests: Test[] = [
  //White Mock Tests
  { id: 'foundation-white-mock-test-1', name: 'Foundation: White Mock 01', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationWhiteQuestions.slice(0, 50), category: 'white', course: 'foundation' },
  { id: 'foundation-white-mock-test-2', name: 'Foundation: White Mock 02', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationWhiteQuestions.slice(50, 100), category: 'white', course: 'foundation' },
  { id: 'foundation-white-mock-test-3', name: 'Foundation: White Mock 03', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationWhiteQuestions.slice(100, 150), category: 'white', course: 'foundation' },
  { id: 'foundation-white-mock-test-4', name: 'Foundation: White Mock 04', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationWhiteQuestions.slice(150, 200), category: 'white', course: 'foundation' },
  { id: 'foundation-white-mock-test-5', name: 'Foundation: White Mock 05', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationWhiteQuestions.slice(200, 250), category: 'white', course: 'foundation' },
  { id: 'foundation-white-mock-test-6', name: 'Foundation: White Mock 06', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationWhiteQuestions.slice(250, 300), category: 'white', course: 'foundation' },
  { id: 'foundation-white-mock-test-7', name: 'Foundation: White Mock 07', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationWhiteQuestions.slice(300, 350), category: 'white', course: 'foundation' },
  { id: 'foundation-white-mock-test-8', name: 'Foundation: White Mock 08', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationWhiteQuestions.slice(350, 400), category: 'white', course: 'foundation' },//White Tests End
  //Blue Tests Start
  { id: 'foundation-blue-mock-test-1', name: 'Foundation: Blue Mock 01', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(0, 50), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-2', name: 'Foundation: Blue Mock 02', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(50, 100), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-3', name: 'Foundation: Blue Mock 03', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(100, 150), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-4', name: 'Foundation: Blue Mock 04', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(150, 200), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-5', name: 'Foundation: Blue Mock 05', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(200, 250), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-6', name: 'Foundation: Blue Mock 06', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(250, 300), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-7', name: 'Foundation: Blue Mock 07', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(300, 350), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-8', name: 'Foundation: Blue Mock 08', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(350, 400), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-9', name: 'Foundation: Blue Mock 09', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(400, 450), category: 'blue', course: 'foundation' },
  { id: 'foundation-blue-mock-test-10', name: 'Foundation: Blue Mock 10', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationBlueQuestions.slice(450, 500), category: 'blue', course: 'foundation' },//blue Tests End
  //Grey Tests Start
  { id: 'foundation-grey-mock-test-1', name: 'Foundation: Grey Mock 01', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(0, 50), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-2', name: 'Foundation: Grey Mock 02', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(50, 100), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-3', name: 'Foundation: Grey Mock 03', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(100, 150), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-5', name: 'Foundation: Grey Mock 05', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(150, 200), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-6', name: 'Foundation: Grey Mock 06', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(200, 250), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-7', name: 'Foundation: Grey Mock 07', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(250, 300), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-8', name: 'Foundation: Grey Mock 08', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(300, 350), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-9', name: 'Foundation: Grey Mock 09', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(350, 400), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-10', name: 'Foundation: Grey Mock 10', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(400, 450), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-11', name: 'Foundation: Grey Mock 11', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(450, 500), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-12', name: 'Foundation: Grey Mock 12', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(500, 550), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-13', name: 'Foundation: Grey Mock 13', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(550, 600), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-14', name: 'Foundation: Grey Mock 14', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(600, 650), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-15', name: 'Foundation: Grey Mock 15', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(650, 700), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-16', name: 'Foundation: Grey Mock 16', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(700, 750), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-17', name: 'Foundation: Grey Mock 17', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(750, 800), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-18', name: 'Foundation: Grey Mock 18', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(800, 850), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-19', name: 'Foundation: Grey Mock 19', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(850, 900), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-20', name: 'Foundation: Grey Mock 20', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(900, 950), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-21', name: 'Foundation: Grey Mock 21', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(950, 1000), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-21.5', name: 'Foundation: Grey Mock 21.5', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1000, 1050), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-22', name: 'Foundation: Grey Mock 22', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1050, 1100), category: "grey", course: 'foundation' },
  { id: 'foundation-grey-mock-test-23', name: 'Foundation: Grey Mock 23', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1100, 1150), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-24', name: 'Foundation: Grey Mock 24', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1150, 1200), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-4', name: 'Foundation: Grey Mock 04', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1200, 1250), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-26', name: 'Foundation: Grey Mock 26', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1250, 1300), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-27', name: 'Foundation: Grey Mock 27', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1300, 1350), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-28', name: 'Foundation: Grey Mock 28', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1350, 1400), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-29', name: 'Foundation: Grey Mock 29', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1400, 1450), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-30', name: 'Foundation: Grey Mock 30', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1450, 1500), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-31', name: 'Foundation: Grey Mock 31', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1500, 1550), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-32', name: 'Foundation: Grey Mock 32', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1550, 1600), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-33', name: 'Foundation: Grey Mock 33', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1600, 1650), category: 'grey', course: 'foundation' },
  { id: 'foundation-grey-mock-test-25', name: 'Foundation: Grey Mock 25', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: foundationGreyQuestions.slice(1650, 1700), category: 'grey', course: 'foundation' },//Grey Tests End
  //PYQ Tests Start
  { id: 'foundation-jee-barch-pyq-2005', name: 'Foundation: PYQ 2005', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(0, 50), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2006', name: 'Foundation: PYQ 2006', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(50, 100), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2007', name: 'Foundation: PYQ 2007', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(100, 150), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2008', name: 'Foundation: PYQ 2008', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(150, 200), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2009', name: 'Foundation: PYQ 2009', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(200, 250), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2010', name: 'Foundation: PYQ 2010', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(250, 300), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2011', name: 'Foundation: PYQ 2011', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(300, 350), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2012', name: 'Foundation: PYQ 2012', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(350, 400), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2013', name: 'Foundation: PYQ 2013', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(400, 450), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2014', name: 'Foundation: PYQ 2014', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(450, 500), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2015', name: 'Foundation: PYQ 2015', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(500, 550), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2016', name: 'Foundation: PYQ 2016', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(550, 600), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2017', name: 'Foundation: PYQ 2017', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(600, 650), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2018', name: 'Foundation: PYQ 2018', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(650, 700), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2019-january-attempt', name: 'Foundation: PYQ 2019 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(700, 750), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2019-april-attempt-morning', name: 'Foundation: PYQ 2019 (Apr AM)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(750, 800), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2019-april-attempt-evening', name: 'Foundation: PYQ 2019 (Apr PM)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(800, 850), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2020-january-attempt', name: 'Foundation: PYQ 2020 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(850, 900), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2020-april-attempt-morning', name: 'Foundation: PYQ 2020 (Apr AM)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(900, 950), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2020-april-attempt-evening', name: 'Foundation: PYQ 2020 (Apr PM)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(950, 1000), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2021-january-attempt', name: 'Foundation: PYQ 2021 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1000, 1050), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2021-september-attempt-morning', name: 'Foundation: PYQ 2021 (Sep AM)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1050, 1100), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2021-september-attempt-evening', name: 'Foundation: PYQ 2021 (Sep PM)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1100, 1150), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2022-june-attempt-morning', name: 'Foundation: PYQ 2022 (Jun AM)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1150, 1200), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2022-june-attempt-evening', name: 'Foundation: PYQ 2022 (Jun PM)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1200, 1250), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2022-july-attempt', name: 'Foundation: PYQ 2022 (Jul Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1250, 1300), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2023-january-attempt', name: 'Foundation: PYQ 2023 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1300, 1350), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2023-april-attempt', name: 'Foundation: PYQ 2023 (Apr Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1350, 1400), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2024-january-attempt', name: 'Foundation: PYQ 2024 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1400, 1450), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2024-april-attempt', name: 'Foundation: PYQ 2024 (Apr Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1450, 1500), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2025-january-attempt', name: 'Foundation: PYQ 2025 (Jan Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1500, 1550), category: 'pyq', course: 'foundation' },
  { id: 'foundation-jee-barch-pyq-2025-april-attempt', name: 'Foundation: PYQ 2025 (Apr Attempt)', description: 'Solve Actual PYQ from that Year', duration: DEFAULT_TEST_DURATION, questions: foundationPYQQuestions.slice(1550, 1600), category: 'pyq', course: 'foundation' },//PYQ Tests End
  //Latest Pattern Mock Test
  {
    id: 'foundation-latest-pattern-test-1',
    name: 'Foundation: Mock 1 (2026)',
    description: 'Solve the expected paper of this year',
    duration: DEFAULT_TEST_DURATION,
    questions: foundationlatestQuestions.slice(0, 50),
    category: 'latest',
    course: 'foundation',
    sections: [
      {
        id: "aptitude",
        name: "Aptitude",
        type: "aptitude",
        questionIndices: Array.from({ length: 50 }, (_, i) => i)
      }
    ]
  },
  {
    id: 'foundation-latest-pattern-test-2',
    name: 'Foundation: Mock 2 (2026)',
    description: 'Solve the expected paper of this year',
    duration: DEFAULT_TEST_DURATION,
    questions: foundationlatestQuestions.slice(50, 100),
    category: 'latest',
    course: 'foundation',
    sections: [
      {
        id: "aptitude",
        name: "Aptitude",
        type: "aptitude",
        questionIndices: Array.from({ length: 50 }, (_, i) => i)
      }
    ]
  },

  {
    id: 'foundation-latest-full-mock-1 ( 3.30 hr )',
    name: 'Foundation: Full Mock 1 (2026)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'foundation',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+1 = 76)
    questions: foundationlatestQuestions.slice(100, 177),
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
    id: 'foundation-latest-full-mock-2 ( 3.30hr )',
    name: 'Foundation: Full Mock 2 (2026)', // Note only description is different in original file, keeping ID same as original though it's likely a bug
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'foundation',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+1 = 76)
    questions: foundationlatestQuestions.slice(177, 254),
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
    id: 'foundation-latest-full-mock-3 ( 3.30hr )',
    name: 'Foundation: Full Mock 3 (2026)', // Note only description is different in original file, keeping ID same as original though it's likely a bug
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'foundation',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+1 = 76)
    questions: foundationlatestQuestions.slice(254, 331),
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
    id: 'foundation-latest-full-mock-4 ( 3.30hr )',
    name: 'Foundation: Full Mock 4 (2026)', // Note only description is different in original file, keeping ID same as original though it's likely a bug
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'foundation',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+1 = 76)
    questions: foundationlatestQuestions.slice(331, 408),
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
    id: 'foundation-latest-full-mock-5 ( 3.30hr )',
    name: 'Foundation: Full Mock 5 (2026)', // Note only description is different in original file, keeping ID same as original though it's likely a bug
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'foundation',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+1 = 76)
    questions: foundationlatestQuestions.slice(408, 485),
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
    id: 'foundation-latest-full-mock-6 ( 3.30hr )',
    name: 'Foundation: Full Mock 6 (2026)', // Note only description is different in original file, keeping ID same as original though it's likely a bug
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'foundation',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+1 = 76)
    questions: foundationlatestQuestions.slice(485, 562),
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
    id: 'foundation-latest-full-mock-7 ( 3.30hr )',
    name: 'Foundation: Full Mock 7 (2026)', // Note only description is different in original file, keeping ID same as original though it's likely a bug
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'foundation',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+1 = 76)
    questions: foundationlatestQuestions.slice(562, 639),
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
    id: 'foundation-latest-full-mock-8 ( 3.30hr )',
    name: 'Foundation: Full Mock 8 (2026)', // Note only description is different in original file, keeping ID same as original though it's likely a bug
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours (10800 seconds)
    category: 'latest',
    course: 'foundation',

    // IMPORTANT: Slice the TOTAL number of questions needed (50+20+5+2 = 77)
    questions: foundationlatestQuestions.slice(639, 691),
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

];












