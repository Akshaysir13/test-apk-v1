import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserAccount } from '../types';

// ==========================================
// 📦 IMPORT ALL STUDENT ACCOUNTS
// ==========================================
import { adminAccounts } from '../data/students/admin';
import { foundationStudents } from '../data/students/foundation-students';
import { rankBoosterStudents } from '../data/students/rank-booster-students';
import { dheyaStudents } from '../data/students/dheya-students';
import { advance2026Students } from '../data/students/advance-2026-students';

// ==========================================
// 🔗 SUPABASE SETUP
// ==========================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 📱 DEVICE ID HELPERS
// ==========================================
function generateDeviceId(): string {
  if (typeof window === 'undefined') return '';

  // Generate a random unique ID (UUID v4)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return 'web_' + crypto.randomUUID();
  }

  // Fallback for older environments
  const randomPart = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return 'web_' + randomPart;
}

const getStoredDeviceId = () => localStorage.getItem('secure_device_id');
const setStoredDeviceId = (id: string) => localStorage.setItem('secure_device_id', id);

// ==========================================
// 👥 COMBINED ACCOUNTS
// ==========================================
const initialAccounts: UserAccount[] = [
  ...adminAccounts,
  ...foundationStudents,
  ...rankBoosterStudents,
  ...dheyaStudents,
  ...advance2026Students,
];

// ==========================================
// 🧠 CONTEXT TYPES
// ==========================================
interface LoginResult {
  success: boolean;
  message: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  addStudent: (email: string, password: string, autoApprove?: boolean) => { success: boolean; message: string };
  deleteStudent: (email: string) => void;
  approveStudent: (email: string) => void;
  rejectStudent: (email: string) => void;
  getPendingStudents: () => UserAccount[];
  getApprovedStudents: () => UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==========================================
// 🚀 PROVIDER
// ==========================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [accounts] = useState<UserAccount[]>(initialAccounts);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // ==========================================
  // 🔄 RESTORE SESSION ON MOUNT
  // ==========================================
  useEffect(() => {
    async function restoreSession() {
      try {
        const deviceId = getStoredDeviceId();

        if (!deviceId) {
          console.log('No device ID found');
          setIsCheckingSession(false);
          return;
        }

        console.log('Checking for session with device:', deviceId);

        // Check if this device has a valid session
        const { data, error } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('device_id', deviceId)
          .maybeSingle();

        if (error) {
          console.error('Session check error:', error);
          setIsCheckingSession(false);
          return;
        }

        if (!data) {
          console.log('No session found');
          setIsCheckingSession(false);
          return;
        }

        console.log('Session found:', data);

        // Check if session expired
        const expiresAt = new Date(data.expires_at);
        if (expiresAt < new Date()) {
          console.log('Session expired');
          // Expired - clean it up
          await supabase
            .from('user_sessions')
            .delete()
            .eq('device_id', deviceId);
          setIsCheckingSession(false);
          return;
        }

        // Valid session found - restore user
        const sessionData = JSON.parse(data.session_data);
        const user: UserAccount = {
          email: sessionData.email,
          password: '', // Don't store password
          role: sessionData.role,
          courses: sessionData.courses,
          approved: sessionData.approved
        };

        console.log('Restoring user:', user.email);

        setIsAuthenticated(true);
        setCurrentUser(user);

        // Navigate to appropriate dashboard
        const currentPath = window.location.pathname;
        if (currentPath === '/login' || currentPath === '/') {
          if (user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else if (user.courses?.includes('advance_2026')) {
            navigate('/dashboard/advance-2026', { replace: true });
          } else if (user.courses?.includes('foundation')) {
            navigate('/dashboard/foundation', { replace: true });
          } else if (user.courses?.includes('rank_booster')) {
            navigate('/dashboard/rank-booster', { replace: true });
          } else {
            navigate('/dashboard/dheya', { replace: true });
          }
        }

      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setIsCheckingSession(false);
      }
    }

    restoreSession();
  }, [navigate]);

  // ==========================================
  // 🔐 DEVICE VALIDATION
  // ==========================================
  const validateDevice = async (email: string) => {
    try {
      let deviceId = getStoredDeviceId();
      if (!deviceId) {
        deviceId = generateDeviceId();
        setStoredDeviceId(deviceId);
      }

      const { data, error } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        await supabase.from('user_devices').insert({
          user_email: email,
          device_id: deviceId,
          device_type: deviceId.startsWith('web_') ? 'web' : 'android',
        });
        return { success: true };
      }

      if (data.device_id === deviceId) {
        await supabase
          .from('user_devices')
          .update({ last_active: new Date().toISOString() })
          .eq('user_email', email);
        return { success: true };
      }

      return { success: false, message: 'Account already used on another device' };
    } catch {
      return { success: false, message: 'Device validation failed' };
    }
  };

  // ==========================================
  // 🔑 LOGIN
  // ==========================================
  const login = async (email: string, password: string): Promise<LoginResult> => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = accounts.find(
      acc => acc.email.toLowerCase() === normalizedEmail && acc.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    if (user.role === 'student' && !user.approved) {
      return { success: false, message: 'Account pending approval' };
    }

    if (user.role === 'student') {
      const deviceCheck = await validateDevice(user.email);
      if (!deviceCheck.success) {
        return { success: false, message: deviceCheck.message! };
      }
    }

    setIsAuthenticated(true);
    setCurrentUser(user);

    // 💾 SAVE SESSION TO SUPABASE
    try {
      let deviceId = getStoredDeviceId();
      if (!deviceId) {
        deviceId = generateDeviceId();
        setStoredDeviceId(deviceId);
      }

      console.log('Saving session for:', user.email, 'device:', deviceId);

      const { error } = await supabase.from('user_sessions').upsert({
        user_email: user.email,
        device_id: deviceId,
        session_data: JSON.stringify({
          email: user.email,
          role: user.role,
          courses: user.courses,
          approved: user.approved
        }),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }, {
        onConflict: 'user_email,device_id'
      });

      if (error) {
        console.error('Failed to save session:', error);
      } else {
        console.log('Session saved successfully');
      }
    } catch (err) {
      console.error('Failed to save session:', err);
      // Continue anyway - user can still use the app
    }

    // 🚦 ROUTING
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (user.courses?.includes('advance_2026')) {
      navigate('/dashboard/advance-2026', { replace: true });
    } else if (user.courses?.includes('foundation')) {
      navigate('/dashboard/foundation', { replace: true });
    } else if (user.courses?.includes('rank_booster')) {
      navigate('/dashboard/rank-booster', { replace: true });
    } else {
      navigate('/dashboard/dheya', { replace: true });
    }

    return { success: true, message: 'Login successful', isAdmin: user.role === 'admin' };
  };

  // ==========================================
  // 🚪 LOGOUT
  // ==========================================
  const logout = () => {
    // 🗑️ DELETE SESSION FROM SUPABASE
    const deviceId = getStoredDeviceId();
    if (deviceId && currentUser) {
      supabase
        .from('user_sessions')
        .delete()
        .eq('user_email', currentUser.email)
        .eq('device_id', deviceId)
        .then(() => console.log('Session cleared'))
        .catch(err => console.error('Failed to clear session:', err));
    }

    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        accounts,
        login,
        logout,
        addStudent: () => ({ success: true, message: 'Not implemented' }),
        deleteStudent: () => { },
        approveStudent: () => { },
        rejectStudent: () => { },
        getPendingStudents: () => [],
        getApprovedStudents: () => [],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// 🎣 HOOK
// ==========================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
