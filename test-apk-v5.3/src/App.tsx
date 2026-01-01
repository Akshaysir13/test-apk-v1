// src/App.tsx - UPDATED WITH TIERED DASHBOARDS

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { TestProvider, useTest } from './contexts/TestContext';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DheyaDashboard from './pages/DheyaDashboard';
import RankBoosterDashboard from './pages/RankBoosterDashboard';
import Dashboard from './pages/Dashboard'; // Foundation Dashboard
import AdvanceDashboard2026 from './pages/AdvanceDashboard2026';
import FreeTests from './pages/FreeTests';
import Test from './pages/Test';
import Results from './pages/Results';

// ==========================================
// 🔄 SESSION WATCHER COMPONENT
// ==========================================
function SessionWatcher() {
  const { isAuthenticated, currentUser } = useAuth();
  const { loadTestAttemptsFromSupabase } = useTest();

  useEffect(() => {
    console.log('🔍 Auth State Changed:');
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - currentUser:', currentUser?.email || 'null');
    console.log('  - currentPath:', window.location.pathname);

    // Load test attempts when user logs in or session restores
    if (isAuthenticated && currentUser?.email) {
      console.log('📊 Loading test attempts for:', currentUser.email);
      loadTestAttemptsFromSupabase(currentUser.email);
    }
  }, [isAuthenticated, currentUser, loadTestAttemptsFromSupabase]);

  return null;
}

function App() {
  return (
    <TestProvider>
      {/* Session Watcher - Monitors auth state */}
      <SessionWatcher />
      
      <Routes>
        {/* ==========================================
            PUBLIC ROUTES - No Login Required
            ========================================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/free-tests" element={<FreeTests />} />

        {/* Dheya Dashboard - PUBLIC (No login required) */}
        <Route path="/dashboard/dheya" element={<DheyaDashboard />} />
        
        {/* Test Page - PUBLIC for Dheya tests */}
        <Route path="/test" element={<Test />} />
        
        {/* ==========================================
            PROTECTED ROUTES - Login Required
            ========================================== */}
        
        {/* Protected Dashboard Routes - Tiered by Course */}
        <Route 
          path="/dashboard/rank-booster" 
          element={
            <ProtectedRoute>
              <RankBoosterDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/foundation" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard/advance-2026"
          element={
            <ProtectedRoute>
              <AdvanceDashboard2026 />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy /dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Results Page */}
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <Test />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TestProvider>
  );
}

export default App;
