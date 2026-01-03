import { Test } from "../../types";

/**
 * SIMPLIFIED B.ARCH TEST TEMPLATE
 * 
 * To create a test:
 * 1. Change the 'id' and 'name'
 * 2. Add your questions to the 'questions' array one by one
 * 3. Make sure 'questionIndices' in the 'sections' part matches your question order
 */

export const bArchTestTemplate: Test = {
  id: "FULL MOCK-001 (2026)",
  name: " Jee B.Arch 2026 Full Mock Test 1",
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
    question: "Who is an architect of Inter University Centre for Astronomy and Astrology - Pune",
    optionA: "Achyut Kanvinde",
    optionB: "CP Kukreja",
    optionC: "Sharat Das",
    optionD: "Charles Correa",
    correctOption: "d"
  },
  {
    id: 102,
    question: "Identify the correct Group of following",
    image: "https://drive.google.com/thumbnail?id=1W6NBEsrH_WikVKgUMaIMRbrv5HmAFlFm&sz=w1000",
    optionA: "b",
    optionB: "c",
    optionC: "d",
    optionD: "a",
    correctOption: "d"
  },
  {
    id: 103,
    type: 'match-pair',
    question: "Math the pair",
    columnAItems: [
      "1. Aravali mountain range",
      "2. Purvanchal [lesser Himalaya], eastern mountain range [Ghats]",
      "3. Western ghat",
      "4. Vindhya range"
],
    columnBItems: [
      "Madhya Pradesh , Up",
      "Uttarprades, sikkim , West bangal",
      "Gujarat, Rajasthan",
      "Maharastra karnataka tamil nadu"
],
    optionA: "1-A 2-C 3-B 4-D",
    optionB: "1-A 2-D 3-B 4-C",
    optionC: "1-B 2-D 3-A 4-C",
    optionD: "1-C 2-B 3-D 4-A",
    correctOption: "d"
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

export const exampleSectionedTests: Test[] = [
  bArchTestTemplate
];
