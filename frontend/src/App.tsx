import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import InterviewPage from "./pages/InterviewPage";
import ResultsPage from "./pages/ResultsPage";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import UserHome from "./pages/UserHome";
import UploadPage from "./pages/Upload";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<PrivateRoute><UserHome /></PrivateRoute>} />
      <Route
        path="/login"
        element={
          <PublicRoute restricted>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute restricted>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <UploadPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/interview"
        element={
          <PrivateRoute>
            <InterviewPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/results"
        element={
          <PrivateRoute>
            <ResultsPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
