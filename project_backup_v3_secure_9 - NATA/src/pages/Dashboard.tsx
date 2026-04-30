// src/pages/Dashboard.tsx - MULTI-TIER DASHBOARD

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTest, testCategories } from '../contexts/TestContext';
import { TestHistory } from '../components/TestHistory';
import ScreenshotBlocker from '../components/ScreenshotBlocker';
import { foundationMaterials } from '../data/materials';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { tests, selectTest } = useTest();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tests' | 'history' | 'materials'>('tests');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [showMaterialsBlocker, setShowMaterialsBlocker] = useState(false);
  const materialsViewerRef = useRef<HTMLDivElement | null>(null);

  // Screenshot blocking for Study Materials (same logic as Test / Test History)
  useEffect(() => {
    if (activeTab !== 'materials' || !selectedMaterialId) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setShowMaterialsBlocker(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setShowMaterialsBlocker(true);
      }
      if (e.metaKey && e.shiftKey && e.key === 's') {
        e.preventDefault();
        setShowMaterialsBlocker(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) setShowMaterialsBlocker(true);
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
    };
  }, [activeTab, selectedMaterialId]);

  // Fullscreen enforcement for Study Materials (mirrors Test page logic, simplified)
  useEffect(() => {
    if (activeTab !== 'materials' || !selectedMaterialId) return;

    const doc = document as Document & {
      fullscreenElement?: Element | null;
      webkitFullscreenElement?: Element | null;
      msFullscreenElement?: Element | null;
    };

    const getFullscreenElement = () =>
      doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement ?? null;

    const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (!isDesktop) return;

    const enterFullscreen = () => {
      const el = materialsViewerRef.current || document.documentElement;
      if (!el) return;
      if (getFullscreenElement()) return;

      const reqFs =
        el.requestFullscreen ??
        (el as any).webkitRequestFullscreen ??
        (el as any).msRequestFullscreen;

      if (reqFs) {
        (reqFs.call(el) as Promise<void>).catch(() => {
          // If user rejects fullscreen, still show blocker so screen goes black
          setShowMaterialsBlocker(true);
        });
      }
    };

    const handleFullscreenChange = () => {
      const inFs = !!getFullscreenElement();
      if (!inFs && activeTab === 'materials') {
        // Exited fullscreen while viewing materials -> black screen
        setShowMaterialsBlocker(true);
      }
    };

    const evtName =
      document.exitFullscreen
        ? 'fullscreenchange'
        : (document as any).webkitExitFullscreen
        ? 'webkitfullscreenchange'
        : 'MSFullscreenChange';

    enterFullscreen();
    document.addEventListener(evtName, handleFullscreenChange);

    return () => {
      document.removeEventListener(evtName, handleFullscreenChange);
    };
  }, [activeTab, selectedMaterialId]);

  const handleMaterialsBlockerDismiss = () => {
    const el = materialsViewerRef.current || document.documentElement;
    const reqFs =
      el.requestFullscreen ??
      (el as any).webkitRequestFullscreen ??
      (el as any).msRequestFullscreen;

    if (reqFs) {
      (reqFs.call(el) as Promise<void>)
        .then(() => {
          // Back to fullscreen, hide blocker
          setShowMaterialsBlocker(false);
        })
        .catch(() => {
          // If fullscreen fails, still allow user to continue
          setShowMaterialsBlocker(false);
        });
    } else {
      setShowMaterialsBlocker(false);
    }
  };

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
      {showMaterialsBlocker && (
        <ScreenshotBlocker onEnterFullscreen={handleMaterialsBlockerDismiss} />
      )}
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
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'materials'
              ? 'border-b-2 border-purple-500 text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            📄 Study Materials
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'materials' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              📄 Study Materials
            </h2>
            <p className="text-gray-600">
              Select a material to view it below. PDFs open in the viewer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foundationMaterials.map(material => {
                const isSelected = selectedMaterialId === material.id;
                return (
                  <button
                    key={material.id}
                    type="button"
                    onClick={() => setSelectedMaterialId(material.id)}
                    className={`block w-full text-left bg-white p-6 rounded-lg shadow transition-shadow border-2 ${
                      isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-200 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">
                        {material.type === 'pdf' ? '📕' : material.type === 'video' ? '🎬' : '📄'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {material.title}
                        </h3>
                        {material.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {material.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-block mt-3 text-sm font-medium ${isSelected ? 'text-purple-600' : 'text-gray-500'}`}>
                      {isSelected ? '✓ Viewing' : 'View'}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedMaterialId && (() => {
              const material = foundationMaterials.find(m => m.id === selectedMaterialId);
              if (!material) return null;
              const embedUrl = material.url.replace('/view', '/preview').split('?')[0];
              const viewerHeight = 'min(80vh, 700px)';
              return (
                <div
                  ref={materialsViewerRef}
                  className="relative bg-white rounded-lg shadow border-2 border-purple-200 overflow-hidden"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  <div className="px-4 py-2 bg-purple-50 border-b border-purple-200 relative z-30">
                    <h3 className="font-semibold text-gray-900">{material.title}</h3>
                  </div>
                  {/* Watermark overlay with student identity */}
                  <div
                    className="pointer-events-none select-none"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      opacity: 0.05,
                      transform: 'rotate(-30deg)',
                      zIndex: 25,
                      fontSize: '2.0rem',
                      fontWeight: 600,
                      color: '#111827',
                      textAlign: 'center',
                      padding: '2.5rem',
                      lineHeight: 3.6,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <span key={idx}>
                        {`${currentUser?.email || 'Registered Student'} • ${currentUser?.email || 'Registered Student'} • ${currentUser?.email || 'Registered Student'}`}
                      </span>
                    ))}
                  </div>
                  <div className="relative" style={{ height: viewerHeight }}>
                    {/* Screenshot blacking - black bars on sides (same as Test / Test History) */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-black pointer-events-none z-20" aria-hidden />
                    <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-black pointer-events-none z-20" aria-hidden />
                    {/* Cover Pop Out button in Drive viewer toolbar */}
                    <div
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 z-30"
                      style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.05)' }}
                      aria-hidden
                      title=""
                    />
                    <iframe
                      title={material.title}
                      src={embedUrl}
                      className="w-full border-0 absolute inset-0"
                      style={{ height: viewerHeight }}
                      allow="autoplay"
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        ) : activeTab === 'tests' ? (
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
                <p className="text-2xl font-bold text-green-600">2999/- ( February )</p>

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