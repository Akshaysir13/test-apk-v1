// src/contexts/AuthContext.tsx - ALL IN ONE VERSION
import { createContext, useContext, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
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
    
    const combined = fingerprint + screen + nav;
    return hashString(combined);
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
  const [accounts, setAccounts] = useState<UserAccount[]>(initialAccounts);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Device validation function
  const validateDevice = async (userEmail: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('🔵 DEVICE: Starting validation for:', userEmail);
      
      let deviceId = getStoredDeviceId();
      
      if (!deviceId) {
        deviceId = generateDeviceId();
        setStoredDeviceId(deviceId);
        console.log('🔵 DEVICE: Generated new device ID:', deviceId);
      } else {
        console.log('🔵 DEVICE: Using stored device ID:', deviceId);
      }

      console.log('🔵 DEVICE: Querying Supabase...');
      
      // Check if this device is registered for this user
      const { data: existingDevice, error: fetchError } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_email', userEmail)
        .single();

      console.log('🔵 DEVICE: Supabase response:', { existingDevice, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ DEVICE: Fetch error:', fetchError);
        throw fetchError;
      }

      // No device registered yet - register this one
      if (!existingDevice) {
        console.log('🔵 DEVICE: No device found, registering new one...');
        
        const { error: insertError } = await supabase
          .from('user_devices')
          .insert({
            user_email: userEmail,
            device_id: deviceId,
            device_type: deviceId.startsWith('web_') ? 'web' : 'android',
            device_info: {
              userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'android',
              screen: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'mobile'
            }
          });

        if (insertError) {
          console.error('❌ DEVICE: Insert error:', insertError);
          throw insertError;
        }

        console.log('✅ DEVICE: Device registered successfully');
        return {
          success: true,
          message: 'Device registered successfully'
        };
      }

      // Device already registered - check if it matches
      if (existingDevice.device_id === deviceId) {
        console.log('✅ DEVICE: Device ID matches, updating last active...');
        
        // Update last active time
        await supabase
          .from('user_devices')
          .update({ last_active: new Date().toISOString() })
          .eq('user_email', userEmail);

        console.log('✅ DEVICE: Device validated successfully');
        return {
          success: true,
          message: 'Device validated'
        };
      }

      // Different device trying to login
      console.log('❌ DEVICE: Device mismatch!', {
        stored: existingDevice.device_id,
        current: deviceId
      });
      
      return {
        success: false,
        message: 'This account is already registered on another device. Please contact admin to reset your device.'
      };

    } catch (error) {
      console.error('❌ DEVICE: Validation error:', error);
      return {
        success: false,
        message: 'Device validation failed'
      };
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    console.log('🔵 LOGIN: Starting login process', { email, password });
    
    const normalizedEmail = email.trim().toLowerCase();
    const user = accounts.find(
      acc => acc.email.toLowerCase() === normalizedEmail && acc.password === password
    );
    
    console.log('🔵 LOGIN: User found?', user ? 'YES' : 'NO', user);
    
    if (user) {
      // Check if student account is approved
      if (user.role === 'student' && !user.approved) {
        console.log('❌ LOGIN: Student not approved');
        return { success: false, message: 'Your account is pending admin approval. Please wait for the administrator to approve your account.' };
      }

      // Validate device for students (skip for admin)
      if (user.role === 'student') {
        console.log('🔵 LOGIN: Validating device for student:', user.email);
        const deviceCheck = await validateDevice(user.email);
        console.log('🔵 LOGIN: Device check result:', deviceCheck);
        
        if (!deviceCheck.success) {
          console.log('❌ LOGIN: Device validation failed');
          return { 
            success: false, 
            message: deviceCheck.message || 'Device validation failed' 
          };
        }
        console.log('✅ LOGIN: Device validation passed');
      } else {
        console.log('🔵 LOGIN: Admin login, skipping device check');
      }

      console.log('✅ LOGIN: Setting authenticated state');
      setIsAuthenticated(true);
      setCurrentUser(user);
      console.log('✅ LOGIN: Login successful!');
      return { success: true, message: 'Login successful', isAdmin: user.role === 'admin' };
    }
    
    console.log('❌ LOGIN: Invalid credentials');
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addStudent = (email: string, password: string, autoApprove: boolean = false): { success: boolean; message: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      return { success: false, message: 'Please enter both email and password' };
    }
    if (accounts.some(acc => acc.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'This email already exists' };
    }
    const newStudent: UserAccount = { 
      email: email.trim(), 
      password: password.trim(), 
      role: 'student',
      approved: autoApprove
    };
    setAccounts(prev => [...prev, newStudent]);
    if (autoApprove) {
      return { success: true, message: `Student ${normalizedEmail} added and approved successfully!` };
    }
    return { success: true, message: `Student ${normalizedEmail} registered. Pending admin approval.` };
  };

  const deleteStudent = (email: string) => {
    setAccounts(prev => prev.filter(acc => acc.email !== email));
  };

  const approveStudent = (email: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.email === email ? { ...acc, approved: true } : acc
    ));
  };

  const rejectStudent = (email: string) => {
    setAccounts(prev => prev.filter(acc => acc.email !== email));
  };

  const getPendingStudents = () => {
    return accounts.filter(acc => acc.role === 'student' && !acc.approved);
  };

  const getApprovedStudents = () => {
    return accounts.filter(acc => acc.role === 'student' && acc.approved);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      accounts,
      login,
      logout,
      addStudent,
      deleteStudent,
      approveStudent,
      rejectStudent,
      getPendingStudents,
      getApprovedStudents,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}