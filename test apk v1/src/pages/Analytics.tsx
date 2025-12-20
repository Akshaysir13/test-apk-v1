import { Link } from 'react-router-dom';
import { BarChart3, ArrowLeft, TrendingUp, Target, Clock, Award, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PerformanceData {
  testName: string;
  date: string;
  score: number;
  maxScore: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  timeTaken: number;
  totalTime: number;
}

const mockPerformanceData: PerformanceData[] = [
  { testName: 'White Mock Test 1', date: '2024-11-28', score: 156, maxScore: 200, correct: 42, incorrect: 6, unattempted: 2, timeTaken: 3200, totalTime: 3600 },
  { testName: 'Blue Mock Test 1', date: '2024-11-25', score: 140, maxScore: 200, correct: 38, incorrect: 8, unattempted: 4, timeTaken: 3400, totalTime: 3600 },
  { testName: 'Grey Mock Test 1', date: '2024-11-22', score: 128, maxScore: 200, correct: 35, incorrect: 9, unattempted: 6, timeTaken: 3100, totalTime: 3600 },
  { testName: 'PYQ 2024', date: '2024-11-18', score: 148, maxScore: 200, correct: 40, incorrect: 8, unattempted: 2, timeTaken: 3500, totalTime: 3600 },
];

export default function Analytics() {
  const { isAuthenticated, currentUser } = useAuth();

  const totalTests = mockPerformanceData.length;
  const avgScore = Math.round(mockPerformanceData.reduce((acc, d) => acc + d.score, 0) / totalTests);
  const avgPercentage = Math.round(mockPerformanceData.reduce((acc, d) => acc + (d.score / d.maxScore * 100), 0) / totalTests);
  const totalCorrect = mockPerformanceData.reduce((acc, d) => acc + d.correct, 0);
  const totalIncorrect = mockPerformanceData.reduce((acc, d) => acc + d.incorrect, 0);
  const totalUnattempted = mockPerformanceData.reduce((acc, d) => acc + d.unattempted, 0);
  const accuracyRate = Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <BarChart3 className="text-blue-600 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600 mb-6">Please login to view your performance analytics</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-white" size={36} />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Performance Analytics</h1>
                  <p className="text-purple-100 text-sm">{currentUser?.email}</p>
                </div>
              </div>
              <Link
                to="/test"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={20} />
                  <span className="text-sm opacity-90">Tests Taken</span>
                </div>
                <div className="text-3xl font-bold">{totalTests}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={20} />
                  <span className="text-sm opacity-90">Avg Score</span>
                </div>
                <div className="text-3xl font-bold">{avgScore}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} />
                  <span className="text-sm opacity-90">Avg %</span>
                </div>
                <div className="text-3xl font-bold">{avgPercentage}%</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={20} />
                  <span className="text-sm opacity-90">Accuracy</span>
                </div>
                <div className="text-3xl font-bold">{accuracyRate}%</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-4">
                <CheckCircle className="text-green-600" size={40} />
                <div>
                  <div className="text-sm text-green-600 font-medium">Total Correct</div>
                  <div className="text-2xl font-bold text-green-700">{totalCorrect}</div>
                </div>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-4">
                <XCircle className="text-red-600" size={40} />
                <div>
                  <div className="text-sm text-red-600 font-medium">Total Incorrect</div>
                  <div className="text-2xl font-bold text-red-700">{totalIncorrect}</div>
                </div>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <Clock className="text-gray-600" size={40} />
                <div>
                  <div className="text-sm text-gray-600 font-medium">Unattempted</div>
                  <div className="text-2xl font-bold text-gray-700">{totalUnattempted}</div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Test History</h2>
            <div className="space-y-4">
              {mockPerformanceData.map((data, idx) => (
                <div key={idx} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{data.testName}</h3>
                      <p className="text-sm text-gray-500">{data.date}</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{data.score}/{data.maxScore}</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{data.correct}</div>
                        <div className="text-xs text-gray-500">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{data.incorrect}</div>
                        <div className="text-xs text-gray-500">Wrong</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{Math.round(data.score / data.maxScore * 100)}%</div>
                        <div className="text-xs text-gray-500">Percentage</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(data.score / data.maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
