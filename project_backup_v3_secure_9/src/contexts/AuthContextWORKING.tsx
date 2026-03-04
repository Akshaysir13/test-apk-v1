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
  // Fallback to random string if crypto.randomUUID is not available
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
  // 🔍 SUPER DETAILED DEVICE VALIDATION
  // ==========================================
  const validateDevice = async (email: string) => {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║          DEVICE VALIDATION STARTING                        ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('📧 Email:', email);

    try {
      // STEP 1: Get/Generate Device ID
      let deviceId = getStoredDeviceId();
      console.log('\n[STEP 1] Device ID Check');
      console.log('  └─ Stored Device ID:', deviceId || 'NULL');

      if (!deviceId) {
        deviceId = generateDeviceId();
        console.log('  └─ Generated New Device ID:', deviceId);
        setStoredDeviceId(deviceId);
        console.log('  └─ Saved to localStorage ✓');
      } else {
        console.log('  └─ Using Existing Device ID ✓');
      }

      // STEP 2: Query existing device for THIS USER
      console.log('\n[STEP 2] Querying user_devices table for this user');
      console.log('  └─ SELECT * FROM user_devices WHERE user_email =', email);

      const { data: existingDevice, error: selectError } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_email', email)
        .maybeSingle();

      console.log('  └─ Query completed');
      console.log('  └─ Error:', selectError ? 'YES' : 'NO');
      console.log('  └─ Data:', existingDevice ? 'FOUND' : 'NULL');

      if (selectError) {
        console.error('\n❌ SELECT ERROR DETAILS:');
        console.error('  Code:', selectError.code);
        console.error('  Message:', selectError.message);
        console.error('  Details:', selectError.details);
        console.error('  Hint:', selectError.hint);
        throw selectError;
      }

      // STEP 3: Check if THIS DEVICE is registered to ANY USER
      console.log('\n[STEP 3] Checking if this device is registered to any user');
      console.log('  └─ SELECT * FROM user_devices WHERE device_id =', deviceId);

      const { data: deviceOwner, error: deviceError } = await supabase
        .from('user_devices')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();

      console.log('  └─ Query completed');
      console.log('  └─ Error:', deviceError ? 'YES' : 'NO');
      console.log('  └─ Device owner found:', deviceOwner ? 'YES' : 'NO');

      if (deviceOwner) {
        console.log('  └─ Device is registered to:', deviceOwner.user_email);
      }

      if (deviceError) {
        console.error('\n❌ DEVICE CHECK ERROR:');
        console.error('  Code:', deviceError.code);
        console.error('  Message:', deviceError.message);
        throw deviceError;
      }

      // STEP 4: Handle different scenarios
      if (existingDevice && deviceOwner) {
        // User has a device AND this device has an owner
        if (existingDevice.user_email === email && deviceOwner.user_email === email) {
          // Same user, same device - UPDATE
          console.log('\n[STEP 4A] Same user, same device - Updating last_active');
          const updateData = { last_active: new Date().toISOString() };

          const { data: updateResult, error: updateError } = await supabase
            .from('user_devices')
            .update(updateData)
            .eq('user_email', email)
            .select();

          if (updateError) {
            console.error('\n⚠️ UPDATE ERROR (non-fatal):', updateError);
          } else {
            console.log('  └─ Last active updated ✓');
          }
        } else {
          // Different device or device belongs to someone else
          console.log('\n[STEP 4B] CONFLICT DETECTED');
          console.log('  └─ User registered device:', existingDevice.device_id);
          console.log('  └─ Current device:', deviceId);
          console.log('  └─ This device belongs to:', deviceOwner.user_email);
          console.log('╚═══════════════════════════════════════════════════════════╝\n');
          return {
            success: false,
            message: 'This account is already registered on another device. Please contact support to switch devices.'
          };
        }
      } else if (deviceOwner && deviceOwner.user_email !== email) {
        // This device belongs to ANOTHER user
        console.log('\n[STEP 4C] Device already registered to another user');
        console.log('  └─ Device owner:', deviceOwner.user_email);
        console.log('  └─ Current user:', email);
        console.log('╚═══════════════════════════════════════════════════════════╝\n');
        return {
          success: false,
          message: 'This device is already registered to another account. Each device can only be used with one account.'
        };
      } else if (existingDevice && !deviceOwner) {
        // User has a different device registered, this device is free
        console.log('\n[STEP 4D] User has different device registered');
        console.log('  └─ Registered device:', existingDevice.device_id);
        console.log('  └─ Current device:', deviceId);
        console.log('╚═══════════════════════════════════════════════════════════╝\n');
        return {
          success: false,
          message: 'This account is already registered on another device. Please contact support to switch devices.'
        };
      } else {
        // No conflicts - Register new device
        console.log('\n[STEP 4E] No conflicts - Registering new device');
        const insertData = {
          user_email: email,
          device_id: deviceId,
          device_type: deviceId.startsWith('web_') ? 'web' : 'android',
          last_active: new Date().toISOString()
        };

        console.log('  └─ INSERT INTO user_devices:');
        console.log('     ├─ user_email:', insertData.user_email);
        console.log('     ├─ device_id:', insertData.device_id);
        console.log('     ├─ device_type:', insertData.device_type);
        console.log('     └─ last_active:', insertData.last_active);

        const { data: insertResult, error: insertError } = await supabase
          .from('user_devices')
          .insert(insertData)
          .select();

        console.log('  └─ Insert completed');
        console.log('  └─ Error:', insertError ? 'YES' : 'NO');
        console.log('  └─ Result:', insertResult);

        if (insertError) {
          console.error('\n❌ INSERT ERROR DETAILS:');
          console.error('  Code:', insertError.code);
          console.error('  Message:', insertError.message);
          console.error('  Details:', insertError.details);
          console.error('  Hint:', insertError.hint);
          throw insertError;
        }

        console.log('  └─ Device registered successfully ✓');
      }

      console.log('\n✅ DEVICE VALIDATION SUCCESSFUL');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
      return { success: true };

    } catch (err) {
      console.error('\n❌ UNEXPECTED ERROR IN VALIDATION');
      console.error('Error Type:', err?.constructor?.name);
      console.error('Error Message:', err instanceof Error ? err.message : 'Unknown');
      console.error('Full Error:', err);
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
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
    console.log('\n🔐 LOGIN ATTEMPT');
    console.log('Email:', email);

    const normalizedEmail = email.trim().toLowerCase();

    const user = accounts.find(
      acc => acc.email.toLowerCase() === normalizedEmail && acc.password === password
    );

    if (!user) {
      console.log('⚠️ User not found in database - Assuming NEW/FREE STUDENT');
      // Create a temporary user object for this session
      const freeUser: UserAccount = {
        email: normalizedEmail,
        password: password, // Store entered password for this session
        role: 'student',
        approved: true, // Auto-approve for free tests
        courses: ['free_tests'] // Special flag for free tests
      };

      console.log('✅ Temporary Free User Created:', freeUser.email);

      // Proceed with this user
      setIsAuthenticated(true);
      setCurrentUser(freeUser);

      // Save session just like normal users
      try {
        let deviceId = getStoredDeviceId();
        if (!deviceId) {
          deviceId = generateDeviceId();
          setStoredDeviceId(deviceId);
        }

        await supabase.from('user_sessions').upsert({
          user_email: freeUser.email,
          device_id: deviceId,
          session_data: JSON.stringify({
            email: freeUser.email,
            role: freeUser.role,
            courses: freeUser.courses,
            approved: freeUser.approved
          }),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }, { onConflict: 'user_email,device_id' });
      } catch (err) {
        console.error('Session save error for free user:', err);
      }

      console.log('traffic routing to free tests');
      navigate('/free-tests', { replace: true });
      return { success: true, message: 'Welcome to Free Tests' };
    }

    console.log('✅ User found');
    console.log('  └─ Email:', user.email);
    console.log('  └─ Role:', user.role);
    console.log('  └─ Courses:', user.courses);
    console.log('  └─ Approved:', user.approved);

    if (user.role === 'student' && !user.approved) {
      console.log('❌ Account not approved');
      return { success: false, message: 'Account pending approval' };
    }

    // ==========================================
    // 🔒 DEVICE VALIDATION FOR PAID COURSES
    // ==========================================
    if (user.role === 'student' && user.courses && user.courses.length > 0) {
      // Define all possible variations of course names
      const paidCourses = [
        'foundation', 'Foundation', 'FOUNDATION',
        'rank_booster', 'rank-booster', 'rankBooster', 'Rank Booster', 'RANK_BOOSTER',
        'advance_2026', 'advance-2026', 'advance2026', 'Advance 2026', 'ADVANCE_2026'
      ];

      // Check if user has any paid course (case-insensitive, flexible matching)
      const hasPaidCourse = user.courses.some(course => {
        const normalizedCourse = course.toLowerCase().replace(/[-_\s]/g, '');
        return paidCourses.some(paid => paid.toLowerCase().replace(/[-_\s]/g, '') === normalizedCourse);
      });

      console.log('\n💳 Course Check:');
      console.log('  └─ User courses (raw):', JSON.stringify(user.courses));
      console.log('  └─ User courses (normalized):', user.courses.map(c => c.toLowerCase().replace(/[-_\s]/g, '')));
      console.log('  └─ Has paid course:', hasPaidCourse);

      if (hasPaidCourse) {
        console.log('  └─ ✅ Device validation REQUIRED (paid course detected)');
        const deviceCheck = await validateDevice(user.email);

        if (!deviceCheck.success) {
          console.log('❌ Device validation FAILED');
          return { success: false, message: deviceCheck.message! };
        }
        console.log('✅ Device validation PASSED');
      } else {
        console.log('  └─ 🆓 Free course (Dheya) - device validation SKIPPED');
      }
    } else {
      console.log('\n⚠️ Skipping device validation:');
      console.log('  └─ Role:', user.role);
      console.log('  └─ Courses:', user.courses);
      console.log('  └─ Courses length:', user.courses?.length || 0);
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

      console.log('\n💾 Saving session to user_sessions...');

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
    console.log('\n🚦 Routing to dashboard...');
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

    console.log('✅ LOGIN SUCCESSFUL\n');
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
