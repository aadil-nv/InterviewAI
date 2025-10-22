import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  TrendingUp,
  AlertCircle,
  Trophy,
  Star,
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../app/store';
import { clearCurrentInterview } from '../features/interviewSlice';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ResultsPage = () => {
  const { currentInterview } = useSelector((state: RootState) => state.interview);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (currentInterview && currentInterview.score !== null && currentInterview.score >= 8) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentInterview]);

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

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-green-50 to-emerald-50';
    if (score >= 5) return 'from-blue-50 to-cyan-50';
    return 'from-orange-50 to-yellow-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 5) return 'Good';
    return 'Needs Improvement';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 animate-bounce" />;
    if (score >= 5) return <ThumbsUp className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 animate-pulse" />;
    return <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600 animate-pulse" />;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 8) return '🎉 Outstanding Performance!';
    if (score >= 5) return '👍 Good Job! Keep Improving!';
    return '💪 Room for Growth!';
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
    <>
    <Navigation />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 sm:py-12 px-4 relative overflow-hidden">
      {/* Confetti Animation for Excellent Score */}
      {showConfetti && currentInterview.score >= 8 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-4 flex justify-center">
              {getScoreIcon(currentInterview.score)}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Interview Complete!
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {getScoreMessage(currentInterview.score)}
            </p>
          </div>

          {/* Score Card */}
          <div className={`bg-gradient-to-r ${getScoreGradient(currentInterview.score)} rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 text-center shadow-md`}>
            <p className="text-sm sm:text-base text-gray-600 mb-2">Overall Score</p>
            <p className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 ${getScoreColor(currentInterview.score)} animate-scale-in`}>
              {currentInterview.score}/10
            </p>
            <p className={`text-lg sm:text-xl font-semibold ${getScoreColor(currentInterview.score)}`}>
              {getScoreLabel(currentInterview.score)}
            </p>
            
            {/* Score Bar */}
            <div className="mt-4 w-full max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    currentInterview.score >= 8 ? 'bg-green-600' :
                    currentInterview.score >= 5 ? 'bg-blue-600' : 'bg-orange-600'
                  }`}
                  style={{ width: `${(currentInterview.score / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Feedback Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Detailed Feedback</h2>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {currentInterview.questions.map((question, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition"
                >
                  {/* Question Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <p className="font-semibold text-sm sm:text-base text-gray-800 flex-1">
                      <span className="text-blue-600">Q{index + 1}:</span> {question}
                    </p>
                    {questionFeedbacks[index] && (
                      <span className={`self-start sm:ml-4 px-3 py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap ${
                        questionFeedbacks[index].score >= 8 ? 'bg-green-100 text-green-800' :
                        questionFeedbacks[index].score >= 5 ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {questionFeedbacks[index].score}/10
                      </span>
                    )}
                  </div>
                  
                  {/* User's Answer */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Your Answer:</p>
                    <p className="text-sm sm:text-base text-gray-700 break-words">
                      {currentInterview.answers[index] || 'No answer provided'}
                    </p>
                  </div>

                  {/* AI Feedback */}
                  {questionFeedbacks[index] && (
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm font-semibold text-blue-800 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        AI Feedback:
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 break-words leading-relaxed">
                        {questionFeedbacks[index].feedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleNewInterview}
              className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg transition transform hover:scale-105"
            >
              Start New Interview
            </button>
            <button
              onClick={() => navigate('/home')}
              className="flex-1 px-4 sm:px-6 py-3 bg-gray-300 text-gray-700 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-400 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
    </>
  );
};

export default ResultsPage;