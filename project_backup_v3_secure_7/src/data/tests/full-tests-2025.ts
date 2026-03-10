import { Test } from "../../types";
import { fullTests2025Questions } from "../questions/full-tests-2025/questions";

export const fullTests2025: Test[] = [
 // Test 1
  {
    id: 'foundation-2025-full-mock-1',
    name: 'Foundation: Full Mock 1 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600, // 3.30 hours
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(0, 77),
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

  // Test 2
  {
    id: 'foundation-2025-full-mock-2',
    name: 'Foundation: Full Mock 2 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(77, 154),
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

  // Test 3
  {
    id: 'foundation-2025-full-mock-3',
    name: 'Foundation: Full Mock 3 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(154, 231),
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

  // Test 4
  {
    id: 'foundation-2025-full-mock-4',
    name: 'Foundation: Full Mock 4 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(231, 308),
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

  // Test 5
  {
    id: 'foundation-2025-full-mock-5',
    name: 'Foundation: Full Mock 5 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(308, 385),
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

  // Test 6
  {
    id: 'foundation-2025-full-mock-6',
    name: 'Foundation: Full Mock 6 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(385, 462),
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

  // Test 7 - NO MATH SECTION (only Aptitude + Drawing = 52 questions)
  {
    id: 'foundation-2025-full-mock-7',
    name: 'Foundation: Full Mock 7 (2025)',
    description: 'B.Arch Pattern: Aptitude + Drawing (No Math)',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(462, 514), // 52 questions
    sections: [
      {
        id: "aptitude",
        name: "Aptitude",
        type: "aptitude",
        questionIndices: Array.from({ length: 50 }, (_, i) => i)
      },
      {
        id: "drawing",
        name: "Drawing",
        type: "drawing",
        questionIndices: [50, 51]
      }
    ]
  },

  // Test 8
  {
    id: 'foundation-2025-full-mock-8',
    name: 'Foundation: Full Mock 8 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(514, 591),
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

  // Test 9 - NO MATH SECTION (only Aptitude + Drawing = 52 questions)
  {
    id: 'foundation-2025-full-mock-9',
    name: 'Foundation: Full Mock 9 (2025)',
    description: 'B.Arch Pattern: Aptitude + Drawing (No Math)',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(591, 643), // 52 questions
    sections: [
      {
        id: "aptitude",
        name: "Aptitude",
        type: "aptitude",
        questionIndices: Array.from({ length: 50 }, (_, i) => i)
      },
      {
        id: "drawing",
        name: "Drawing",
        type: "drawing",
        questionIndices: [50, 51]
      }
    ]
  },

  // Test 10
  {
    id: 'foundation-2025-full-mock-10',
    name: 'Foundation: Full Mock 10 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(643, 720),
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

  // Test 11
  {
    id: 'foundation-2025-full-mock-11',
    name: 'Foundation: Full Mock 11 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(720, 797),
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

  // Test 12
  {
    id: 'foundation-2025-full-mock-12',
    name: 'Foundation: Full Mock 12 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(797, 874),
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

  // Test 13
  {
    id: 'foundation-2025-full-mock-13',
    name: 'Foundation: Full Mock 13 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(874, 951),
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

  // Test 14
  {
    id: 'foundation-2025-full-mock-14',
    name: 'Foundation: Full Mock 14 (2025)',
    description: 'Complete B.Arch Pattern: Aptitude + Math + Drawing',
    duration: 12600,
    category: 'full_tests_2025',
    course: 'foundation',
    questions: fullTests2025Questions.slice(951, 1028),
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
  }
];
