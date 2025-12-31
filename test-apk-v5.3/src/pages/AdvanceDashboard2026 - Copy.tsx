import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Line ~15: Filter tests
  const advanceTests = tests.filter(
    test => test.course === 'advance_2026'
  );

  // Apply category filter
  const filteredTests =
    selectedCategory === 'all'
      ? advanceTests
      : advanceTests.filter(t => t.category === selectedCategory);

  const handleStartTest = (test: any) => {
    selectTest(test);
    navigate('/test');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {currentUser.email}
              </h1>

              {/* Line ~35: Update badge */}
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold mt-2 inline-block">
                🔥 Advance Test Series 2026
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/leaderboard')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Line ~45: Update stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Available Tests
            </h3>
            <p className="text-4xl font-bold text-red-600">
              {advanceTests.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Your Investment
            </h3>
            <p className="text-4xl font-bold text-green-600">₹9,999</p>
          </div>
        </div>

        {/* Line ~100: Update category button colors */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Tests
          </button>

          {testCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Available Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map(test => (
            <div
              key={test.id}
              // Line ~130: Update test card border
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-red-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {test.name}
                </h3>

                {/* Line ~135: Update icon */}
                <span className="text-2xl">🔥</span>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {test.description}
              </p>

              <button
                onClick={() => handleStartTest(test)}
                // Line ~145: Update button color
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>

        {/* Line ~165: Update contact section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-600">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            📞 Need Any Help?
          </h3>
          <p>Email: admin@moghes.com</p>
          <p>Contact: +91 XXXXX XXXXX</p>
        </div>
      </div>
    </div>
  );
}
