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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <FileText className="w-8 h-8" />
              <span className="text-2xl font-bold">InterviewAI</span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/home')}
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition"
                  >
                    Home
                  </button>
                  <span className="px-4">Welcome, {user?.userName}</span>
                  <button
                    onClick={handleLogoutClick}
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

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/upload');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg"
                  >
                    Start Interview
                  </button>
                  <button
                    onClick={handleLogoutClick}
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

      {showLogoutConfirm && (
<div className="fixed inset-0 bg-gray-300/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex space-x-4">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;