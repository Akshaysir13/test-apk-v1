// src/pages/Dashboard.tsx - MULTI-TIER DASHBOARD

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';
import { TestHistory } from '../components/TestHistory';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tests' | 'history'>('tests');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // ✅ FILTER TESTS BASED ON USER'S ENROLLED COURSES
  const userTests = tests.filter(test => {
    if (!currentUser.courses || currentUser.courses.length === 0) {
      return false;
    }
    // Check if test course matches any of user's enrolled courses
    return currentUser.courses.includes(test.course);
  });

  // Apply category filter
  const filteredTests = selectedCategory === 'all'
    ? userTests
    : userTests.filter(t => t.category === selectedCategory);

  const handleStartTest = (test: any) => {
    selectTest(test);
    navigate('/test');
  };

  // Get user's primary course for display
  const primaryCourse = currentUser.courses?.[0] || 'foundation';
  const courseDisplayName = {
    'foundation': '💎 Foundation Course',
    'dheya': '🎯 Dheya Course',
    'rank_booster': '🚀 Rank Booster',
    'advance_2026': '⚡ Advance 2026'
  }[primaryCourse] || '📚 Course';

  const courseFee = {
    'foundation': '₹5,999',
    'dheya': '₹3,999',
    'rank_booster': '₹7,999',
    'advance_2026': '₹9,999'
  }[primaryCourse] || '₹5,999';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {currentUser.email}
              </h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mt-2 inline-block">
                {courseDisplayName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/leaderboard', { state: { course: primaryCourse } })}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'tests'
              ? 'border-b-2 border-purple-500 text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            📚 Available Tests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'history'
              ? 'border-b-2 border-purple-500 text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            📊 My Test History
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'tests' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Available Tests
                </h3>
                <p className="text-4xl font-bold text-purple-600">
                  {userTests.length}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Your Course Fee Paid
                </h3>
                <p className="text-2xl font-bold text-green-600">5999/- ( July & Augest )</p>
                <p className="text-2xl font-bold text-green-600">4999/- ( October )</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Course Status
                </h3>
                <p className="text-2xl font-bold text-purple-600">Active</p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-semibold ${selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  All Tests
                </button>
                {testCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-semibold ${selectedCategory === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Tests */}
            {filteredTests.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  📚 Your Tests ({filteredTests.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTests.map(test => (
                    <div
                      key={test.id}
                      className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-purple-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">
                          {test.name}
                        </h3>
                        <span className="text-2xl">
                          {test.course === 'dheya' ? '🎯' :
                            test.course === 'rank_booster' ? '🚀' :
                              test.course === 'advance_2026' ? '⚡' : '💎'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {test.description}
                      </p>

                      <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          {test.category?.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                          {test.questions?.length || 50} Questions
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartTest(test)}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                      >
                        Start Test
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No tests found in this category.
                </p>
              </div>
            )}

            {/* Admin Contact Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-600">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📞 Need Any Help?
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700"><span className="font-semibold">Contact us:</span> call or Whatsapp</p>
                <p className="text-gray-700"><span className="font-semibold">Contact Number:</span> +91 7028140857</p>
              </div>
            </div>
          </>
        ) : (
          <TestHistory />
        )}
      </div>
    </div>
  );
}