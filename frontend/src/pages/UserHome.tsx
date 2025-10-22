import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FileText,
  Calendar,
  Trash2,
  X,
  Loader2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import type { Interview } from '../interfaces/types';
import { deleteInterviewAPI, getAllInterviewsAPI } from '../api/interviewApi';
import Navigation from '../components/Navigation';

const UserHome = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  console.log("is Authenticated is ",isAuthenticated);
  
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; type: 'resume' | 'jd' } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isAuthenticated) {
      fetchInterviews();
    }
  }, [isAuthenticated]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await getAllInterviewsAPI(user?._id as string); 
      console.log('Fetched interviews:', data.interviews);
      setInterviews(data.interviews || []);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;

    try {
      setDeletingId(id);
      await deleteInterviewAPI(id);
      setInterviews(interviews.filter(i => i.id !== id));
      
      // Adjust current page if necessary after deletion
      const totalPages = Math.ceil((interviews.length - 1) / itemsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      console.error('Failed to delete interview:', error);
      alert('Failed to delete interview. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 5) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 5) return 'Good';
    return 'Needs Work';
  };

  const totalPages = Math.ceil(interviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterviews = interviews.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6">
            Master Your Next Interview with AI
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Upload your resume and job description, get personalized interview questions, and practice with AI-powered feedback
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? '/upload' : '/signup')}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
          >
            {isAuthenticated ? 'Start New Interview' : 'Get Started Free'}
          </button>
        </div>

        {/* Interview History */}
        {isAuthenticated && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Your Interview History</h2>
                </div>
                {interviews && interviews.length > 0 && (
                  <span className="text-sm sm:text-base text-gray-600">
                    {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Loading interviews...</span>
                </div>
              ) : !interviews || interviews.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No interviews yet. Start your first one!</p>
                  <button
                    onClick={() => navigate('/upload')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Interview
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Questions</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Score</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentInterviews.map((interview) => {
                          if (!interview) return null;
                          
                          const questionsCount = interview.questions?.length || 0;
                          const hasScore = interview.score !== null && interview.score !== undefined;
                          
                          return (
                            <tr key={interview.id || Math.random()} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {formatDate(interview.createdAt as unknown as string)}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-gray-600">
                                  {questionsCount} question{questionsCount !== 1 ? 's' : ''}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {hasScore ? (
                                  <div className="flex items-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(interview.score as number)}`}>
                                      {interview.score}/10
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">Not completed</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {hasScore ? (
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(interview.score as number)}`}>
                                    {getScoreLabel(interview.score as number)}
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                    In Progress
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleDelete(interview.id)}
                                  disabled={deletingId === interview.id}
                                  className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm disabled:opacity-50"
                                >
                                  {deletingId === interview.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="lg:hidden space-y-4">
                    {currentInterviews.map((interview) => {
                      if (!interview) return null;
                      
                      const questionsCount = interview.questions?.length || 0;
                      const hasScore = interview.score !== null && interview.score !== undefined;
                      
                      return (
                        <div key={interview.id || Math.random()} className="bg-gray-50 rounded-lg p-4 space-y-3">
                          {/* Date */}
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{formatDate(interview.createdAt as unknown as string)}</span>
                          </div>
                          
                          {/* Questions Count and Score Row */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {questionsCount} question{questionsCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            
                            {hasScore ? (
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(interview.score as number)}`}>
                                {interview.score}/10
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">Not completed</span>
                            )}
                          </div>
                          
                          {/* Status and Actions Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div>
                              {hasScore ? (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(interview.score as number)}`}>
                                  {getScoreLabel(interview.score as number)}
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                  In Progress
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleDelete(interview.id)}
                              disabled={deletingId === interview.id}
                              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm disabled:opacity-50 flex items-center gap-1"
                            >
                              {deletingId === interview.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                  <span className="hidden sm:inline">Delete</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t pt-4 gap-4">
                      <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                        Showing {startIndex + 1} to {Math.min(endIndex, interviews.length)} of {interviews.length}
                      </div>
                      
                      <div className="flex items-center space-x-2 order-1 sm:order-2">
                        <button
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-3 sm:px-4 py-2 rounded-lg transition text-sm ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white font-semibold'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {previewDoc.type === 'resume' ? 'Resume Preview' : 'Job Description Preview'}
              </h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewDoc.url}
                className="w-full h-full"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;