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
  { email: 'akshaymoghe5@gmail.com', password: 'Sweetakshay', role: 'student', approved: true },
  { email: 'akshaymoghe8@gmail.com', password: 'Sweetavinash', role: 'student', approved: true },
  { email: 'archinuzhatkhan@gmail.com', password: 'archi@123', role: 'student', approved: true },
{ email: 'arrek58@gmail.com', password: 'mock2468', role: 'student', approved: true },
{ email: 'adityabaranwal317@gmail.com', password: 'Aditya@317', role: 'student', approved: true },
{ email: 'Shivyarawat48@gmail.com', password: 'Shivya123', role: 'student', approved: true },
{ email: 'ankitaayadavv003@gmail.com', password: 'Anki123', role: 'student', approved: true },
{ email: 'chikukedkar@gmail.com', password: 'Atharv@kedkar', role: 'student', approved: true },
{ email: 'soban.skn@gmail.com', password: 'Arhama123', role: 'student', approved: true },
{ email: 'atanishka.0908@gmail.com', password: 'Tanishka@1572', role: 'student', approved: true },
{ email: 'maghnenwalo@gmail.com', password: 'Qwertyuiop1234567890', role: 'student', approved: true },
{ email: 'arohi087149@gmail.com', password: 'Test@123', role: 'student', approved: true },
{ email: 'Suruchigupta594@gmail.com', password: 'S.gupta123 ', role: 'student', approved: true },
{ email: 'anand147nikhil@gmail.com', password: 'Nikhil@2006', role: 'student', approved: true },
{ email: 'itsmename521@gmail.com', password: 'nid123', role: 'student', approved: true },
{ email: 'mridhulprabhakaran@gmail.com', password: 'MaestroMridhul ', role: 'student', approved: true },
{ email: 'Pranitamore2202@gmail.com', password: 'Test123', role: 'student', approved: true },
{ email: 'padmapatil0701@gmail.com', password: '12345', role: 'student', approved: true },
{ email: 'kumawatkritika51@gmail.com', password: '123', role: 'student', approved: true },
{ email: 'aneeshamankala@gmail.com', password: 'Mocktest@6859', role: 'student', approved: true },
{ email: 'Emawat30@gmail.com', password: '8937020083', role: 'student', approved: true },
{ email: 'heeyabedi@gmail.com', password: 'hamdan', role: 'student', approved: true },
{ email: 'zaid96286@gmail.com', password: 'zaid0025', role: 'student', approved: true },
{ email: 'saloni.rpvv@gmail.com', password: 'Saloni$123', role: 'student', approved: true },
{ email: 'rishuthakur20043@gmail.com', password: 'Test12#1', role: 'student', approved: true },
{ email: 'ka9953364@gmail.com', password: 'Test123', role: 'student', approved: true },
{ email: 'Shivani.kumari4672@gmail.com', password: 'Shivani', role: 'student', approved: true },
{ email: 'ramnareshsinghyadav71694@gmail.com', password: 'akshay@2007', role: 'student', approved: true },
{ email: 'dhatrisrungarapu@gmail.com', password: 'b arch 2026', role: 'student', approved: true },
{ email: 'kolamkarprachi@gmail.com', password: 'Prachi112', role: 'student', approved: true },
{ email: 'Moresharvarianil@gmail.com', password: 'Testmock.1', role: 'student', approved: true },
{ email: 'krishgautam181106@gmail.com', password: 'krish@123', role: 'student', approved: true },
{ email: 'punarvyammu@gmail.com', password: 'Ammu0709', role: 'student', approved: true },
{ email: 'sudiksha8207@gmail.com', password: 'Mock7392 ', role: 'student', approved: true },
{ email: 'dollysen6767@gmail.com', password: 'test123', role: 'student', approved: true },
{ email: 'riddhishivangsiddhi@gmail.com', password: '12345', role: 'student', approved: true },
{ email: 'Shahsmit011@gmail.com', password: 'Smit919', role: 'student', approved: true },
{ email: 'mdkaif110107@gmail.com', password: 'Mdkaif1234@#', role: 'student', approved: true },
{ email: 'hrishitdubey368@gmail.com', password: '1234567890', role: 'student', approved: true },
{ email: 'piyush.vadnere12@gmail.com', password: '12344321', role: 'student', approved: true },
{ email: 'bhawarnav09@gmail.com', password: 'test123', role: 'student', approved: true },
{ email: 'harshar2101@gmail.com', password: 'Test123', role: 'student', approved: true },
{ email: 'cheranmaradani89@gmail.com', password: 'mock@123', role: 'student', approved: true },
{ email: 'mnandan007@gmail.com', password: 'Nandan@123', role: 'student', approved: true },
{ email: 'madanramdasshinde@gmail.com', password: 'Google@2016', role: 'student', approved: true },
{ email: 'mehvishahmed343@gmail.com', password: 'Mehwishahmed343', role: 'student', approved: true },
{ email: 'chandanrajgupta754@gmail.com', password: 'Mission@2026', role: 'student', approved: true },
{ email: 'saiko3389@gmail.com', password: 'rsk429', role: 'student', approved: true },
{ email: 'anushagupta1508@gmail.com', password: 'ANU123', role: 'student', approved: true },
{ email: 'tushar0001593@gmail.com', password: 'Tushar#123', role: 'student', approved: true },
{ email: 'mahathichindukuru122@gmail.com', password: 'Mahi', role: 'student', approved: true },
{ email: 'shrutiy831@gmail.com', password: 'Shruti@27', role: 'student', approved: true },
{ email: 'kirtikanttiwari@gmail.com', password: 'Kant1612', role: 'student', approved: true },
{ email: 'kumaridivya8092@gmail.com', password: 'Divya123', role: 'student', approved: true },
{ email: 'rishuthakur20043@gmail.com', password: 'Test123', role: 'student', approved: true },
{ email: 'aditimutha24@gmail.com', password: 'aditi123', role: 'student', approved: true },
{ email: '2003alkasharma@gmail.com', password: 'Mock7392 ', role: 'student', approved: true },
{ email: 'motionog20@gmail.com', password: 'Aansh20', role: 'student', approved: true },
{ email: 'ramnareshsinghyadav71694@gmail.com', password: 'akshay@2007', role: 'student', approved: true },
{ email: 'pinkyojha7079700805@gmail.com', password: 'Saloni@123', role: 'student', approved: true },
{ email: 'saanvigoel08@gmail.com', password: 'saanvi08', role: 'student', approved: true },
{ email: 'sovitchhatri34@gmail.com', password: 'sovit@27', role: 'student', approved: true },
{ email: 'rubalkaur495@gmail.com', password: 'Rubal02', role: 'student', approved: true },
{ email: 'amit4081007@gmail.com', password: '12345678', role: 'student', approved: true },
{ email: 'guptakansha14@gmail.com', password: 'S.gupta123', role: 'student', approved: true },
  { email: 'student1@gmail.com', password: 'pass123', role: 'student', approved: true },
  { email: 'student2@gmail.com', password: 'pass123', role: 'student', approved: true },
{ email: 'student3@gmail.com', password: 'pass123', role: 'student', approved: true },
  { email: 'student4@gmail.com', password: 'pass123', role: 'student', approved: true },
  { email: 'student5@gmail.com', password: 'pass123', role: 'student', approved: true },
{ email: 'aadityak.8109@gmail.com', password: 'Aaditya#₹08', role: 'student', approved: true },
  { email: 'maghnennana@gmail.com', password: '1234567890', role: 'student', approved: true },
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














