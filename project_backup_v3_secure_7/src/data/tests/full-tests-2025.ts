import { Test } from "../../types";
import { fullTests2025Questions } from "../questions/full-tests-2025/questions";

export const fullTests2025: Test[] = [
    {
        id: "full-test-2025-1",
        name: "2025 Full Test 1",
        description: "Complete full-length test for 2025 pattern",
        duration: 10800,  // 3 hours (180 minutes)
        category: "full_tests_2025",  // Must match category ID in TestContext
        course: "foundation",    // For user access control
        questions: fullTests2025Questions,
    },
    // Add more tests as needed:
    // {
    //   id: "full-test-2025-2",
    //   name: "2025 Full Test 2",
    //   description: "Complete full-length test for 2025 pattern",
    //   duration: 10800,
    //   category: "full_tests_2025",
    //   course: "foundation",
    //   questions: placeholderQuestions,
    // },
];
