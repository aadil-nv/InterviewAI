import { useState } from "react";
import type { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";
import { loginApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    try {
      setLoading(true);
      const userData = await loginApi({ email, password });
      dispatch(login({ 
        _id: userData.user._id, 
        email: userData.user.email, 
        userName: userData.user.userName,
      }));
      navigate("/home");
    } catch (err) {
      console.error("Error logging in", err);
      setErrorMsg("Login failed! Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideDown {
          animation: slideDown 0.6s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
      
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 hover:shadow-3xl animate-fadeIn">
        <div className="text-center mb-6 sm:mb-8 animate-slideDown">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl font-bold">→</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-sm sm:text-base text-gray-600">Continue your interview preparation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md text-sm animate-shake">
              <p className="font-medium">Error</p>
              <p className="text-xs sm:text-sm">{errorMsg}</p>
            </div>
          )}

          <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              required
            />
          </div>

          <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm sm:text-base animate-slideUp"
            style={{ animationDelay: '0.3s' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm sm:text-base text-gray-600 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;