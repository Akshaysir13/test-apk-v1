// src/contexts/AuthContext.tsx - ALL IN ONE VERSION
import { createContext, useContext, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserAccount } from '../types';

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Device ID utilities
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'web_' + Math.abs(hash).toString(36);
}

function generateDeviceId(): string {
  if (typeof window !== 'undefined' && (window as any).androidDeviceId) {
    return (window as any).androidDeviceId;
  }

  if (typeof window !== 'undefined' && (window as any).AndroidBridge) {
    try {
      const androidId = (window as any).AndroidBridge.getDeviceId();
      if (androidId) return androidId;
    } catch (e) {
      console.error('Failed to get Android device ID:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
    }

    const fingerprint = canvas.toDataURL();
    const screen = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const nav = navigator.userAgent + navigator.language;

    return hashString(fingerprint + screen + nav);
  }

  return '';
}

function getStoredDeviceId(): string | null {
  return localStorage.getItem('device_id');
}

function setStoredDeviceId(deviceId: string): void {
  localStorage.setItem('device_id', deviceId);
}

// Auth constants
const ADMIN_EMAIL = 'admin@jee.com';
const ADMIN_PASSWORD = 'admin123';

const initialAccounts: UserAccount[] = [
  { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin', approved: true },
  { email: 'test@gmail.com', password: 'test123', role: 'student', approved: true },
];

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState<UserAccount[]>(initialAccounts);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Device validation
  const validateDevice = async (userEmail: string): Promise<{ success: boolean; message?: string }> => {
    try {
      let deviceId = getStoredDeviceId();
      if (!deviceId) {
        deviceId = generateDeviceId();
        setStoredDeviceId(deviceId);
      }

      const { data: existingDevice, error } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_email', userEmail)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!existingDevice) {
        await supabase.from('user_devices').insert({
          user_email: userEmail,
          device_id: deviceId,
          device_type: deviceId.startsWith('web_') ? 'web' : 'android',
        });
        return { success: true };
      }

      if (existingDevice.device_id === deviceId) {
        await supabase
          .from('user_devices')
          .update({ last_active: new Date().toISOString() })
          .eq('user_email', userEmail);
        return { success: true };
      }

      return { success: false, message: 'Account already used on another device' };
    } catch {
      return { success: false, message: 'Device validation failed' };
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = accounts.find(
      acc => acc.email.toLowerCase() === normalizedEmail && acc.password === password
    );

    if (!user) return { success: false, message: 'Invalid email or password' };

    if (user.role === 'student' && !user.approved) {
      return { success: false, message: 'Account pending approval' };
    }

    if (user.role === 'student') {
      const deviceCheck = await validateDevice(user.email);
      if (!deviceCheck.success) {
        return { success: false, message: deviceCheck.message || 'Device validation failed' };
      }
    }

    setIsAuthenticated(true);
    setCurrentUser(user);

    // ✅ REDIRECT FIX
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }

    return { success: true, message: 'Login successful', isAdmin: user.role === 'admin' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        accounts,
        login,
        logout,
        addStudent: () => ({ success: true, message: '' }),
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
