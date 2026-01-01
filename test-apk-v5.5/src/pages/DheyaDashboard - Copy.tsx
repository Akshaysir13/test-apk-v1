// src/pages/DheyaDashboard.tsx - FREE TIER DASHBOARD

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';

export default function DheyaDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Only show Dheya (free) tests
  const dheyaTests = tests.filter(test => test.course === 'dheya');
  
  // Apply category filter
  const filteredTests = selectedCategory === 'all' 
    ? dheyaTests 
    : dheyaTests.filter(t => t.category === selectedCategory);

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
                Welcome{currentUser ? `, ${currentUser.email}` : ''}
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mt-2 inline-block">
                📚 Dheya Course (Free)
              </span>
            </div>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Free Tests Available
            </h3>
            <p className="text-4xl font-bold text-green-600">
              {dheyaTests.length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Unlimited Attempts
            </h3>
            <p className="text-4xl font-bold text-blue-600">∞</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Your Plan
            </h3>
            <p className="text-2xl font-bold text-gray-900">FREE</p>
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
              📚 Your Free Tests ({filteredTests.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map(test => (
                <div
                  key={test.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-green-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {test.name}
                    </h3>
                    <span className="text-2xl">🆓</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {test.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {test.category?.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      {test.questions?.length || 50} Questions
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleStartTest(test)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
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

        {/* Upgrade CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">
            🚀 Want More Tests?
          </h2>
          <p className="text-lg mb-6 text-center">
            Upgrade to unlock 70+ premium tests with advanced features!
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">🚀 Rank Booster</h3>
              <p className="text-3xl font-bold mb-3">₹99</p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ 40+ Premium Tests</li>
                <li>✓ All Dheya Tests</li>
                <li>✓ Detailed Solutions</li>
              </ul>
              <button className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-bold">
                Upgrade Now
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">💎 Foundation</h3>
              <p className="text-3xl font-bold mb-3">₹6,000</p>
              <ul className="text-sm space-y-2 mb-4">
                <li>✓ ALL 80+ Tests</li>
                <li>✓ Complete Test Series</li>
                <li>✓ Priority Support</li>
              </ul>
              <button className="w-full px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-bold">
                Get Foundation
              </button>
            </div>
          </div>
        </div>

        {/* Admin Contact Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📞 Need Help with Upgrade?
          </h3>
          <div className="space-y-3">
            <p className="text-gray-700"><span className="font-semibold">Email:</span> admin@moghes.com</p>
            <p className="text-gray-700"><span className="font-semibold">Contact Number:</span> +91 7028140857</p>
          </div>
        </div>
      </div>
    </div>
  );
}
