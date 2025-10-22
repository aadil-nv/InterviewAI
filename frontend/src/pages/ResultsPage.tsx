import { useSelector, useDispatch } from 'react-redux';
import { 
  CheckCircle, 
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../app/store';
import { clearCurrentInterview } from '../features/interviewSlice';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const { currentInterview } = useSelector((state: RootState) => state.interview);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleNewInterview = () => {
    dispatch(clearCurrentInterview());
    navigate('/upload');
  };

  if (!currentInterview || currentInterview.score === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">No interview results available</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 5) return 'Good';
    return 'Needs Improvement';
  };

  // Parse feedback to extract individual question feedbacks
  const parseFeedback = (feedback: string) => {
    if (!feedback) return [];
    
    const sections = feedback.split('---').map(s => s.trim()).filter(s => s);
    return sections.map(section => {
      const scoreMatch = section.match(/\*\*Score:\*\*\s*(\d+)\/10/);
      const feedbackMatch = section.match(/\*\*Feedback:\*\*\s*(.+)/s);
      
      return {
        score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
        feedback: feedbackMatch ? feedbackMatch[1].trim() : section,
      };
    });
  };

  const questionFeedbacks = parseFeedback(currentInterview.feedback || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Interview Complete!</h1>
            <p className="text-gray-600">Here's your performance summary</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8 text-center">
            <p className="text-gray-600 mb-2">Overall Score</p>
            <p className={`text-6xl font-bold mb-2 ${getScoreColor(currentInterview.score)}`}>
              {currentInterview.score}/10
            </p>
            <p className={`text-xl font-semibold ${getScoreColor(currentInterview.score)}`}>
              {getScoreLabel(currentInterview.score)}
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Detailed Feedback</h2>
            </div>
            <div className="space-y-6">
              {currentInterview.questions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-semibold text-gray-800 flex-1">
                      Q{index + 1}: {question}
                    </p>
                    {questionFeedbacks[index] && (
                      <span className={`ml-4 px-3 py-1 rounded-full text-sm font-bold ${
                        questionFeedbacks[index].score >= 8 ? 'bg-green-100 text-green-800' :
                        questionFeedbacks[index].score >= 5 ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {questionFeedbacks[index].score}/10
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">Your Answer:</p>
                    <p className="text-gray-700">
                      {currentInterview.answers[index] || 'No answer provided'}
                    </p>
                  </div>

                  {questionFeedbacks[index] && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-800 mb-2">AI Feedback:</p>
                      <p className="text-gray-700 text-sm">
                        {questionFeedbacks[index].feedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleNewInterview}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Start New Interview
            </button>
            <button
              onClick={() => navigate('/home')}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;