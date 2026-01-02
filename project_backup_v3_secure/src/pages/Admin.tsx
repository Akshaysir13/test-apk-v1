import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Trash2, LogOut, Plus, BookOpen, User, CheckCircle, XCircle, Clock, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTest } from '../context/TestContext';

export default function Admin() {
  const navigate = useNavigate();
  const { currentUser, logout, addStudent, deleteStudent, approveStudent, rejectStudent, getPendingStudents, getApprovedStudents } = useAuth();
  const { tests, addTest, deleteTest, getAllAttempts } = useTest();
  
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newTestName, setNewTestName] = useState('');
  const [newTestDesc, setNewTestDesc] = useState('');
  const [newTestDuration, setNewTestDuration] = useState('10');
  const [adminMessage, setAdminMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filterStudent, setFilterStudent] = useState('');

  const allAttempts = getAllAttempts();
  const filteredAttempts = filterStudent 
    ? allAttempts.filter(a => a.studentEmail.toLowerCase().includes(filterStudent.toLowerCase()))
    : allAttempts;

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  const handleAddStudent = () => {
    const result = addStudent(newStudentEmail, newStudentPassword, true);
    setAdminMessage(result.message);
    if (result.success) {
      setNewStudentEmail('');
      setNewStudentPassword('');
    }
    setTimeout(() => setAdminMessage(''), 3000);
  };

  const handleDeleteStudent = (email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      deleteStudent(email);
      setAdminMessage(`Student ${email} deleted successfully!`);
      setTimeout(() => setAdminMessage(''), 3000);
    }
  };

  const handleApproveStudent = (email: string) => {
    approveStudent(email);
    setAdminMessage(`Student ${email} approved successfully!`);
    setTimeout(() => setAdminMessage(''), 3000);
  };

  const handleRejectStudent = (email: string) => {
    if (window.confirm(`Are you sure you want to reject ${email}? This will delete their account.`)) {
      rejectStudent(email);
      setAdminMessage(`Student ${email} rejected and removed.`);
      setTimeout(() => setAdminMessage(''), 3000);
    }
  };

  const handleAddTest = () => {
    const duration = parseInt(newTestDuration);
    const result = addTest(newTestName, newTestDesc, duration);
    setAdminMessage(result.message);
    if (result.success) {
      setNewTestName('');
      setNewTestDesc('');
      setNewTestDuration('10');
    }
    setTimeout(() => setAdminMessage(''), 3000);
  };

  const handleDeleteTest = (testId: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      deleteTest(testId);
      setAdminMessage('Test deleted successfully!');
      setTimeout(() => setAdminMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pendingStudents = getPendingStudents();
  const approvedStudents = getApprovedStudents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-600">Manage Students & Tests</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {adminMessage && (
            <div className={`border-2 px-4 py-3 rounded-lg mb-6 ${adminMessage.includes('success') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {adminMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <UserPlus size={24} />
                Add New Student
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    placeholder="Enter password"
                  />
                </div>
                <button
                  onClick={handleAddStudent}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Add Student
                </button>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Plus size={24} />
                Add New Test
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name
                  </label>
                  <input
                    type="text"
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                    placeholder="e.g., White Mock Test 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newTestDesc}
                    onChange={(e) => setNewTestDesc(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                    placeholder="Brief description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newTestDuration}
                    onChange={(e) => setNewTestDuration(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
                    placeholder="60"
                    min="1"
                  />
                </div>
                <button
                  onClick={handleAddTest}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Test
                </button>
              </div>
            </div>
          </div>

          {pendingStudents.length > 0 && (
            <div className="mb-6 bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
              <h2 className="text-xl font-semibold text-orange-900 mb-4 flex items-center gap-2">
                <Clock size={24} />
                Pending Approval ({pendingStudents.length})
              </h2>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {pendingStudents.map((student) => (
                  <div key={student.email} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-200">
                    <span className="text-gray-700">{student.email}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveStudent(student.email)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition text-sm"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectStudent(student.email)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition text-sm"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={24} />
                Approved Students ({approvedStudents.length})
              </h2>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {approvedStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No approved students yet</p>
                ) : (
                  approvedStudents.map((student) => (
                    <div key={student.email} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-700">{student.email}</span>
                      <button
                        onClick={() => handleDeleteStudent(student.email)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen size={24} />
                Available Tests ({tests.length})
              </h2>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {tests.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tests created yet</p>
                ) : (
                  tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div>
                        <div className="font-medium text-gray-700">{test.name}</div>
                        <div className="text-sm text-gray-500">{test.questions.length} questions | {test.duration / 60} min</div>
                      </div>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
            <button
              onClick={() => setShowResults(!showResults)}
              className="w-full flex items-center justify-between text-xl font-semibold text-indigo-900 mb-4"
            >
              <span className="flex items-center gap-2">
                <BarChart3 size={24} />
                Student Test Results ({allAttempts.length} attempts)
              </span>
              {showResults ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>

            {showResults && (
              <div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={filterStudent}
                    onChange={(e) => setFilterStudent(e.target.value)}
                    placeholder="Filter by student email..."
                    className="w-full md:w-1/2 px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {filteredAttempts.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No test results yet. Results will appear here once students complete tests.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-indigo-200 bg-indigo-100">
                          <th className="text-left py-3 px-4 text-indigo-900 font-semibold">Student</th>
                          <th className="text-left py-3 px-4 text-indigo-900 font-semibold">Test</th>
                          <th className="text-center py-3 px-4 text-indigo-900 font-semibold">Score</th>
                          <th className="text-center py-3 px-4 text-indigo-900 font-semibold">Correct</th>
                          <th className="text-center py-3 px-4 text-indigo-900 font-semibold">Wrong</th>
                          <th className="text-center py-3 px-4 text-indigo-900 font-semibold">Unattempted</th>
                          <th className="text-center py-3 px-4 text-indigo-900 font-semibold">Time</th>
                          <th className="text-center py-3 px-4 text-indigo-900 font-semibold">Violations</th>
                          <th className="text-center py-3 px-4 text-indigo-900 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttempts.map(attempt => (
                          <tr key={attempt.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700">{attempt.studentEmail}</td>
                            <td className="py-3 px-4 font-medium text-gray-800">{attempt.testName}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`font-bold ${attempt.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {attempt.score} / {attempt.totalQuestions * 4}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-green-600 font-semibold">{attempt.correctAnswers}</td>
                            <td className="py-3 px-4 text-center text-red-600 font-semibold">{attempt.wrongAnswers}</td>
                            <td className="py-3 px-4 text-center text-gray-500">{attempt.unattempted}</td>
                            <td className="py-3 px-4 text-center text-gray-600">
                              {Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                attempt.violations.length === 0 ? 'bg-green-100 text-green-700' : 
                                attempt.violations.length <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {attempt.violations.length}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-gray-500 text-sm">
                              {new Date(attempt.submittedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
