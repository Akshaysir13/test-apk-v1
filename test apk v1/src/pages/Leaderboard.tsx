import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Medal, Crown, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  testName: string;
  date: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Rahul Sharma', score: 180, totalQuestions: 50, percentage: 90, testName: 'White Mock Test 1', date: '2024-11-28' },
  { rank: 2, name: 'Priya Patel', score: 172, totalQuestions: 50, percentage: 86, testName: 'White Mock Test 1', date: '2024-11-28' },
  { rank: 3, name: 'Amit Kumar', score: 168, totalQuestions: 50, percentage: 84, testName: 'White Mock Test 1', date: '2024-11-27' },
  { rank: 4, name: 'Sneha Gupta', score: 160, totalQuestions: 50, percentage: 80, testName: 'Blue Mock Test 1', date: '2024-11-27' },
  { rank: 5, name: 'Vikram Singh', score: 156, totalQuestions: 50, percentage: 78, testName: 'White Mock Test 1', date: '2024-11-26' },
  { rank: 6, name: 'Ananya Reddy', score: 152, totalQuestions: 50, percentage: 76, testName: 'Grey Mock Test 1', date: '2024-11-26' },
  { rank: 7, name: 'Rohan Joshi', score: 148, totalQuestions: 50, percentage: 74, testName: 'White Mock Test 1', date: '2024-11-25' },
  { rank: 8, name: 'Kavya Nair', score: 144, totalQuestions: 50, percentage: 72, testName: 'PYQ 2024', date: '2024-11-25' },
  { rank: 9, name: 'Arjun Mehta', score: 140, totalQuestions: 50, percentage: 70, testName: 'White Mock Test 1', date: '2024-11-24' },
  { rank: 10, name: 'Ishita Bansal', score: 136, totalQuestions: 50, percentage: 68, testName: 'Latest Pattern 1', date: '2024-11-24' },
];

export default function Leaderboard() {
  const { isAuthenticated } = useAuth();

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
                to={isAuthenticated ? "/test" : "/login"}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 mb-4 px-4">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Student</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Percentage</div>
              <div className="col-span-3">Test</div>
            </div>

            <div className="space-y-3">
              {mockLeaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg border-2 ${getRankBgColor(entry.rank)} transition hover:shadow-md`}
                >
                  <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="col-span-10 md:col-span-4">
                    <div className="font-semibold text-gray-800">{entry.name}</div>
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

            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Rankings are updated after each test submission</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
