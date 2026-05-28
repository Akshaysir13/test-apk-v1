// src/pages/RankBoosterDashboard.tsx - ₹99 TIER WITH FOUNDATION UPSELL

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';
import { TestHistory } from '../components/TestHistory';

export default function RankBoosterDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { tests, selectTest, testAttempts, getStudentAttempts } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFoundationModal, setShowFoundationModal] = useState(false);
  const [showSuccessStory, setShowSuccessStory] = useState(true);
  const [activeTab, setActiveTab] = useState<'tests' | 'history'>('tests');

  // Show Foundation upgrade modal after 8 tests
  useEffect(() => {
    if (currentUser) {
      const myAttempts = getStudentAttempts(currentUser.email);
      if (myAttempts.length >= 8) {
        setTimeout(() => setShowFoundationModal(true), 5000);
      }
    }
  }, [currentUser, getStudentAttempts]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const accessibleTests = tests.filter(test =>
    test.course === 'rank_booster'
  );

  const filteredTests = selectedCategory === 'all'
    ? accessibleTests
    : accessibleTests.filter(t => t.category === selectedCategory);

  const myAttempts = getStudentAttempts(currentUser.email);
  const totalTests = myAttempts.length;
  const avgScore = myAttempts.length > 0
    ? Math.round(myAttempts.reduce((sum, a) => sum + a.score, 0) / myAttempts.length)
    : 0;
  const bestScore = myAttempts.length > 0
    ? Math.max(...myAttempts.map(a => a.score))
    : 0;

  const handleStartTest = (test: any) => {
    selectTest(test);
    navigate('/test');
  };

  const successStories = [
    {
      name: "Ankit Sharma",
      before: "185",
      after: "248",
      college: "SPA Delhi",
      text: "I was stuck at 180s with Rank Booster. After upgrading to Foundation and practicing all PYQs, I scored 248!",
      days: "30 days"
    },
    {
      name: "Sneha Reddy",
      before: "192",
      after: "241",
      college: "NIT Trichy",
      text: "The extra 70 tests in Foundation made all the difference. Highly recommend upgrading!",
      days: "45 days"
    },
    {
      name: "Rohit Patel",
      before: "178",
      after: "235",
      college: "SPA Bhopal",
      text: "Foundation's 2005-2025 PYQ bank covered everything. Worth every penny!",
      days: "40 days"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Foundation Upgrade Modal */}
      {showFoundationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full relative animate-[scale_0.3s_ease-out] overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowFoundationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block animate-bounce">💎</span>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">
                You're Doing Great! 🎉
              </h3>
              <p className="text-xl text-gray-600 mb-2">
                You've completed <span className="font-bold text-blue-600">{totalTests}</span> tests
              </p>
              <p className="text-lg text-gray-600">
                Your best score: <span className="font-bold text-green-600">{bestScore} marks</span>
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl mb-6 border-2 border-purple-200">
              <h4 className="text-2xl font-bold text-center mb-4 text-gray-900">
                🚀 Ready to Score 250+ and Get into Top NITs?
              </h4>
              <p className="text-center text-gray-700 text-lg mb-4">
                Students who upgraded to Foundation scored <strong>60+ marks higher</strong> on average
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">80+</p>
                  <p className="text-sm text-gray-600">Total Tests</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">2005-2025</p>
                  <p className="text-sm text-gray-600">Complete PYQ Bank</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">99%ile</p>
                  <p className="text-sm text-gray-600">Strategy Included</p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-center">
                <h4 className="text-xl font-bold">Your Plan vs Foundation Course</h4>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">Feature</th>
                    <th className="px-4 py-3 text-center text-sm bg-blue-50">
                      <div className="font-bold">🚀 Your Plan</div>
                      <div className="text-xs text-blue-600">Rank Booster</div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm bg-purple-50">
                      <div className="font-bold">💎 Foundation</div>
                      <div className="text-xs text-purple-600">Complete Package</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-t">
                    <td className="px-4 py-3">Number of Tests</td>
                    <td className="px-4 py-3 text-center bg-blue-50 font-bold">{accessibleTests.length}</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold text-purple-600">80+</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="px-4 py-3">PYQ Coverage</td>
                    <td className="px-4 py-3 text-center">2023-2025</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold">2005-2025 ✓</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3">White Mock Tests</td>
                    <td className="px-4 py-3 text-center bg-blue-50">1</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold text-purple-600">8 ✓</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="px-4 py-3">Blue Mock Tests</td>
                    <td className="px-4 py-3 text-center">1</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold text-purple-600">10 ✓</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3">Grey Mock Tests</td>
                    <td className="px-4 py-3 text-center bg-blue-50">1</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold text-purple-600">33 ✓</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="px-4 py-3">Performance Analytics</td>
                    <td className="px-4 py-3 text-center">✓ Basic</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold">✓ Advanced</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3">Support</td>
                    <td className="px-4 py-3 text-center bg-blue-50">Email</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold">Priority 24/7 ✓</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="px-4 py-3 font-bold">Price</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">₹99 (paid)</td>
                    <td className="px-4 py-3 text-center bg-purple-50">
                      <div className="font-bold text-purple-600">₹4,999</div>
                      <div className="text-xs text-gray-500 line-through">₹12,000</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Special Upgrade Offer */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-xl text-center mb-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                🎁 EXCLUSIVE UPGRADE OFFER - Just For You!
              </h4>
              <p className="text-gray-900 text-lg mb-4">
                Upgrade to Foundation and pay only:
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-5xl font-bold text-gray-900">₹4,900</span>
                <div className="text-left">
                  <p className="text-sm text-gray-800 line-through">₹4,999</p>
                  <p className="text-sm font-bold text-gray-900">You save ₹99 (already paid)</p>
                </div>
              </div>
              <p className="text-sm text-gray-800 mb-4">
                ⏰ This offer expires in <strong>48 hours</strong>
              </p>
              <button
                onClick={() => {
                  setShowFoundationModal(false);
                  window.open('https://wa.me/917028140857?text=Hi, I want to upgrade from Rank Booster to Foundation (₹4,900)', '_blank');
                }}
                className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-xl hover:bg-gray-800 shadow-2xl hover:scale-105 transition-transform"
              >
                Upgrade to Foundation Now →
              </button>
            </div>

            <div className="text-center space-y-2 text-sm text-gray-500">
              <p>💯 100% Exam Oriented Tests Guarantee • 🔒 Secure Payment • ⚡ Instant Access</p>
              <p>📞 Questions? WhatsApp: +91 7028140857</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Welcome, {currentUser.email.split('@')[0]}! 👋
              </h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mt-2 inline-block">
                🚀 Rank Booster Course
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/leaderboard', { state: { course: 'rank_booster' } })}
                className="hidden md:flex px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 items-center gap-2"
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => setShowFoundationModal(true)}
                className="hidden md:block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg"
              >
                💎 Upgrade to Foundation
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'tests'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            📚 Available Tests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'history'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            📊 My Test History
          </button>
        </div>

        {activeTab === 'tests' ? (
          <>
            {/* Foundation Upgrade CTA Banner */}
            <div className="mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl animate-bounce">💎</span>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        Unlock 70+ More Tests!
                      </h3>
                      <p className="text-white/90 mb-3">
                        Get complete PYQ bank (2005-2025) + Advanced strategies
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">80+ Tests</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">20 Years PYQs</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">99%ile Tips</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">Priority Support</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-3">
                      <p className="text-sm text-white/80 line-through">₹4,999</p>
                      <p className="text-4xl font-bold">₹4,900</p>
                      <p className="text-sm text-white/90">Already paid ₹99 adjusted!</p>
                    </div>
                    <button
                      onClick={() => setShowFoundationModal(true)}
                      className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-2xl hover:scale-105 transition-transform whitespace-nowrap"
                    >
                      Upgrade Now →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Progress */}
            {totalTests > 0 && (
              <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">📊</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Your Performance Analytics
                    </h3>
                    <p className="text-gray-600">
                      Track your progress and see how you compare
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-4xl font-bold text-blue-600">{totalTests}</p>
                    <p className="text-sm text-gray-600 mt-1">Tests Completed</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-4xl font-bold text-green-600">{bestScore}</p>
                    <p className="text-sm text-gray-600 mt-1">Best Score</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <p className="text-4xl font-bold text-purple-600">{avgScore}</p>
                    <p className="text-sm text-gray-600 mt-1">Average Score</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <p className="text-4xl font-bold text-yellow-600">
                      {Math.round((avgScore / 400) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Accuracy</p>
                  </div>
                </div>

                {/* Motivational Message */}
                {avgScore < 200 && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>💡 Want to score 200+?</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Foundation students practice with <strong>70+ more tests</strong> and score <strong>60 marks higher</strong> on average.
                      <button
                        onClick={() => setShowFoundationModal(true)}
                        className="text-blue-600 font-semibold hover:underline ml-1"
                      >
                        See how they did it →
                      </button>
                    </p>
                  </div>
                )}

                {avgScore >= 200 && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-400 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>🎉 Excellent Progress!</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      You're scoring 200+! Upgrade to Foundation to reach <strong>250+ marks</strong> and get into top NITs/SPAs.
                      <button
                        onClick={() => setShowFoundationModal(true)}
                        className="text-blue-600 font-semibold hover:underline ml-1"
                      >
                        Unlock full potential →
                      </button>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter by Category</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  All Tests
                </button>
                {testCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🚀 Your Tests ({filteredTests.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTests.map(test => (
                    <div
                      key={test.id}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-blue-200 hover:scale-105 transform"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">
                          {test.name}
                        </h3>
                        <span className="text-3xl">🚀</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {test.description}
                      </p>

                      <div className="flex gap-2 mb-4 text-xs flex-wrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {test.category?.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          {test.questions?.length || 50} Questions
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartTest(test)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl"
                      >
                        Start Test →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">😢</span>
                <p className="text-xl text-gray-600">No tests found in this category.</p>
              </div>
            )}

            {/* What You're Missing Section */}
            <div className="mt-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-6">
                🔒 What You're Missing in Foundation
              </h3>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <span className="text-5xl mb-3 block">📚</span>
                  <p className="text-4xl font-bold text-purple-600 mb-2">80+</p>
                  <p className="text-gray-700 font-semibold mb-2">More Tests Locked</p>
                  <p className="text-sm text-gray-600">Complete test series you're missing</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <span className="text-5xl mb-3 block">📅</span>
                  <p className="text-4xl font-bold text-blue-600 mb-2">20</p>
                  <p className="text-gray-700 font-semibold mb-2">Years of PYQs</p>
                  <p className="text-sm text-gray-600">2005-2025 complete question bank</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <span className="text-5xl mb-3 block">🎯</span>
                  <p className="text-4xl font-bold text-green-600 mb-2">250+</p>
                  <p className="text-gray-700 font-semibold mb-2">Target Score</p>
                  <p className="text-sm text-gray-600">With our 99 percentile strategies</p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowFoundationModal(true)}
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-transform"
                >
                  💎 Unlock Foundation Course - ₹4,900
                </button>
                <p className="mt-3 text-sm text-gray-600">
                  ⚡ Your ₹99 is already adjusted in the price
                </p>
              </div>
            </div>

            {/* Success Stories */}
            <div className="max-w-7xl mx-auto px-4 py-16">
              <h3 className="text-4xl font-bold text-center mb-4">
                🌟 Success Stories from Our Students in JEE Mains ( B.Arch 2025) Exam
              </h3>
              <p className="text-center text-gray-600 mb-12 text-lg">
                Real students, Real results, Real colleges
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                {[

                  {
                    name: "MIHIKA T",
                    score: "99.97",
                    college: "SPA Delhi - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Focused preparation and expert guidance helped me secure SPA Delhi.",
                    improvement: "AIR 23"
                  },
                  {
                    name: "TANMAY",
                    score: "99.94",
                    college: "SPA Delhi - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Mock tests and regular feedback played a key role in my success.",
                    improvement: "AIR 42"
                  },
                  {
                    name: "KRITIKA",
                    score: "99.82",
                    college: "SPA Bhopal - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Strong fundamentals helped me secure SPA Bhopal.",
                    improvement: "AIR 133 (SC 4)"
                  },
                  {
                    name: "ADITYA",
                    score: "99.78",
                    college: "CCA Chandigarh - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Strong fundamentals helped me crack CCA Chandigarh.",
                    improvement: "AIR 155"
                  },
                  {
                    name: "KAVYA",
                    score: "99.75",
                    college: "SPA Delhi - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Late start but focused preparation made it possible.",
                    improvement: "AIR 185"
                  },
                  {
                    name: "AYMAN",
                    score: "99.71",
                    college: "SPA Delhi - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Target batch guidance was extremely effective.",
                    improvement: "AIR 214"
                  },
                  {
                    name: "JYOTSNA",
                    score: "99.68",
                    college: "SPA Delhi - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Lakshya batch kept my preparation disciplined.",
                    improvement: "AIR 240"
                  },
                  {
                    name: "SWARAGANGA",
                    score: "99.68",
                    college: "NIT Calicut - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Consistent preparation helped me crack NIT Calicut.",
                    improvement: "AIR 241 (OBC 50) "
                  },
                  {
                    name: "LAHARIKA",
                    score: "99.61",
                    college: "SPA Vijayawada - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Clear concepts helped me crack SPA Vijayawada.",
                    improvement: "AIR 292 (EWS 22)"
                  },
                  {
                    name: "SUHAN",
                    score: "99.61",
                    college: "SPA Delhi - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Structured preparation helped me crack SPA Delhi confidently.",
                    improvement: "AIR 293 (EWS 23)"
                  },
                  {
                    name: "MEHAKPREET",
                    score: "99.52",
                    college: "CCA Chandigarh - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "August batch kept my preparation on track.",
                    improvement: "AIR 370 (SC 12)"
                  },
                  {
                    name: "AYUSHI KUMARI",
                    score: "99.50",
                    college: "MNIT Jaipur - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Lakshya batch kept me motivated.",
                    improvement: "AIR 387 (OBC 90)"
                  },
                  {
                    name: "AKSHITA",
                    score: "99.33",
                    college: "MNIT Jaipur - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "October batch strategy worked well.",
                    improvement: "AIR 495"
                  },
                  {
                    name: "NANDINI",
                    score: "99.32",
                    college: "SPA Bhopal - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Well-planned syllabus coverage made the difference.",
                    improvement: "AIR 513 (ST 7)"
                  },
                  {
                    name: "OMKAR",
                    score: "99.21",
                    college: "JJ School of Architecture - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "October batch strategy worked perfectly.",
                    improvement: "AIR 589 (EWS 42)"
                  },
                  {
                    name: "PARAM DESHMUKH",
                    score: "99.10",
                    college: "SPA Bhopal - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "December batch preparation paid off well.",
                    improvement: "AIR 649 (OBC 159)"
                  },
                  {
                    name: "NAVSIMAR",
                    score: "99.02",
                    college: "CEPT University - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Lakshya batch preparation was highly effective.",
                    improvement: "AIR 715"
                  },
                  {
                    name: "PRANAV",
                    score: "99.02",
                    college: "Our Topper",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "August batch preparation paid off.",
                    improvement: "AIR 718"
                  },
                  {
                    name: "TANAY",
                    score: "98.83",
                    college: "SPA Delhi - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Mock analysis helped boost my confidence.",
                    improvement: "AIR 823 (OBC 210)"
                  },

                  {
                    name: "CHITENDRA",
                    score: "98.83",
                    college: "CCA Chandigarh - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "October batch preparation was very effective.",
                    improvement: "AIR 844 (EWS 62) "
                  },
                  {
                    name: "MADHUSHRI",
                    score: "98.83",
                    college: "SPA Bhopal - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Regular testing helped improve my accuracy.",
                    improvement: "AIR 845 (OBC 218)"
                  },
                  {
                    name: "ARJUN",
                    score: "98.67",
                    college: "MNIT Jaipur - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Target batch preparation paid off.",
                    improvement: "AIR 950"
                  },
                  {
                    name: "BISMAYEE",
                    score: "98.48",
                    college: "SPA Vijayawada - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "Target batch guidance was extremely helpful.",
                    improvement: "AIR 1068 (OBC 281)"
                  },
                  {
                    name: "ANAGHA",
                    score: "98.48",
                    college: "BRICK Pune",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "December batch preparation paid off.",
                    improvement: "AIR 1076"
                  },
                  {
                    name: "Nandakishor",
                    score: "98.67",
                    college: "Kerala Government College",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Target batch preparation paid off.",
                    improvement: "AIR 1079"
                  },
                  {
                    name: "VIKASH",
                    score: "98.39",
                    college: "MNIT Jaipur - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Strong fundamentals ensured my selection.",
                    improvement: "AIR 1137 (OBC 301)"
                  },
                  {
                    name: "REHANA",
                    score: "98.33",
                    college: "SPA Vijayawada - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "October batch helped refine my performance.",
                    improvement: "AIR 1160 (OBC 306)"
                  },
                  {
                    name: "MADIHA",
                    score: "98.29",
                    college: "SPA Vijayawada - B.Arch",
                    course: "Foundation",
                    image: "👩‍🎓",
                    text: "August batch kept my preparation on track.",
                    improvement: "AIR 1216 (OBC 319)"
                  },
                  {
                    name: "SONKET",
                    score: "98.15",
                    college: "NIT Raipur - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Target batch preparation paid off.",
                    improvement: "AIR 1291"
                  },
                  {
                    name: "NISHANT RAJ",
                    score: "98.02",
                    college: "Our Topper",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Strong fundamentals and practice ensured success.",
                    improvement: "AIR 1396 (EWS 100) "
                  },
                  {
                    name: "Nandanandan mishra",
                    score: "98.02",
                    college: "Our Topper",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Strong fundamentals and practice ensured success.",
                    improvement: "AIR 1401"
                  },
                  {
                    name: "RAJ",
                    score: "98.02",
                    college: "CCA Chandigarh - B.Arch",
                    course: "Foundation",
                    image: "👨‍🎓",
                    text: "Lakshya batch strategy worked perfectly.",
                    improvement: "AIR 1402"
                  },

                ].map((story, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl border-2 border-purple-200 hover:border-purple-400 transition-all hover:scale-105">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-3xl">
                        {story.image}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{story.name}</p>
                        <p className="text-sm text-purple-600 font-semibold">{story.college}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg mb-4 border-2 border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Percentile</p>
                          <p className="text-3xl font-bold text-green-600">{story.score}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">ALL INDIA RANK</p>
                          <p className="text-2xl font-bold text-blue-600">{story.improvement}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
                      ))}
                    </div>

                    <p className="text-gray-600 text-sm italic mb-3">
                      "{story.text}"
                    </p>

                    <div className="bg-blue-50 px-3 py-1 rounded-full inline-block">
                      <p className="text-xs text-blue-600 font-semibold">
                        Used: {story.course} Course
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Upgrade Your Rank Booster to Foundation?
              </h3>
              <p className="text-lg mb-6 text-white/90">
                Get 70+ more tests, complete PYQ bank (2005-2025), and advanced strategies
              </p>
              <button
                onClick={() => setShowFoundationModal(true)}
                className="px-10 py-5 bg-white text-purple-600 rounded-xl font-bold text-xl hover:bg-gray-100 shadow-2xl hover:scale-105 transition-transform"
              >
                💎 Upgrade Now for ₹4,900
              </button>
              <p className="mt-4 text-sm text-white/80">
                Your ₹99 is already adjusted • 48-hour limited offer
              </p>
            </div>
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