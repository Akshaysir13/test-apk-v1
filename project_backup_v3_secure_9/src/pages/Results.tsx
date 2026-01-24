// src/pages/Results.tsx
import { useNavigate } from 'react-router-dom';
import { useTest } from '../contexts/TestContext';

export default function Results() {
  const navigate = useNavigate();
  const { selectedTest: currentTest, answers, questions } = useTest();

  if (!currentTest) {
    navigate('/dashboard');
    return null;
  }

  // Calculate score
  const calculateDetailedScore = () => {
    let correct = 0;
    let incorrect = 0;
    let totalMarks = 0;

    questions.forEach((q: any) => {
      const userAnswer = answers[q.id];
      // Check if answered (not undefined and not empty string)
      if (userAnswer === undefined || userAnswer === "") return;

      if (q.type === 'numeric') {
        // Numeric questions: exact string match, no negative marks
        if (String(userAnswer) === String(q.correctOption)) {
          correct++;
          totalMarks += 4;
        } else {
          incorrect++;
          // No negative marks
        }
      } else if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
        // Drawing: Max 50 marks. 
        // For now, we do not award auto-marks for drawing.
        // It counts as "attempted".
      } else {
        // MCQ questions: +4 / -1
        if (userAnswer === q.correctIndex) {
          correct++;
          totalMarks += 4;
        } else {
          incorrect++;
          totalMarks -= 1;
        }
      }
    });

    return { correct, incorrect, totalMarks };
  };

  const { correct, incorrect, totalMarks: marksObtained } = calculateDetailedScore();
  const questionsList = questions || [];
  const totalQuestionsCount = questionsList.length;

  // Calculate Max Potential Marks
  const maxPotentialMarks = questionsList.reduce((acc: number, q: any) => {
    if (q.type === 'drawing' || q.correctOption === 'manual_evaluation') {
      return acc + 50;
    }
    return acc + 4;
  }, 0);
  const percentageScore = maxPotentialMarks > 0 ? Math.round((marksObtained / maxPotentialMarks) * 100) : 0;

  const grade = percentageScore >= 90 ? 'A+' : percentageScore >= 80 ? 'A' : percentageScore >= 70 ? 'B' : percentageScore >= 60 ? 'C' : 'D';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Test Completed! 🎉</h1>
            <p className="text-lg opacity-90">{currentTest.name}</p>
          </div>

          {/* Score Section */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-8 mb-4">
                <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {marksObtained}
                </p>
                <p className="text-sm text-gray-500 font-medium">Total Marks</p>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">Grade: {grade}</p>
              <p className="text-gray-600">
                Score: {percentageScore}%
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{correct}</p>
                <p className="text-sm text-gray-600 mt-1">Correct</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-red-600">
                  {incorrect}
                </p>
                <p className="text-sm text-gray-600 mt-1">Incorrect</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">{totalQuestionsCount}</p>
                <p className="text-sm text-gray-600 mt-1">Total</p>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`p-6 rounded-lg mb-8 ${percentageScore >= 80
              ? 'bg-green-50 border-2 border-green-200'
              : percentageScore >= 60
                ? 'bg-yellow-50 border-2 border-yellow-200'
                : 'bg-red-50 border-2 border-red-200'
              }`}>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {percentageScore >= 80
                  ? '🌟 Excellent Performance!'
                  : percentageScore >= 60
                    ? '👍 Good Effort!'
                    : '💪 Keep Practicing!'}
              </p>
              <p className="text-gray-600">
                {percentageScore >= 80
                  ? 'You have shown great understanding of the concepts. Keep up the excellent work!'
                  : percentageScore >= 60
                    ? 'You are on the right track. Review the incorrect answers and keep practicing.'
                    : 'Don\'t be discouraged! Every test is a learning opportunity. Review the solutions and try again.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>

        {/* Question-wise Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Question-wise Review</h2>
          {questions.map((question: any, index: number) => {
            const studentAnswer = answers[question.id];
            const isUnattempted = studentAnswer === undefined || studentAnswer === "";
            let isCorrect = false;

            if (question.type === 'numeric') {
              isCorrect = String(studentAnswer) === String(question.correctOption);
            } else if (question.type === 'drawing' || question.correctOption === 'manual_evaluation') {
              isCorrect = false;
            } else {
              isCorrect = studentAnswer === question.correctIndex;
            }

            return (
              <div
                key={question.id}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${isUnattempted
                  ? 'border-gray-400'
                  : isCorrect
                    ? 'border-green-500'
                    : 'border-red-500'
                  }`}
              >
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-gray-700">Q{index + 1}.</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${isUnattempted
                        ? 'bg-gray-100 text-gray-700'
                        : isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {isUnattempted ? 'Not Attempted' : isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {question.subject || 'General'}
                  </span>
                </div>

                {/* Question Text */}
                <p className="text-gray-800 mb-6 text-lg font-medium leading-relaxed">
                  {question.question}
                </p>

                {/* Options */}
                {/* Options / Answer Display */}
                {question.type === 'numeric' ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="mb-2"><span className="font-bold text-gray-700">Your Answer:</span> <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{isUnattempted ? "N/A" : studentAnswer}</span></p>
                    <p><span className="font-bold text-gray-700">Correct Answer:</span> <span className="text-green-600 font-bold">{question.correctOption}</span></p>
                  </div>
                ) : (question.type === 'drawing' || question.correctOption === 'manual_evaluation') ? (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">This question requires manual evaluation.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {question.shuffledOptions.map((opt: any, optIdx: number) => {
                      const isStudentChoice = studentAnswer === optIdx;
                      const isCorrectChoice = question.correctIndex === optIdx;
                      const letter = String.fromCharCode(65 + optIdx);

                      return (
                        <div
                          key={optIdx}
                          className={`p-4 rounded-lg border-2 transition-all ${isCorrectChoice
                            ? 'bg-green-50 border-green-500 shadow-sm'
                            : isStudentChoice && !isCorrect
                              ? 'bg-red-50 border-red-500'
                              : 'bg-gray-50 border-gray-200'
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-1 text-gray-700">{opt.text}</span>
                            <div className="flex flex-col items-end shrink-0 gap-1">
                              {isCorrectChoice && (
                                <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {isStudentChoice && !isCorrect && (
                                <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  ✗ Your Answer
                                </span>
                              )}
                              {isStudentChoice && isCorrect && (
                                <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  ✓ Your Answer (Correct)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Solution */}
                {question.solution && (
                  <div className="mt-6">
                    <details className="group">
                      <summary className="cursor-pointer font-bold text-blue-600 flex items-center gap-2 hover:text-blue-700">
                        <span className="bg-blue-100 p-1 rounded group-open:rotate-180 transition-transform">
                          💡
                        </span>
                        View Explanation
                      </summary>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-gray-700 border border-blue-100 italic">
                        {question.solution}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📚</span> Study Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Analyze incorrect answers carefully to understand the root cause of the error.",
              "Strengthen weak topics by solving similar practice problems from standard sources.",
              "Work on time management by setting stricter limits for future mock attempts.",
              "Maintain a 'Mistake Book' for complex questions encountered during this test."
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-blue-500 font-bold">•</span>
                <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}