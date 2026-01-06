// src/pages/FreeTests.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../contexts/TestContext';

export default function FreeTests() {
  const navigate = useNavigate();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter only Dheya (free) tests
  const dheyaTests = tests.filter(test => test.course === 'dheya');

  // Apply category filter
  const filteredTests = selectedCategory === 'all' 
    ? dheyaTests 
    : dheyaTests.filter(t => t.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Tests', icon: '📚', color: 'bg-blue-600' },
    { id: 'white', name: 'White Mocks', icon: '⚪', color: 'bg-gray-600' },
    { id: 'blue', name: 'Blue Mocks', icon: '🔵', color: 'bg-blue-500' },
    { id: 'grey', name: 'Grey Mocks', icon: '⚫', color: 'bg-gray-700' },
    { id: 'pyq', name: 'PYQ (2005-2025)', icon: '📚', color: 'bg-yellow-600' },
    { id: 'latest', name: 'Latest Pattern', icon: '🆕', color: 'bg-green-600' }
  ];

  const handleStartTest = (test: any) => {
    selectTest(test);
    navigate('/test');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
  <img src="/logo.png" alt="Moghes Institute Logo" className="w-10 h-10" />
  <h1 className="text-2xl font-bold text-gray-900">Moghe's Institute ( JEE B.Arch & NATA )</h1>
</div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back to Home
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Login for More Tests
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            🎁 Free Dheya Practice Tests
          </h2>
          <p className="text-xl mb-6">
            Start your preparation journey with our free test series
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-3xl font-bold">{dheyaTests.length}+</p>
              <p className="text-sm">Free Tests</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm">Free Forever</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-3xl font-bold">∞</p>
              <p className="text-sm">Unlimited Attempts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter by Category</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? `${cat.color} text-white`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Test Grid */}
        {filteredTests.length > 0 ? (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Available Tests ({filteredTests.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => {
                const categoryInfo = categories.find(c => c.id === test.category);
                return (
                  <div
                    key={test.id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-green-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 flex-1">
                        {test.name}
                      </h4>
                      <span className="text-2xl">🆓</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {test.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        categoryInfo?.id === 'white' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                        categoryInfo?.id === 'blue' ? 'bg-blue-100 text-blue-800' :
                        categoryInfo?.id === 'grey' ? 'bg-gray-200 text-gray-800' :
                        categoryInfo?.id === 'pyq' ? 'bg-yellow-100 text-yellow-800' :
                        categoryInfo?.id === 'latest' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {categoryInfo?.icon} {test.category?.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                        {test.questions?.length || 50} Questions
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleStartTest(test)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 font-bold"
                    >
                      Start Test →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">😢</span>
            <p className="text-xl text-gray-600">
              No tests found in this category.
            </p>
          </div>
        )}

        {/* Upgrade CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">
              Want More Practice Tests?
            </h3>
            <p className="text-xl mb-6">
              Upgrade to get access to 70+ premium tests with detailed solutions
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 font-bold text-lg"
              >
                🚀 Upgrade to Rank Booster - ₹99
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 font-bold text-lg"
              >
                💎 Get Foundation Course - ₹6,000
              </button>
            </div>
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
          <p className="text-gray-700"><span className="font-semibold">Contact Number:</span> +91 XXXXX XXXXX</p>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 Moghes Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}