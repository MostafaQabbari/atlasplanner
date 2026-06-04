import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, RotateCcw } from "lucide-react";
import { QuizProvider, useQuiz } from "./context/QuizContext";
import { QuizPage } from "./pages/QuizPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { PlanPage } from "./pages/PlanPage";

const WelcomePage: React.FC = () => {
  const { setScreen } = useQuiz();
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] gap-8 px-6 text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55 }}
      >
        <div className="text-7xl mb-5 select-none">🌍</div>
        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">AtlasPlanner</h1>
        <p className="text-[#5bc4a0] text-xl font-light mb-3">Your AI travel companion</p>
        <p className="text-gray-400 max-w-sm leading-relaxed">
          Answer a few questions and get perfectly matched destinations with a personalised
          day-by-day itinerary.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        onClick={() => setScreen("quiz")}
        className="px-10 py-4 bg-[#5bc4a0] text-[#042c53] font-bold text-lg rounded-2xl hover:bg-[#4aab8d] transition-colors shadow-lg shadow-[#5bc4a0]/20"
      >
        Start planning →
      </motion.button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { screen, resetAll } = useQuiz();

  return (
    <div className="min-h-screen bg-[#042c53]">
      {/* Sticky nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#042c53]/80 backdrop-blur-md border-b border-[#5bc4a0]/10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 text-[#5bc4a0] font-bold text-lg"
          >
            <Globe size={19} />
            AtlasPlanner
          </button>

          {screen !== "welcome" && (
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

      {/* Page area */}
      <div className="pt-14">
        <AnimatePresence mode="wait">
          {screen === "welcome" && (
            <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WelcomePage />
            </motion.div>
          )}
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

const App: React.FC = () => (
  <QuizProvider>
    <AppContent />
  </QuizProvider>
);

export default App;
