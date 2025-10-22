import { useSelector } from 'react-redux';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
} from 'lucide-react';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Master Your Next Interview with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your resume and job description, get personalized interview questions, and practice with AI-powered feedback
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? '/upload' : '/signup')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Upload Documents</h3>
            <p className="text-gray-600">
              Simply drag and drop your resume and job description. We support PDF format up to 2MB.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">AI-Generated Questions</h3>
            <p className="text-gray-600">
              Get personalized interview questions based on your experience and the job requirements.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Get Feedback</h3>
            <p className="text-gray-600">
              Receive detailed analysis and scores on your answers to improve your interview skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;