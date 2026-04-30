// src/pages/FreeTests.tsx - WITH UPSELLING SIMILAR TO RANK BOOSTER
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest } from '../contexts/TestContext';
import { DheyaContactModal } from '../components/DheyaContactModal';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 🔗 SUPABASE CLIENT
// ==========================================
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function FreeTests() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPopup, setShowPopup] = useState(false);
  const [showRankBoosterModal, setShowRankBoosterModal] = useState(false);
  const [showSuccessStory, setShowSuccessStory] = useState(true);

  // ==========================================
  // 📋 CONTACT MODAL STATES
  // ==========================================
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedTestForModal, setSelectedTestForModal] = useState<any>(null);
  const [tempEmail, setTempEmail] = useState('');

  // Show upgrade popup after viewing 3 tests
  useEffect(() => {
    const viewCount = parseInt(localStorage.getItem('freeTestViews') || '0');
    if (viewCount >= 3 && viewCount % 3 === 0) {
      setTimeout(() => setShowRankBoosterModal(true), 3000);
    }
  }, []);

  const dheyaTests = tests.filter(test => test.course === 'dheya');
  const filteredTests = selectedCategory === 'all'
    ? dheyaTests
    : dheyaTests.filter(t => t.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Tests', icon: '📚', color: 'bg-blue-600' },
    { id: 'pyq', name: 'PYQ (2023-2025)', icon: '📚', color: 'bg-yellow-600' },
  ];

  const successStories = [
    {
      name: "Priya Singh",
      before: "Free Tests Only",
      after: "248 marks",
      college: "SPA Delhi",
      text: "Started with free tests, upgraded to Rank Booster, then Foundation. Best decision ever!",
      days: "3 months"
    },
    {
      name: "Arjun Mehta",
      before: "160 marks",
      after: "235 marks",
      college: "NIT Trichy",
      text: "Free tests helped me understand the pattern. Rank Booster took me to the next level!",
      days: "2 months"
    },
    {
      name: "Kavya Reddy",
      before: "Free User",
      after: "242 marks",
      college: "SPA Bhopal",
      text: "The progression from Free → Rank Booster → Foundation was perfect for my learning pace!",
      days: "4 months"
    }
  ];

  // ==========================================
  // 🚀 START TEST - SHOW CONTACT MODAL FIRST
  // ==========================================
  const handleStartTest = async (test: any) => {
    // Track views for popup
    const viewCount = parseInt(localStorage.getItem('freeTestViews') || '0');
    localStorage.setItem('freeTestViews', String(viewCount + 1));

    // ✅ NEW CHECK: If already logged in, check if we have their contact info
    if (isAuthenticated) {
      console.log('User already authenticated, checking contact info...');

      // Check if we have contact info for this user in Supabase
      const { data: contactInfo } = await supabase
        .from('student_contact_info')
        .select('*')
        .eq('student_email', currentUser?.email)
        .maybeSingle();

      if (contactInfo) {
        // Already have contact info - start test immediately
        console.log('Contact info exists, starting test directly');
        selectTest(test);
        navigate('/test');
        return;
      } else {
        // No contact info yet - show modal to collect it
        console.log('No contact info found, showing modal');
        setTempEmail(currentUser?.email || '');
        setSelectedTestForModal(test);
        setShowContactModal(true);
        return;
      }
    }

    // Check if user is already logged in (Legacy check)

    // Check if user is already logged in
    const savedEmail = localStorage.getItem('temp_user_email');

    if (savedEmail) {
      // Already have email, check if contact info exists
      const { data } = await supabase
        .from('student_contact_info')
        .select('*')
        .eq('student_email', savedEmail)
        .maybeSingle();

      if (data) {
        // Contact info exists - save test and go to login
        localStorage.setItem('pendingTest', JSON.stringify(test));
        navigate('/login');
      } else {
        // No contact info - show modal
        setTempEmail(savedEmail);
        setSelectedTestForModal(test);
        setShowContactModal(true);
      }
    } else {
      // No email - show modal first
      setSelectedTestForModal(test);
      setShowContactModal(true);
    }
  };

  // ==========================================
  // ✅ CONTACT MODAL SUCCESS
  // ==========================================
  // ==========================================
  // ✅ CONTACT MODAL SUCCESS
  // ==========================================
  const handleContactSuccess = () => {
    setShowContactModal(false);

    // ✅ NEW: If authenticated, start test instantly
    if (isAuthenticated && selectedTestForModal) {
      console.log('Contact collected, starting test now');
      selectTest(selectedTestForModal);
      navigate('/test');
      return;
    }

    if (selectedTestForModal) {
      // Save test for after login
      localStorage.setItem('pendingTest', JSON.stringify(selectedTestForModal));

      // Save email for quick login
      if (tempEmail) {
        localStorage.setItem('temp_user_email', tempEmail);
      }

      // Redirect to login
      navigate('/login');
    }
  };

  const handleContactCancel = () => {
    setShowContactModal(false);
    setSelectedTestForModal(null);
    setTempEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==========================================
          📋 CONTACT COLLECTION MODAL
          ========================================== */}
      <DheyaContactModal
        isOpen={showContactModal}
        userEmail={tempEmail}
        testName={selectedTestForModal?.name || ''}
        testId={selectedTestForModal?.id || ''}
        onSuccess={handleContactSuccess}
        onCancel={handleContactCancel}
      />

      {/* ==========================================
          💎 RANK BOOSTER UPGRADE MODAL
          ========================================== */}
      {showRankBoosterModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full relative animate-[scale_0.3s_ease-out] overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowRankBoosterModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block animate-bounce">🚀</span>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">
                Great Start with Free Tests! 🎉
              </h3>
              <p className="text-xl text-gray-600 mb-2">
                You're learning the basics. Ready to score <span className="font-bold text-blue-600">200+</span>?
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6 border-2 border-blue-200">
              <h4 className="text-2xl font-bold text-center mb-4 text-gray-900">
                🎯 Upgrade Your Preparation Journey
              </h4>
              <p className="text-center text-gray-700 text-lg mb-4">
                Join <strong>5,000+ students</strong> who upgraded and scored higher
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">10+</p>
                  <p className="text-sm text-gray-600">Premium Tests</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">2023-2025</p>
                  <p className="text-sm text-gray-600">Recent PYQs</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">₹3/day</p>
                  <p className="text-sm text-gray-600">For 30 Days</p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 text-center">
                <h4 className="text-xl font-bold">Free vs Rank Booster vs Foundation</h4>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Feature</th>
                    <th className="px-4 py-3 text-center bg-green-50">
                      <div className="font-bold">🆓 Free</div>
                      <div className="text-xs text-green-600">Current Plan</div>
                    </th>
                    <th className="px-4 py-3 text-center bg-blue-50">
                      <div className="font-bold">🚀 Rank Booster</div>
                      <div className="text-xs text-blue-600">Best Value</div>
                    </th>
                    <th className="px-4 py-3 text-center bg-purple-50">
                      <div className="font-bold">💎 Foundation</div>
                      <div className="text-xs text-purple-600">Complete</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3">Number of Tests</td>
                    <td className="px-4 py-3 text-center bg-green-50 font-bold">{dheyaTests.length}</td>
                    <td className="px-4 py-3 text-center bg-blue-50 font-bold text-blue-600">10+</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold text-purple-600">80+</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="px-4 py-3">PYQ Coverage</td>
                    <td className="px-4 py-3 text-center">Limited</td>
                    <td className="px-4 py-3 text-center bg-blue-50 font-bold">2023-2025 ✓</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold">2005-2025 ✓</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3">Mock Tests</td>
                    <td className="px-4 py-3 text-center bg-green-50">0</td>
                    <td className="px-4 py-3 text-center bg-blue-50 font-bold text-blue-600">3 ✓</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold text-purple-600">51 ✓</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="px-4 py-3">Analytics</td>
                    <td className="px-4 py-3 text-center">Basic</td>
                    <td className="px-4 py-3 text-center bg-blue-50 font-bold">✓ Detailed</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold">✓ Advanced</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3">Support</td>
                    <td className="px-4 py-3 text-center bg-green-50">Email</td>
                    <td className="px-4 py-3 text-center bg-blue-50 font-bold">WhatsApp ✓</td>
                    <td className="px-4 py-3 text-center bg-purple-50 font-bold">Priority 24/7 ✓</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="px-4 py-3 font-bold">Price</td>
                    <td className="px-4 py-3 text-center font-bold text-green-600">₹0</td>
                    <td className="px-4 py-3 text-center bg-blue-50 font-bold text-blue-600">₹99</td>
                    <td className="px-4 py-3 text-center bg-purple-50">
                      <div className="font-bold text-purple-600">₹4,999</div>
                      <div className="text-xs text-gray-500 line-through">₹12,000</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-xl text-center mb-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                🎁 SPECIAL OFFER - First-Time Users Only!
              </h4>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-5xl font-bold text-gray-900">₹99</span>
                <div className="text-left">
                  <p className="text-sm text-gray-800">Only ₹3/day</p>
                  <p className="text-sm font-bold text-gray-900">30 days access</p>
                </div>
              </div>
              <p className="text-sm text-gray-800 mb-4">
                ⏰ Upgrade in next <strong>24 hours</strong> and get <strong>BONUS</strong>: Free strategy guide
              </p>
              <button
                onClick={() => {
                  setShowRankBoosterModal(false);
                  navigate('/login');
                }}
                className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-xl hover:bg-gray-800 shadow-2xl hover:scale-105 transition-transform"
              >
                Upgrade to Rank Booster Now →
              </button>
            </div>

            <div className="text-center space-y-2 text-sm text-gray-500">
              <p>💯 100% Exam Succes Guarantee • 🔒 Secure Payment • ⚡ Instant Access</p>
              <p>📞 Questions? WhatsApp: +91 7028140857</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Moghe's Institute
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold text-sm md:text-base"
              >
                ← Home
              </button>
              <button
                onClick={() => setShowRankBoosterModal(true)}
                className="px-4 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold text-sm md:text-base"
              >
                🚀 Upgrade
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-semibold flex items-center justify-center gap-2 flex-wrap text-sm md:text-base">
            <span className="animate-pulse">🔥</span>
            <span>LIMITED TIME: Rank Booster at ₹99 (₹3/day)</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm">Offer ends soon</span>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🎁 Free Practice Tests - JEE B.Arch 2026
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Start your preparation journey • No payment required
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold">{dheyaTests.length}</p>
              <p className="text-xs md:text-sm">Free Tests</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold">100%</p>
              <p className="text-xs md:text-sm">Free Forever</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold">∞</p>
              <p className="text-xs md:text-sm">Unlimited Attempts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <span><strong className="text-gray-900">10,000+</strong> Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span><strong className="text-gray-900">4.8/5</strong> Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span><strong className="text-gray-900">500+</strong> Success Stories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Rank Booster Upgrade CTA Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <span className="text-6xl animate-bounce">🚀</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    Ready for Serious Preparation?
                  </h3>
                  <p className="text-white/90 mb-3">
                    Unlock 10+ premium tests + 2023-2025 PYQs
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">10+ Tests</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">Recent PYQs</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">₹3/day only</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-3">
                  <p className="text-sm text-white/80 line-through">₹299</p>
                  <p className="text-4xl font-bold">₹99</p>
                  <p className="text-sm text-white/90">Best value for beginners!</p>
                </div>
                <button
                  onClick={() => setShowRankBoosterModal(true)}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-2xl hover:scale-105 transition-transform whitespace-nowrap"
                >
                  Upgrade Now →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Locked Content Teaser */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🔒 70+ Premium Tests Locked
              </h3>
              <p className="text-gray-600">
                Upgrade to Rank Booster (₹99) or Foundation (₹4,999) to access complete test series
              </p>
            </div>
            <button
              onClick={() => setShowRankBoosterModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg whitespace-nowrap"
            >
              View Plans →
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose Category</h3>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === cat.id
                  ? `${cat.color} text-white shadow-lg`
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
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Available Free Tests ({filteredTests.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <div
                  key={test.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-green-200 hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-gray-900 flex-1">
                      {test.name}
                    </h4>
                    <span className="text-2xl">🆓</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {test.description}
                  </p>

                  <div className="flex gap-2 mb-4 text-sm flex-wrap">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                      📚 {test.category?.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                      ✓ {test.questions?.length || 50} Questions
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartTest(test)}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold hover:shadow-lg"
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
            <p className="text-xl text-gray-600">No tests in this category.</p>
          </div>
        )}
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


        {/* What You're Missing Section */}
        <div className="mt-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-6">
            🔒 What You're Missing Without Upgrading
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <span className="text-5xl mb-3 block">📚</span>
              <p className="text-4xl font-bold text-blue-600 mb-2">10+</p>
              <p className="text-gray-700 font-semibold mb-2">Premium Tests in Rank Booster</p>
              <p className="text-sm text-gray-600">Complete test coverage you're missing</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <span className="text-5xl mb-3 block">📅</span>
              <p className="text-4xl font-bold text-purple-600 mb-2">3</p>
              <p className="text-gray-700 font-semibold mb-2">Years of PYQs</p>
              <p className="text-sm text-gray-600">2023-2025 complete question bank</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <span className="text-5xl mb-3 block">🎯</span>
              <p className="text-4xl font-bold text-green-600 mb-2">200+</p>
              <p className="text-gray-700 font-semibold mb-2">Target Score</p>
              <p className="text-sm text-gray-600">With Rank Booster strategies</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowRankBoosterModal(true)}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-transform"
            >
              🚀 Unlock Rank Booster - Just ₹99
            </button>
            <p className="mt-3 text-sm text-gray-600">
              ⚡ Only ₹3/day for 30 days of complete access
            </p>
          </div>
        </div>

        {/* Comparison Section - Free vs Paid */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
          <h3 className="text-3xl font-bold text-center mb-8">
            Choose Your Learning Path 🎓
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="border-2 border-green-300 rounded-xl p-6 bg-green-50">
              <div className="text-center mb-4">
                <span className="text-5xl mb-2 block">🆓</span>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Free Tests</h4>
                <p className="text-4xl font-bold text-green-600 mb-1">₹0</p>
                <p className="text-sm text-gray-600">Current Plan</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">{dheyaTests.length} Free Tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">Basic Analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">Unlimited Attempts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span className="text-sm text-gray-500">No PYQ Access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span className="text-sm text-gray-500">No Mock Tests</span>
                </li>
              </ul>
              <button
                disabled
                className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg font-bold cursor-not-allowed"
              >
                Current Plan
              </button>
            </div>

            {/* Rank Booster - RECOMMENDED */}
            <div className="border-4 border-blue-500 rounded-xl p-6 bg-blue-50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                RECOMMENDED
              </div>
              <div className="text-center mb-4 mt-2">
                <span className="text-5xl mb-2 block">🚀</span>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Rank Booster</h4>
                <p className="text-4xl font-bold text-blue-600 mb-1">₹99</p>
                <p className="text-sm text-gray-600">₹3/day only!</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">10+ Premium Tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">2023-2025 Complete PYQs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">3 Full Mock Tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">Detailed Analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">WhatsApp Support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-xl"
              >
                Upgrade Now →
              </button>
            </div>

            {/* Foundation */}
            <div className="border-2 border-purple-300 rounded-xl p-6 bg-purple-50">
              <div className="text-center mb-4">
                <span className="text-5xl mb-2 block">💎</span>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Foundation</h4>
                <p className="text-4xl font-bold text-purple-600 mb-1">₹4,999</p>
                <p className="text-sm text-gray-600 line-through">₹12,000</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">80+ Complete Test Series</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">2005-2025 Full PYQ Bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">51 Mock Tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">Advanced Analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span className="text-sm font-semibold">Priority 24/7 Support</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold hover:shadow-xl"
              >
                Get Foundation →
              </button>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Take Your Preparation to the Next Level?
          </h3>
          <p className="text-lg mb-6 text-white/90">
            Join 5,000+ students who upgraded and achieved their dream scores
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl hover:bg-gray-100 shadow-2xl hover:scale-105 transition-transform"
            >
              🚀 Start with Rank Booster - ₹99
            </button>
            <button
              onClick={() => {
                setShowRankBoosterModal(true);
              }}
              className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-bold text-xl hover:bg-white/10 hover:scale-105 transition-transform"
            >
              💎 Explore Foundation - ₹4,999
            </button>
          </div>
          <p className="mt-4 text-sm text-white/80">
            💯 100% Exam Succes Guarantee • 🔒 Secure Payment • ⚡ Instant Access
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions ❓
          </h3>

          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                What's the difference between Free, Rank Booster, and Foundation?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Free tests give you basic practice. Rank Booster (₹99) adds 10+ premium tests and 2023-2025 PYQs - perfect for serious preparation. Foundation (₹4,999) is our complete package with 80+ tests and 20 years of PYQs for targeting top NITs/SPAs.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Is Rank Booster worth it for just ₹99?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Absolutely! At ₹3/day for 30 days, you get access to premium tests and recent PYQs that can boost your score by 30-50 marks. It's the most affordable way to get serious about JEE B.Arch preparation.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                Can I upgrade from Free to Rank Booster to Foundation later?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Yes! You can upgrade anytime. If you upgrade from Rank Booster to Foundation, we adjust the ₹99 you already paid, so you only pay ₹4,900.
              </p>
            </details>

            <details className="bg-gray-50 p-4 rounded-lg">
              <summary className="font-semibold cursor-pointer">
                How to upgrading Works?
              </summary>
              <p className="mt-2 text-sm text-gray-600">
                Call or Whatsapp on 7028140857
              </p>
            </details>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 flex-wrap text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💯</span>
              <span className="text-sm">Exam Succes Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-sm">Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">© 2024 Moghes Institute. All rights reserved.</p>
          <p className="text-sm text-gray-500 mb-4">Trusted by 10,000+ JEE B.Arch aspirants</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
            <a href="https://wa.me/917028140857" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
              📞 WhatsApp: +91 7028140857
            </a>
          </div>
        </div>
      </footer>

    </div>
  );

}
