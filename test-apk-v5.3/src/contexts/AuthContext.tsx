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
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'web_' + Math.abs(hash).toString(36);
}

function generateDeviceId(): string {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }

  const fingerprint = canvas.toDataURL();
  const screen = `${window.screen.width}x${window.screen.height}`;
  const nav = navigator.userAgent + navigator.language;

  return hashString(fingerprint + screen + nav);
}

const getStoredDeviceId = () => localStorage.getItem('device_id');
const setStoredDeviceId = (id: string) => localStorage.setItem('device_id', id);

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

        const expiresAt = new Date(data.expires_at);
        if (expiresAt < new Date()) {
          console.log('Session expired');
          await supabase
            .from('user_sessions')
            .delete()
            .eq('device_id', deviceId);
          setIsCheckingSession(false);
          return;
        }

        const sessionData = JSON.parse(data.session_data);
        const user: UserAccount = {
          email: sessionData.email,
          password: '',
          role: sessionData.role,
          courses: sessionData.courses,
          approved: sessionData.approved
        };

        console.log('Restoring user:', user.email);

        setIsAuthenticated(true);
        setCurrentUser(user);

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
  // 🔍 FIXED DEVICE VALIDATION - USES UPSERT
  // ==========================================
  const validateDevice = async (email: string) => {
    try {
      let deviceId = getStoredDeviceId();
      if (!deviceId) {
        deviceId = generateDeviceId();
        setStoredDeviceId(deviceId);
      }

      console.log('🔍 Validating device for:', email);
      console.log('   Device ID:', deviceId);

      // Check if user already has a registered device
      const { data: existingDevice, error: selectError } = await supabase
        .from('user_devices')
        .select('device_id')
        .eq('user_email', email)
        .maybeSingle();

      if (selectError) {
        console.error('❌ Query error:', selectError);
        throw selectError;
      }

      // If device exists and doesn't match, block login
      if (existingDevice && existingDevice.device_id !== deviceId) {
        console.log('❌ Different device detected');
        console.log('   Registered:', existingDevice.device_id);
        console.log('   Current:', deviceId);
        return {
          success: false,
          message: 'This account is already registered on another device. Please contact support to switch devices.'
        };
      }

      // Use UPSERT to insert or update
      console.log('💾 Upserting device record...');
      const { error: upsertError } = await supabase
        .from('user_devices')
        .upsert({
          user_email: email,
          device_id: deviceId,
          device_type: deviceId.startsWith('web_') ? 'web' : 'android',
          last_active: new Date().toISOString()
        }, {
          onConflict: 'user_email'
        });

      if (upsertError) {
        console.error('❌ Upsert error:', upsertError);
        throw upsertError;
      }

      console.log('✅ Device validated successfully');
      return { success: true };

    } catch (err) {
      console.error('❌ Device validation error:', err);
      return {
        success: false,
        message: `Device validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      };
    }
  };

  // ==========================================
  // 🔐 LOGIN
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

    // ==========================================
    // 🔒 DEVICE VALIDATION FOR PAID COURSES
    // ==========================================
    if (user.role === 'student' && user.courses && user.courses.length > 0) {
      const paidCourses = ['foundation', 'rank_booster', 'advance_2026'];
      const hasPaidCourse = user.courses.some(course => paidCourses.includes(course));
      
      console.log('👤 User:', user.email);
      console.log('📚 Courses:', user.courses);
      console.log('💳 Has paid course:', hasPaidCourse);
      
      if (hasPaidCourse) {
        console.log('💳 Validating device...');
        const deviceCheck = await validateDevice(user.email);
        if (!deviceCheck.success) {
          return { success: false, message: deviceCheck.message! };
        }
        console.log('✅ Device validation passed');
      } else {
        console.log('🆓 Free course - skipping device validation');
      }
    }

    setIsAuthenticated(true);
    setCurrentUser(user);

    // 💾 SAVE SESSION
    try {
      let deviceId = getStoredDeviceId();
      if (!deviceId) {
        deviceId = generateDeviceId();
        setStoredDeviceId(deviceId);
      }

      console.log('💾 Saving session...');

      const { error } = await supabase.from('user_sessions').upsert({
        user_email: user.email,
        device_id: deviceId,
        session_data: JSON.stringify({
          email: user.email,
          role: user.role,
          courses: user.courses,
          approved: user.approved
        }),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }, {
        onConflict: 'user_email,device_id'
      });

      if (error) {
        console.error('❌ Session save error:', error);
      } else {
        console.log('✅ Session saved');
      }
    } catch (err) {
      console.error('❌ Session error:', err);
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
    const deviceId = getStoredDeviceId();
    if (deviceId && currentUser) {
      supabase
        .from('user_sessions')
        .delete()
        .eq('user_email', currentUser.email)
        .eq('device_id', deviceId)
        .then(() => console.log('✅ Session cleared'))
        .catch(err => console.error('❌ Failed to clear session:', err));
    }

    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

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
        deleteStudent: () => {},
        approveStudent: () => {},
        rejectStudent: () => {},
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
