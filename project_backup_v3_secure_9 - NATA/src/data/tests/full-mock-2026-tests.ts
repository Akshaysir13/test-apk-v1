import { Test } from "../../types";

/**
 * SIMPLIFIED B.ARCH TEST TEMPLATE
 * 
 * To create a test:
 * 1. Change the 'id' and 'name'
 * 2. Add your questions to the 'questions' array one by one
 * 3. Make sure 'questionIndices' in the 'sections' part matches your question order
 */

export const fullmocklatestquestions: Test = {
  id: "test-001",
  name: "B.Arch Mock Test - Set 1",
  description: "Standard JEE B.Arch Practice Test",
  duration: 10800, // 3 hours
  course: "foundation",
  category: "latest",
  sections: [
    {
      id: "aptitude",
      name: "Aptitude",
      type: "aptitude",
      questionIndices: [0, 1] // Index of questions in the list below
    },
    {
      id: "math-mcq",
      name: "Mathematics (MCQ)",
      type: "math",
      questionIndices: [2]
    },
    {
      id: "math-numeric",
      name: "Mathematics (Numeric)",
      type: "math",
      questionIndices: [3]
    },
    {
      id: "drawing",
      name: "Drawing",
      type: "drawing",
      questionIndices: [4]
    }
  ],
  questions: [
    // [Index 0] Aptitude MCQ
    {
      id: 101,
      question: "Identify the pattern in the sequence provided below.",
      optionA: "Option A",
      optionB: "Option B",
      optionC: "Option C",
      optionD: "Option D",
      correctOption: "a"
    },
    // [Index 1] Aptitude MCQ
    {
      id: 102,
      question: "Which 3D shape can be formed from the given 2D net?",
      optionA: "Cube",
      optionB: "Pyramid",
      optionC: "Cylinder",
      optionD: "Cone",
      correctOption: "b"
    },
    // [Index 2] Math MCQ
    {
      id: 201,
      question: "Find the value of x if 2x + 5 = 15.",
      optionA: "2",
      optionB: "5",
      optionC: "10",
      optionD: "15",
      correctOption: "b"
    },
    // [Index 3] Math Numeric
    {
      id: 301,
      type: "numeric" as any,
      question: "Calculate the area of a square with side length 5 cm.",
      correctOption: "25",
      optionA: "0", optionB: "0", optionC: "0", optionD: "0" // Keep these as 0 for Numeric questions
    },
    // [Index 4] Drawing
    {
      id: 401,
      question: "Draw a perspective sketch of a modern house from the street view.",
      correctOption: "manual_evaluation",
      optionA: "0", optionB: "0", optionC: "0", optionD: "0" // Keep these as 0 for Drawing questions
    }
  ]
};

export const fullmocklatestTests: Test[] = [
  fullmocklatestquestions
];
