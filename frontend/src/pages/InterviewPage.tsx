import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, Loader2 } from 'lucide-react';
import type { AppDispatch, RootState } from '../app/store';
import { updateCurrentInterview, setLoading } from '../features/interviewSlice';
import { useNavigate } from 'react-router-dom';
import { submitInterviewAPI } from '../api/interviewApi';
import Navigation from '../components/Navigation';

const InterviewPage = () => {
  const { currentInterview, loading } = useSelector((state: RootState) => state.interview);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    if (!currentInterview) {
      navigate('/upload');
      return;
    }

    if (!isInitialized && currentInterview.questions) {
      setAnswers(
        currentInterview.answers && currentInterview.answers.length > 0
          ? currentInterview.answers
          : Array(currentInterview.questions.length).fill('')
      );
      setIsInitialized(true);
    }
  }, [currentInterview, navigate, isInitialized]);

  if (!currentInterview || !currentInterview.questions || !isInitialized) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading interview...</p>
          </div>
        </div>
      </>
    );
  }

  const handleNextQuestion = () => {
    if (currentQuestion < currentInterview.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = answers.filter(answer => !answer.trim()).length;
    if (unansweredQuestions > 0) {
      setError(`Please answer all questions. ${unansweredQuestions} question(s) remaining.`);
      return;
    }

    // Check if all answers have at least 3 characters
    const shortAnswers = answers.filter(answer => answer.trim().length < 3);
    if (shortAnswers.length > 0) {
      setError(`All answers must be at least 3 characters long. Please check your responses.`);
      return;
    }

    try {
      setError('');
      dispatch(setLoading(true));
      const response = await submitInterviewAPI(currentInterview.id, answers, userId);

      const updatedInterview = {
        ...currentInterview,
        answers: response.result.answers,
        score: response.result.score,
        feedback: response.result.feedback,
      };

      dispatch(updateCurrentInterview(updatedInterview));
      dispatch(setLoading(false));
      
      navigate('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit interview');
      dispatch(setLoading(false));
    }
  };

  const isLastQuestion = currentQuestion === currentInterview.questions.length - 1;
  const allQuestionsAnswered = answers.length > 0 && answers.every(answer => answer.trim().length >= 3);

  return (
    <>
      {/* Navigation Component */}
      
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 sm:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm sm:text-base text-red-800">{error}</p>
            </div>
          )}

          {/* Header Section */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Question {currentQuestion + 1} of {currentInterview.questions.length}
              </h2>
              <div className="flex items-center space-x-2 text-gray-600 text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>No time limit</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / currentInterview.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question and Answer Section */}
          <div className="mb-6 sm:mb-8">
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 mb-4 sm:mb-6 leading-relaxed">
              {currentInterview.questions[currentQuestion]}
            </p>
            <textarea
              value={answers[currentQuestion] || ''}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[currentQuestion] = e.target.value;
                setAnswers(newAnswers);
                setError('');
              }}
              className="w-full h-40 sm:h-48 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              placeholder="Type your answer here... (minimum 3 characters)"
              disabled={loading}
            />
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs sm:text-sm text-gray-500">
                {answers[currentQuestion]?.trim().length >= 3 ? (
                  <span className="text-green-600 font-medium">✓ Answered</span>
                ) : answers[currentQuestion]?.trim().length > 0 ? (
                  <span className="text-orange-600 font-medium">⚠ Minimum 3 characters required</span>
                ) : (
                  <span>Not answered yet</span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {answers[currentQuestion]?.trim().length || 0} characters
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Previous Button */}
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0 || loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Previous
            </button>

            {/* Answer Counter */}
            <div className="text-xs sm:text-sm text-gray-600 font-medium order-first sm:order-none">
              {answers.filter(a => a && a.trim().length >= 3).length} / {currentInterview.questions.length} answered
            </div>

            {/* Next/Submit Button */}
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || loading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Interview</span>
                )}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={loading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default InterviewPage;