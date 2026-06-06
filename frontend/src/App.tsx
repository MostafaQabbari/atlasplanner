import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { QuizProvider, useQuiz } from "./context/QuizContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { LandingPage } from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import { QuizPage } from "./pages/QuizPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { PlanPage } from "./pages/PlanPage";

// --------------- Landing wrapper (provides required props) ---------------
const LandingWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <LandingPage
      onStart={() => navigate("/quiz")}
      isLoggedIn={isAuthenticated}
      onSignIn={() => navigate("/signin")}
    />
  );
};

// --------------- Quiz flow shell (wraps the 3-screen quiz) ---------------
const QuizShellNav: React.FC = () => {
  const { screen, resetAll } = useQuiz();
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#042c53]/80 backdrop-blur-md border-b border-[#5bc4a0]/10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => { resetAll(); navigate("/"); }}
          className="flex items-center gap-2 text-[#5bc4a0] font-bold text-lg"
        >
          <Globe size={19} />
          AtlasPlanner
        </button>
        {screen !== "quiz" && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <RotateCcw size={13} />
            Start over
          </button>
        )}
      </div>
    </nav>
  );
};

const QuizFlow: React.FC = () => {
  const { screen } = useQuiz();
  return (
    <div className="min-h-screen bg-[#042c53]">
      <QuizShellNav />
      <div className="pt-14">
        <AnimatePresence mode="wait">
          {screen === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizPage />
            </motion.div>
          )}
          {screen === "recommendations" && (
            <motion.div key="recommendations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RecommendationsPage />
            </motion.div>
          )}
          {screen === "plan" && (
            <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PlanPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const QuizRoute: React.FC = () => (
  <QuizProvider>
    <QuizFlow />
  </QuizProvider>
);

// --------------- Root ---------------
const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <QuizRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan"
          element={
            <ProtectedRoute>
              <QuizRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
