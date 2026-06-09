import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { QuizProvider, useQuiz } from "./context/QuizContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NavBar from "./components/NavBar";

import { LandingPage } from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import { QuizPage } from "./pages/QuizPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { PlanPage } from "./pages/PlanPage";

// ── Layout with global NavBar ───────────────────────────────────────────────
const MainLayout: React.FC = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

// ── Landing wrapper ─────────────────────────────────────────────────────────
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

// ── Quiz flow shell (wraps the 3-screen quiz) ───────────────────────────────
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
          🌍 AtlasPlanner
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

// ── Root ────────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <QuizProvider>
        <Routes>
          {/* Routes with global NavBar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingWrapper />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth routes (no global NavBar) */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Quiz flow (has its own QuizShellNav) */}
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizFlow />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </QuizProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
