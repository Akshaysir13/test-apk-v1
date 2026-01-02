// src/pages/RankBoosterDashboard.tsx - ₹99 TIER DASHBOARD

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';

export default function RankBoosterDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Show Dheya + Rank Booster tests (no Foundation)
  const accessibleTests = tests.filter(test => 
    //test.course === 'dheya' || test.course === 'rank_booster'
test.course === 'rank_booster'
  );
  
  // Apply category filter
  const filteredTests = selectedCategory === 'all' 
    ? accessibleTests 
    : accessibleTests.filter(t => t.category === selectedCategory);

  const handleStartTest = (test: any) => {
    selectTest(test);
    navigate('/test');
  };

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
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mt-2 inline-block">
                🚀 Rank Booster Course
              </span>
            </div>
           <div className="flex items-center gap-3">
  <button
    onClick={() => navigate('/leaderboard')}
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Available Tests
            </h3>
            <p className="text-4xl font-bold text-blue-600">
              {accessibleTests.length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Paid
            </h3>
            <p className="text-4xl font-bold text-green-600">₹99</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Course Status
            </h3>
            <p className="text-2xl font-bold text-blue-600">Active</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
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
                    ? 'bg-blue-600 text-white'
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
              🚀 Your Tests ({filteredTests.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map(test => (
                <div
                  key={test.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-blue-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {test.name}
                    </h3>
                    <span className="text-2xl">
                      {test.course === 'dheya' ? '🆓' : '🚀'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {test.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {test.category?.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {test.questions?.length || 50} Questions
                    </span>
                    {test.course === 'dheya' && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        Free
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleStartTest(test)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
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

        {/* Upgrade to Foundation CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              💎 Upgrade to Foundation Course
            </h2>
            <p className="text-xl mb-6">
              Get access to ALL 80+ tests including advanced mock tests!
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg max-w-md mx-auto mb-6">
              <h3 className="text-2xl font-bold mb-3">₹6,000</h3>
              <ul className="text-left space-y-2 text-sm mb-4">
                <li>✓ All 80+ Comprehensive Tests</li>
                <li>✓ Advanced Mock Test Series</li>
                <li>✓ Complete PYQ Collection</li>
                <li>✓ Latest Pattern Tests</li>
                <li>✓ Priority Support</li>
                <li>✓ Everything from Rank Booster included</li>
              </ul>
            </div>
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 font-bold text-lg">
              Upgrade to Foundation
            </button>
          </div>
        </div>

        {/* Admin Contact Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-600">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📞 Need Help with Upgrade?
          </h3>
          <div className="space-y-3">
            <p className="text-gray-700"><span className="font-semibold">Contact us:</span> Call or Whatsapp</p>
            <p className="text-gray-700"><span className="font-semibold">Contact Number:</span> +91 7028140857</p>
          </div>
        </div>
      </div>
    </div>
  );

}
