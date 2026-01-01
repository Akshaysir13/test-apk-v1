// src/pages/DheyaDashboard.tsx - FREE TIER DASHBOARD

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';
import { DheyaContactModal } from '../components/DheyaContactModal';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 🔗 SUPABASE CLIENT
// ==========================================
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function DheyaDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // ==========================================
  // 📝 CONTACT MODAL STATES
  // ==========================================
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedTestForModal, setSelectedTestForModal] = useState<any>(null);
  const [checkingContact, setCheckingContact] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Only show Dheya (free) tests
  const dheyaTests = tests.filter(test => test.course === 'dheya');
  
  // Apply category filter
  const filteredTests = selectedCategory === 'all' 
    ? dheyaTests 
    : dheyaTests.filter(t => t.category === selectedCategory);

  // ==========================================
  // 🚀 START TEST WITH CONTACT CHECK
  // ==========================================
  const handleStartTest = async (test: any) => {
    setCheckingContact(true);
    
    try {
      // Check if contact info already exists
      const { data, error } = await supabase
        .from('student_contact_info')
        .select('*')
        .eq('student_email', currentUser.email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking contact info:', error);
      }

      if (data) {
        // Contact info exists - start test directly
        console.log('✅ Contact info already exists, starting test...');
        selectTest(test);
        navigate('/test');
      } else {
        // No contact info - show modal
        console.log('📝 No contact info found, showing modal...');
        setSelectedTestForModal(test);
        setShowContactModal(true);
      }
    } catch (err) {
      console.error('Error:', err);
      // On error, just start the test anyway
      selectTest(test);
      navigate('/test');
    } finally {
      setCheckingContact(false);
    }
  };

  // ==========================================
  // ✅ CONTACT MODAL HANDLERS
  // ==========================================
  const handleContactSuccess = () => {
    setShowContactModal(false);
    if (selectedTestForModal) {
      selectTest(selectedTestForModal);
      navigate('/test');
    }
  };

  const handleContactCancel = () => {
    setShowContactModal(false);
    setSelectedTestForModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==========================================
          📋 CONTACT COLLECTION MODAL
          ========================================== */}
      <DheyaContactModal
        isOpen={showContactModal}
        userEmail={currentUser.email}
        testName={selectedTestForModal?.name || ''}
        testId={selectedTestForModal?.id || ''}
        onSuccess={handleContactSuccess}
        onCancel={handleContactCancel}
      />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {currentUser.email}
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mt-2 inline-block">
                📚 Dheya Course (Free)
              </span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
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
                    disabled={checkingContact}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {checkingContact ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="none" 
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                          />
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      'Start Test'
                    )}
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