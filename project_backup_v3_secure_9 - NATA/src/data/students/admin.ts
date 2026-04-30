import { UserAccount } from '../../types';

// ==========================================
// 👑 ADMIN ACCOUNTS
// ==========================================

export const adminAccounts: UserAccount[] = [
  { 
    email: 'admin@jee.com', 
    password: 'admin123', 
    role: 'admin', 
    approved: true,
    courses: ['foundation', 'rank_booster', 'dheya']
  },
];