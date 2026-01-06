import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Medal, Crown, Star, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  testName: string;
  date: string;
}

export default function Leaderboard() {
  const { isAuthenticated, currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [availableTests, setAvailableTests] = useState<string[]>([]);

  useEffect(() => {
    fetchLeaderboard();
    fetchAvailableTests();
  }, [selectedTest]);

  const fetchAvailableTests = async () => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('test_name')
        .order('test_name');

      if (error) throw error;

      const uniqueTests = [...new Set(data.map(item => item.test_name))];
      setAvailableTests(uniqueTests);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('test_results')
        .select('*')
        .order('score', { ascending: false })
        .order('submitted_at', { ascending: true });

      if (selectedTest !== 'all') {
        query = query.eq('test_name', selectedTest);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group by user_email and keep only their best score per test
      const bestScores = new Map();
      data.forEach(result => {
        const key = `${result.user_email}-${result.test_name}`;
        if (!bestScores.has(key) || bestScores.get(key).score < result.score) {
          bestScores.set(key, result);
        }
      });

      // Convert to array and add ranks
      const entries: LeaderboardEntry[] = Array.from(bestScores.values())
        .sort((a, b) => b.score - a.score)
        .map((result, index) => ({
          rank: index + 1,
          name: result.user_email,
          score: result.score,
          totalQuestions: result.total_questions,
          percentage: result.percentage,
          testName: result.test_name,
          date: new Date(result.submitted_at).toLocaleDateString(),
        }));

      setLeaderboard(entries);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  // Highlight current user's row
  const isCurrentUser = (email: string) => {
    return currentUser?.email === email;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-300" size={36} />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Leaderboard</h1>
                  <p className="text-blue-100 text-sm">Top performers across all tests</p>
                </div>
              </div>
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {/* Filter by test */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Test
              </label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tests</option>
                {availableTests.map(test => (
                  <option key={test} value={test}>{test}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin text-blue-600" size={40} />
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="mx-auto mb-4 text-gray-300" size={64} />
                <p className="text-lg font-semibold">No results yet</p>
                <p className="text-sm">Be the first to complete a test!</p>
              </div>
            ) : (
              <>
                <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 mb-4 px-4">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-4">Student</div>
                  <div className="col-span-2 text-center">Score</div>
                  <div className="col-span-2 text-center">Percentage</div>
                  <div className="col-span-3">Test</div>
                </div>

                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div
                      key={`${entry.name}-${entry.testName}-${entry.rank}`}
                      className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg border-2 ${getRankBgColor(entry.rank)} transition hover:shadow-md ${
                        isCurrentUser(entry.name) ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="col-span-10 md:col-span-4">
                        <div className="font-semibold text-gray-800">
                          {entry.name}
                          {isCurrentUser(entry.name) && (
                            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">You</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 md:hidden">{entry.testName}</div>
                      </div>
                      <div className="col-span-4 md:col-span-2 text-center">
                        <div className="font-bold text-blue-600 text-lg">{entry.score}</div>
                        <div className="text-xs text-gray-500">/{entry.totalQuestions * 4}</div>
                      </div>
                      <div className="col-span-4 md:col-span-2 text-center">
                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <Star size={14} />
                          {entry.percentage}%
                        </div>
                      </div>
                      <div className="hidden md:block col-span-3">
                        <div className="text-sm text-gray-700">{entry.testName}</div>
                        <div className="text-xs text-gray-400">{entry.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Rankings are updated after each test submission</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
