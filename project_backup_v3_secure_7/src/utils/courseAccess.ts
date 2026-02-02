// src/utils/courseAccess.ts - NEW FILE TO CREATE
// This handles all access control logic

/**
 * Check if user can access a specific test based on their enrolled courses
 * @param userCourses - Array of courses user is enrolled in (e.g., ['foundation'])
 * @param testCourse - Course type of the test (e.g., 'foundation')
 * @returns true if user can access, false otherwise
 */
export function canAccessTest(
  userCourses: string[] | undefined,
  testCourse: string | undefined
): boolean {
  // Dheya tests are PUBLIC - anyone can access without login
  if (testCourse === 'dheya' || !testCourse) {
    return true;
  }

  // If user is not logged in or has no courses, can only access dheya
  if (!userCourses || userCourses.length === 0) {
    return false;
  }

  // Foundation students can access ALL tests
  if (userCourses.includes('foundation')) {
    return true;
	//return testCourse === 'foundation';
  }

  // Rank Booster students can access rank_booster + dheya tests
  if (userCourses.includes('rank_booster')) {
    //return testCourse === 'rank_booster' || testCourse === 'dheya';
	return testCourse === 'rank_booster';
  }

  return false;
}

/**
 * Get course display information
 */
export function getCourseInfo(course: string) {
  const courseData: Record<string, any> = {
    foundation: {
      name: '💎 Foundation Course',
      price: '₹6,000',
      description: 'Complete access to all 80+ tests'
    },
    rank_booster: {
      name: '🚀 Rank Booster Course',
      price: '₹99',
      description: 'Access to selected premium tests'
    },
    dheya: {
      name: '📚 Dheya Course',
      price: 'Free',
      description: '🌐 PUBLIC - No login required!'
    }
  };
  return courseData[course] || { name: course, price: '', description: '' };
}

/**
 * Check if test should show lock icon
 */
export function isTestLocked(
  userCourses: string[] | undefined,
  testCourse: string | undefined
): boolean {
  return !canAccessTest(userCourses, testCourse);
}