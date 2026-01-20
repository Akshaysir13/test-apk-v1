import { useState, useEffect } from 'react';
// 🔧 STEP 1: Uncomment this line in your actual React Router app
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // 🔧 STEP 2: Uncomment this line in your actual React Router app
const navigate = useNavigate();

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Exit intent popup
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        setShowExitPopup(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // 🔧 STEP 3: REPLACE this entire function with just the comment below
  const handleNavigation = (path) => {
    alert(`Navigation to: ${path}\n(In a real app, this would use React Router)`);
  };
  
  // 🔧 In your React Router app, DELETE the handleNavigation function above
  // 🔧 Then do a Find & Replace:
  // 🔧 Find: navigate('/
  // 🔧 Replace with: navigate('/
  // 🔧 This will change all instances like:
  // 🔧 navigate('/login') → navigate('/login')
  // 🔧 navigate('/free-tests') → navigate('/free-tests')

  const courses = [
    {
      id: 'dheya',
      name: 'Dheya Course',
      icon: '🆓',
      price: 'FREE',
      originalPrice: null,
      description: 'Start your JEE B.Arch journey with free tests',
      features: [
        '6 Free PYQ Tests (2023-2025)',
        'Basic Performance Tracking',
        'Instant Results & Solutions',
        'Unlimited Attempts',
        'Perfect to Start Learning'
      ],
      highlight: false,
      popular: false,
      badge: null,
      buttonText: 'Start Free Tests',
      buttonAction: () => navigate('/free-tests'),
      buttonColor: 'bg-gradient-to-r from-green-600 to-teal-600',
      testimonial: { name: "Amit K.", text: "Great way to start preparation!" }
    },
    {
      id: 'rank_booster',
      name: 'Rank Booster',
      icon: '🚀',
      price: '₹99',
      originalPrice: '₹299',
      description: 'Budget-friendly complete test series for quick revision',
      features: [
        '10+ Premium Mock Tests',
        '400+ Practice Questions',
        'Complete 2023-2025 PYQs',
        'Detailed Performance Analytics',
        'Latest Pattern Tests 2026',
        'All Free Tests Included',
        'Whatsapp Support'
      ],
      highlight: true,
      popular: true,
      badge: '🔥 MOST POPULAR',
      buttonText: 'Get Rank Booster',
      buttonAction: () => navigate('/login'),
      buttonColor: 'bg-gradient-to-r from-blue-600 to-purple-600',
      testimonial: { name: "40+ Students", text: "Best ₹99 I ever spent!" }
    },
    {
      id: 'foundation',
      name: 'Foundation Course',
      icon: '💎',
      price: '₹4,999',
      originalPrice: '₹12,000',
      description: 'Complete preparation package - Everything you need to crack JEE B.Arch',
      features: [
        '80+ Comprehensive Tests',
        '6000+ Practice Questions',
        'Complete PYQ Bank (2005-2025)',
        'White, Blue, Grey Mock Tests',
        'Advanced Analytics Dashboard',
        '99 Percentile Strategy Guide',
        'Priority 24/7 Support',
        'All Previous Tests Included',
        'Doubt Resolution',
        'Study Material Included'
      ],
      highlight: true,
      popular: true,
      badge: '💎 BEST VALUE',
      buttonText: 'Get Foundation',
      buttonAction: () => navigate('/login'),
      buttonColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      testimonial: { name: "Mihika T", text: "AIR 23, got into SPA!" }
    },
    {
      id: 'advance_2026',
      name: 'Advance Test Series 2026',
      icon: '🔥',
      price: '₹999',
      originalPrice: '₹1,500',
      description: 'Advanced mock tests for top rank aspirants targeting 99+ percentile',
      features: [
        '15+ Advanced Level Tests',
        'Exact JEE B.Arch Pattern',
        'Full-Length Mock Tests',
        'In-depth Solutions',
        'Rank Predictor',
        'Performance Comparison',
        'Expert Tips & Tricks'
      ],
      highlight: true,
      popular: false,
      badge: '⚡ Coming SOON!!!!',
      buttonText: 'Get Advance 2026',
      buttonAction: () => navigate('/login'),
      buttonColor: 'bg-gradient-to-r from-red-600 to-orange-600',
      testimonial: { name: "", text: "Perfect for final month revision!" }
    },
  ];

  const faqs = [
    {
      q: "Can I start with free tests before buying?",
      a: "Yes! Start with our 6 free Dheya tests. No payment required. You can upgrade anytime to Rank Booster (₹99) or Foundation (₹4,999)."
    },
    {
      q: "What's the difference between Rank Booster and Foundation?",
      a: "Rank Booster has 10+ tests (₹99) for quick revision. Foundation has 80+ tests with complete PYQ bank 2005-2025 (₹4,999) for comprehensive preparation."
    },
    {
      q: "Are the tests similar to actual JEE B.Arch exam?",
      a: "Yes! All our tests are based on actual Previous Year Questions (PYQs) and follow the exact JEE B.Arch pattern and difficulty level."
    },
    {
      q: "How long do I get access after payment?",
      a: "You get access until JEE B.Arch 2026 exam (June 2026). That's 6+ months of unlimited practice and revisions."
    },
    {
      q: "Can I switch from Rank Booster to Foundation later?",
      a: "Absolutely! Upgrade anytime and we'll adjust the price difference. Your progress is saved automatically."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Exit Intent Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative animate-[bounce_1s_ease-in-out]">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
            >
              ×
            </button>
            
            <div className="text-center">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Wait! Before You Go...
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                Get <strong>67% OFF</strong> on all courses for the next <strong>48 hours</strong> only!
              </p>
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl mb-6 border-2 border-red-200">
                <p className="text-lg font-semibold text-gray-900 mb-3">
                  🎁 Special Exit Offer:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Rank Booster</p>
                    <p className="text-2xl font-bold text-blue-600">₹99 <span className="text-sm line-through text-gray-400">₹299</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Foundation</p>
                    <p className="text-2xl font-bold text-purple-600">₹4,999 <span className="text-sm line-through text-gray-400">₹12,000</span></p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowExitPopup(false);
                  navigate('/login');
                }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl mb-3"
              >
                Claim My Discount Now →
              </button>
              <button
                onClick={() => setShowExitPopup(false)}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                No thanks, I'll pay full price later
              </button>
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
                onClick={() => navigate('/free-tests')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold text-sm md:text-base"
              >
                Free Tests
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-semibold text-sm md:text-base"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
              🏆 Trusted by 10,000+ JEE B.Arch Aspirants
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Crack JEE B.Arch 2026 with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Real PYQs</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Practice with <strong>India's largest Question bank (10000+ Questions)</strong> Designed & Collected by SPA & NIT experts
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-4xl font-bold text-blue-600">80+</p>
              <p className="text-sm text-gray-600">Mock Tests</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-4xl font-bold text-green-600">2000+</p>
              <p className="text-sm text-gray-600">Students</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-4xl font-bold text-purple-600">20 Yrs</p>
              <p className="text-sm text-gray-600">PYQ Bank</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-4xl font-bold text-orange-600">4.8⭐</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/free-tests')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-transform"
            >
              🆓 Start Free Tests
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-transform"
            >
              🚀 View All Courses
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            ✅ No credit card required • ✅ Start practicing in 30 seconds
          </p>
        </div>
      </div>

      {/* Social Proof Banner */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 flex-wrap text-white">
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm">Success Stories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">96%ile</p>
              <p className="text-sm">Average Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">99%ile</p>
              <p className="text-sm">Top Performers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">1 in 3 SPA/NIT</p>
              <p className="text-sm">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Path to Success
          </h3>
          <p className="text-xl text-gray-600">
            Start free, upgrade anytime • All plans include instant access
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                course.highlight ? 'ring-4 ring-purple-400' : ''
              }`}
            >
              {course.badge && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
                  {course.badge}
                </div>
              )}

              <div className="p-6">
                {/* Icon & Title */}
                <div className="text-center mb-6">
                  <span className="text-6xl mb-3 block">{course.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {course.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {course.price}
                    </span>
                    {course.originalPrice && (
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-400 line-through">
                          {course.originalPrice}
                        </span>
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                          {Math.round((1 - parseInt(course.price.replace(/[^0-9]/g, '')) / parseInt(course.originalPrice.replace(/[^0-9]/g, ''))) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  {course.id === 'rank_booster' && (
                    <p className="text-sm text-gray-500">Just ₹3/day for 30 days!</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6 min-h-[3rem]">
                  {course.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {course.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Testimonial */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4 border-l-4 border-blue-400">
                  <p className="text-xs text-gray-600 italic">
                    "{course.testimonial.text}"
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-semibold">
                    - {course.testimonial.name}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={course.buttonAction}
                  className={`w-full py-4 ${course.buttonColor} text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all`}
                >
                  {course.buttonText} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-green-50 border-2 border-green-200 px-6 py-4 rounded-xl">
            <span className="text-4xl">💯</span>
            <div className="text-left">
              <p className="font-bold text-gray-900">100% Exam Succes Guarantee</p>
              <p className="text-sm text-gray-600">Proven Track Record</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-12">
            📊 Compare All Plans
          </h3>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-center">
                      <div className="font-bold">🆓 Free</div>
                      <div className="text-xs font-normal">Dheya</div>
                    </th>
                    <th className="px-6 py-4 text-center bg-white/10">
                      <div className="font-bold">🚀 ₹99</div>
                      <div className="text-xs font-normal">Rank Booster</div>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <div className="font-bold">💎 ₹4,999</div>
                      <div className="text-xs font-normal">Foundation</div>
                    </th>
                    <th className="px-6 py-4 text-center bg-white/10">
                      <div className="font-bold">🔥 ₹999</div>
                      <div className="text-xs font-normal">Advance 2026</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Number of Tests', values: ['6', '10+', '80+', '15+'] },
                    { feature: 'PYQ Coverage', values: ['2023-2025', '2023-2025', '2005-2025 ✓', 'Full Mock Test'] },
                    { feature: 'Mock Tests', values: ['Basic', 'Standard', 'Comprehensive ✓', 'Advanced'] },
                    { feature: 'Performance Analytics', values: ['❌', '✓ Basic', '✓ Advanced', '✓ Advanced'] },
                    { feature: 'Solutions', values: ['✓ Basic', '✓ Detailed', '✓ Expert Level', '✓ Detailed'] },
                    { feature: 'Support', values: ['Community', 'Whatsapp', 'Priority 24/7 ✓', 'Whatsapp'] },
                    { feature: 'Study Material', values: ['❌', '❌', '✓ Included', '❌'] },
                    { feature: 'Doubt Resolution', values: ['❌', '❌', '✓ Included', 'Whatsapp or Call'] }
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{row.feature}</td>
                      {row.values.map((value, vIdx) => (
                        <td 
                          key={vIdx} 
                          className={`px-6 py-4 text-center ${vIdx === 1 ? 'bg-blue-50' : vIdx === 2 ? 'bg-purple-50' : vIdx === 3 ? 'bg-orange-50' : ''}`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

      {/* YouTube Channel Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <span className="text-6xl mb-4 block">📺</span>
          <h3 className="text-4xl font-bold mb-4">
            Learn from Our YouTube Channel
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            <strong>10,400+ subscribers</strong> • Free PYQ solutions, strategy videos, and study tips
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://youtube.com/@MoghesInstitute"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-2xl hover:scale-105 transition-transform"
            >
              📺 Subscribe to Our Channel
            </a>
            <button
              onClick={() => navigate('/free-tests')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/20"
            >
              🆓 Start Free Tests
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-12">
          ❓ Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <span className="text-2xl text-blue-600 flex-shrink-0">
                  {expandedFaq === idx ? '−' : '+'}
                </span>
              </button>
              {expandedFaq === idx && (
                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Ace JEE B.Arch 2026?
          </h3>
          <p className="text-xl mb-8">
            Join 10,000+ students who are already preparing with India's best PYQ platform
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/free-tests')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-2xl hover:scale-105 transition-transform"
            >
              🆓 Start Free Tests Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg border-2 border-white hover:shadow-2xl hover:scale-105 transition-transform"
            >
              🚀 Get Premium Access
            </button>
          </div>

          <p className="mt-6 text-sm">
            ⏰ Limited time: Offers 
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Moghe's Institute</h4>
              <p className="text-gray-400 text-sm">
                India's most trusted JEE B.Arch preparation platform with 20+ years of PYQ coverage.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/free-tests')} className="hover:text-white">Free Tests</button></li>
                <li><button onClick={() => navigate('/courses')} className="hover:text-white">All Courses</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://youtube.com/@MoghesInstitute" target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube Channel</a></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white">Blog</button></li>
                <li><button onClick={() => navigate('/success-stories')} className="hover:text-white">Success Stories</button></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-white">FAQs</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 support@moghesinstitute.com</li>
                <li>📱 +91 7028140857</li>
                <li>🕒 Mon-Sat: 9 AM - 7 PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Moghe's Institute. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => navigate('/terms')} className="hover:text-white">Terms of Service</button>
              <span>•</span>
              <button onClick={() => navigate('/refund')} className="hover:text-white">Refund Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}