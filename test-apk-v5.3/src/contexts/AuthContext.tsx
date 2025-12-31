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
  // Replace the restoreSession function (Lines 110-186)
useEffect(() => {
  async function restoreSession() {
    try {
      console.log('🔍 Starting session restore...');
      const deviceId = getStoredDeviceId();
      
      if (!deviceId) {
        console.log('❌ No device ID found in localStorage');
        setIsCheckingSession(false);
        return;
      }

      console.log('✅ Device ID found:', deviceId);
      console.log('🔍 Checking Supabase for session...');

      // Check if this device has a valid session
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (error) {
        console.error('❌ Session check error:', error);
        setIsCheckingSession(false);
        return;
      }

      if (!data) {
        console.log('❌ No session found in Supabase');
        setIsCheckingSession(false);
        return;
      }

      console.log('✅ Session found in Supabase:', data);

      // Check if session expired
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      console.log('🕐 Session expires at:', expiresAt);
      console.log('🕐 Current time:', now);
      
      if (expiresAt < now) {
        console.log('❌ Session expired');
        // Expired - clean it up
        await supabase
          .from('user_sessions')
          .delete()
          .eq('device_id', deviceId);
        setIsCheckingSession(false);
        return;
      }

      console.log('✅ Session is valid');

      // Valid session found - restore user
      const sessionData = JSON.parse(data.session_data);
      const user: UserAccount = {
        email: sessionData.email,
        password: '',
        role: sessionData.role,
        courses: sessionData.courses,
        approved: sessionData.approved
      };

      console.log('✅ Restoring user:', user.email);
      console.log('👤 User role:', user.role);
      console.log('📚 User courses:', user.courses);

      setIsAuthenticated(true);
      setCurrentUser(user);

      // Navigate to appropriate dashboard
      const currentPath = window.location.pathname;
      console.log('🛣️ Current path:', currentPath);
      
      if (currentPath === '/login' || currentPath === '/' || currentPath === '/free-tests') {
        console.log('🚀 Navigating to dashboard...');
        
        if (user.role === 'admin') {
          console.log('➡️ Navigating to /admin');
          navigate('/admin', { replace: true });
        } else if (user.courses?.includes('advance_2026')) {
          console.log('➡️ Navigating to /dashboard/advance-2026');
          navigate('/dashboard/advance-2026', { replace: true });
        } else if (user.courses?.includes('foundation')) {
          console.log('➡️ Navigating to /dashboard/foundation');
          navigate('/dashboard/foundation', { replace: true });
        } else if (user.courses?.includes('rank_booster')) {
          console.log('➡️ Navigating to /dashboard/rank-booster');
          navigate('/dashboard/rank-booster', { replace: true });
        } else {
          console.log('➡️ Navigating to /dashboard/dheya');
          navigate('/dashboard/dheya', { replace: true });
        }
      } else {
        console.log('✅ Already on correct page, staying put');
      }

    } catch (err) {
      console.error('❌ Failed to restore session:', err);
    } finally {
      console.log('✅ Session check complete');
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
