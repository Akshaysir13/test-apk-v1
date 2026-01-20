import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { addStudent } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPendingMessage, setShowPendingMessage] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = addStudent(email, password, false);
    if (result.success) {
      setShowPendingMessage(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.message);
    }
  };

  if (showPendingMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="text-orange-500" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Pending Approval</h1>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully! However, it requires administrator approval before you can access the portal.
          </p>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-800 text-sm">
              Please wait for the admin to review and approve your account. You will be able to login once approved.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <UserPlus className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          </div>
          <p className="text-gray-600">Join JEE B.Arch Mock Test Portal</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
