// src/App.tsx - UPDATED WITH TIERED DASHBOARDS

import { Routes, Route, Navigate } from 'react-router-dom';
import { TestProvider } from './contexts/TestContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DheyaDashboard from './pages/DheyaDashboard';
import RankBoosterDashboard from './pages/RankBoosterDashboard';
import Dashboard from './pages/Dashboard'; // Foundation Dashboard
import AdminAttendance from './pages/AdminAttendance';
import AdvanceDashboard2026 from './pages/AdvanceDashboard2026';
import FreeTests from './pages/FreeTests';
import Test from './pages/Test';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <TestProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/free-tests" element={<FreeTests />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Public Dheya Route - No Login Required */}
        <Route path="/dashboard/dheya" element={<DheyaDashboard />} />

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
        {/* Legacy /dashboard route - redirects based on user's course */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Other Protected Routes */}
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          }
        />

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
              <AdminAttendance />
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
