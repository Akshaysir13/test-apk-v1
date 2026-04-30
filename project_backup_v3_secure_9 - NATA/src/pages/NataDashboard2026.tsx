import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest } from '../contexts/TestContext';
import { TestHistory } from '../components/TestHistory';

export default function NataDashboard2026() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { tests, selectTest } = useTest();
  const [activeTab, setActiveTab] = useState<'tests' | 'history' | 'leaderboard'>('tests');

  const canAccess = useMemo(() => {
    return !!currentUser?.courses?.includes('nata_2026');
  }, [currentUser]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NATA 2026 Course</h1>
              <p className="text-sm text-gray-600">Access required: course not enabled for this account.</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Course not assigned</h2>
            <p className="text-gray-700">
              To show this dashboard for a student, add <span className="font-mono">nata_2026</span> in that user’s
              <span className="font-mono"> courses[]</span>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NATA 2026 Dashboard</h1>
              <p className="text-sm text-gray-600">{currentUser.email}</p>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mt-2 inline-block">
                🏛️ NATA 2026
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/leaderboard', { state: { course: 'nata_2026' } })}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'tests'
              ? 'border-b-2 border-indigo-600 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            🧪 Tests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'history'
              ? 'border-b-2 border-indigo-600 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            📊 Test History
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'leaderboard'
              ? 'border-b-2 border-indigo-600 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            🏆 Leaderboard
          </button>
        </div>

        {activeTab === 'tests' ? (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">NATA 2026 Pattern (Built-in)</h2>
              <p className="text-gray-700">
                These tests run on the <span className="font-semibold">same engine as Foundation</span>.
                Question sets are managed like the “Latest” pattern tests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.filter(t => t.course === 'nata_2026').map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border-2 border-indigo-100"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{t.name}</h3>
                    <span className="text-2xl">🧩</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{t.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold">
                      NATA Pattern
                    </span>
                    <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold">
                      {t.duration / 60} min
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-semibold">English</span>
                  </div>
                  <button
                    onClick={() => {
                      selectTest(t);
                      navigate('/test');
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'history' ? (
          <TestHistory courseFilter="nata_2026" />
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Leaderboard</h2>
            <p className="text-gray-700 mb-4">View course leaderboard for NATA 2026.</p>
            <button
              onClick={() => navigate('/leaderboard', { state: { course: 'nata_2026' } })}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Open Leaderboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

