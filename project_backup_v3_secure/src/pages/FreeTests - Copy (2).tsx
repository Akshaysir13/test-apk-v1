// src/pages/FreeTests.tsx - CONVERSION OPTIMIZED
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPopup, setShowPopup] = useState(false);
  
  // ==========================================
  // 📝 CONTACT MODAL STATES
  // ==========================================
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedTestForModal, setSelectedTestForModal] = useState<any>(null);
  const [tempEmail, setTempEmail] = useState('');

  // Show upgrade popup after viewing 3 tests
  useEffect(() => {
    const viewCount = parseInt(localStorage.getItem('freeTestViews') || '0');
    if (viewCount >= 3) {
      setShowPopup(true);
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

  // ==========================================
  // 🚀 START TEST - SHOW CONTACT MODAL FIRST
  // ==========================================
  const handleStartTest = async (test: any) => {
    // Track views for popup
    const viewCount = parseInt(localStorage.getItem('freeTestViews') || '0');
    localStorage.setItem('freeTestViews', String(viewCount + 1));
    
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
  const handleContactSuccess = () => {
    setShowContactModal(false);
    
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

      {/* Upgrade Popup - Appears after 3 test views */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative animate-bounce-in">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">🎯</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                Loving the Free Tests?
              </h3>
              <p className="text-gray-600 text-lg">
                Get 70+ more tests and ace JEE B.Arch 2026!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                <span className="text-4xl mb-2 block">🚀</span>
                <h4 className="text-xl font-bold mb-2">Rank Booster</h4>
                <p className="text-3xl font-bold text-blue-600 mb-3">₹99</p>
                <p className="text-sm text-gray-600 mb-3">₹3/day for 30 days!</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li>✓ 10+ Premium Tests</li>
                  <li>✓ 2023-2025 Complete PYQs</li>
                  <li>✓ Detailed Analytics</li>
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Upgrade Now
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                <span className="text-4xl mb-2 block">💎</span>
                <h4 className="text-xl font-bold mb-2">Foundation</h4>
                <p className="text-3xl font-bold text-purple-600 mb-3">₹4,999</p>
                <p className="text-sm text-gray-600 mb-3 line-through">₹12,000</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li>✓ 80+ Complete Test Series</li>
                  <li>✓ 2005-2025 PYQ Bank</li>
                  <li>✓ 99 Percentile Strategy</li>
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
                >
                  Get Foundation
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              🔒 Limited time offer • ⏰ Expires in 48 hours
            </p>
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
                onClick={() => navigate('/login')}
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
          <p className="font-semibold flex items-center justify-center gap-2 flex-wrap">
            <span className="animate-pulse">🔥</span>
            <span>FLASH SALE: 60% OFF Foundation Course</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Ends in 48 hours</span>
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
        {/* Locked Content Teaser */}
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🔒 70+ Premium Tests Locked
              </h3>
              <p className="text-gray-600">
                Upgrade to access complete test series (2005-2025 PYQs)
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-lg whitespace-nowrap"
            >
              Unlock Now →
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
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === cat.id
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
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Available Tests ({filteredTests.length})
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

        {/* Rest of your existing content - Comparison Table, Testimonials, etc. */}
        {/* ... keeping all your existing sections ... */}

      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">© 2024 Moghes Institute. All rights reserved.</p>
          <p className="text-sm text-gray-500">Trusted by 10,000+ JEE B.Arch aspirants</p>
        </div>
      </footer>
    </div>
  );
}