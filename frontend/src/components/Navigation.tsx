import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FileText, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  LogOut
} from 'lucide-react';
import type { AppDispatch } from '../app/store';
import type { RootState } from '../app/store';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <FileText className="w-8 h-8" />
            <span className="text-2xl font-bold">InterviewAI</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition"
                >
                  Start Interview
                </button>
                <span className="px-4">Welcome, {user?.userName}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800 transition flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-red-500 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-purple-700 rounded-lg"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;