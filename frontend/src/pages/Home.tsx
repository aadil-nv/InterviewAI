import { useSelector } from 'react-redux';
import { 
  Upload, 
  FileText, 
  CheckCircle,
  TrendingUp,
  Zap,
  Award,
  ArrowRight,
  Mail,
} from 'lucide-react';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 flex-grow">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block animate-float mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 animate-fade-in-up px-4">
            Master Your Next Interview with AI
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 animate-fade-in-up-delay">
            Upload your resume and job description, get personalized interview questions, and practice with AI-powered feedback
          </p>
          
          <button
            onClick={() => navigate(isAuthenticated ? '/upload' : '/signup')}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transition transform hover:scale-105 animate-fade-in-up-delay-2 inline-flex items-center space-x-2"
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base text-gray-600 animate-fade-in-up-delay-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              <span>Instant Feedback</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span>100% Free</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 animate-slide-in-left">
            <div className="bg-blue-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
              <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Upload Documents</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Simply drag and drop your resume and job description. We support PDF format up to 2MB.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 animate-slide-in-up">
            <div className="bg-purple-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 animate-pulse-slow animation-delay-200">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">AI-Generated Questions</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Get personalized interview questions based on your experience and the job requirements.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 animate-slide-in-right sm:col-span-2 lg:col-span-1">
            <div className="bg-green-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 animate-pulse-slow animation-delay-400">
              <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Get Feedback</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Receive detailed analysis and scores on your answers to improve your interview skills.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto animate-fade-in">
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">AI</div>
            <div className="text-xs sm:text-sm text-gray-600">Powered</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">Fast</div>
            <div className="text-xs sm:text-sm text-gray-600">Results</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">Free</div>
            <div className="text-xs sm:text-sm text-gray-600">Forever</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition col-span-2 lg:col-span-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-xs sm:text-sm text-gray-600">Available</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 sm:py-8 mt-12 sm:mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-xl sm:text-2xl font-bold">InterviewAI</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span>Created by</span>
                <span className="font-semibold text-blue-400">Aadil NV</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <a 
                href="mailto:aadilnv.dev@gmail.com"
                className="flex items-center space-x-2 hover:text-blue-400 transition"
              >
                <Mail className="w-4 h-4" />
                <span>aadilnv.dev@gmail.com</span>
              </a>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} InterviewAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fade-in-up-delay {
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fadeInUp 0.8s ease-out 0.6s backwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out 0.8s backwards;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;