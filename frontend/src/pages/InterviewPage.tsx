import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, Loader2 } from 'lucide-react';
import type { AppDispatch, RootState } from '../app/store';
import { updateCurrentInterview, setLoading } from '../features/interviewSlice';
import { useNavigate } from 'react-router-dom';
import { submitInterviewAPI } from '../api/interviewApi';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
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
    const unansweredQuestions = answers.filter(answer => !answer.trim()).length;
    if (unansweredQuestions > 0) {
      setError(`Please answer all questions. ${unansweredQuestions} question(s) remaining.`);
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
  const allQuestionsAnswered = answers.length > 0 && answers.every(answer => answer.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Question {currentQuestion + 1} of {currentInterview.questions.length}
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>No time limit</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / currentInterview.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xl text-gray-800 mb-6">
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
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Type your answer here..."
              disabled={loading}
            />
            <div className="mt-2 text-sm text-gray-500">
              {answers[currentQuestion]?.trim() ? (
                <span className="text-green-600">✓ Answered</span>
              ) : (
                <span>Not answered yet</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0 || loading}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="text-sm text-gray-600">
              {answers.filter(a => a && a.trim()).length} / {currentInterview.questions.length} answered
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
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
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;