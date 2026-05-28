import { UserAccount } from '../../types';

// ==========================================
// 🔀 MULTI COURSE STUDENTS
// Use this list when one student needs access to multiple paid courses.
// ==========================================
export const multiCourseStudents: UserAccount[] = [
  {
    email: 'student789@gmail.com',
    password: 'pass123',
    role: 'student',
    approved: true,
    courses: ['foundation', 'nata_2026'],
  },
  {
    email: 'student500@gmail.com',
    password: 'pass123',
    role: 'student',
    approved: true,
    courses: ['nata_2026'],
  },
  
];

