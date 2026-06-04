import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { submitQuiz } from "../services/api";
import type { QuizAnswer } from "../types";

interface Option {
  value: string;
  label: string;
  emoji: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "pace",
    text: "How do you like to pace your travels?",
    options: [
      { value: "slow",   label: "Slow & deep",  emoji: "🐢" },
      { value: "medium", label: "Balanced",      emoji: "🚶" },
      { value: "fast",   label: "See it all",    emoji: "⚡" },
    ],
  },
  {
    id: "social",
    text: "Who are you travelling with?",
    options: [
      { value: "solo",   label: "Just me",   emoji: "🧳" },
      { value: "couple", label: "Partner",   emoji: "💑" },
      { value: "group",  label: "Friends",   emoji: "👥" },
      { value: "family", label: "Family",    emoji: "👨‍👩‍👧" },
    ],
  },
  {
    id: "interests",
    text: "What excites you most?",
    options: [
      { value: "culture",   label: "Art & history",     emoji: "🏛️" },
      { value: "nature",    label: "Nature & outdoors", emoji: "🏔️" },
      { value: "food",      label: "Food & drink",      emoji: "🍜" },
      { value: "adventure", label: "Adventure",         emoji: "🪂" },
    ],
  },
  {
    id: "climate",
    text: "What climate suits you best?",
    options: [
      { value: "tropical",  label: "Hot & tropical",  emoji: "🌴" },
      { value: "temperate", label: "Mild & pleasant", emoji: "🌤️" },
      { value: "cold",      label: "Cool & crisp",    emoji: "❄️" },
      { value: "varied",    label: "No preference",   emoji: "🌍" },
    ],
  },
  {
    id: "budget_style",
    text: "What's your budget approach?",
    options: [
      { value: "budget",   label: "Budget-savvy", emoji: "💰" },
      { value: "moderate", label: "Mid-range",    emoji: "💳" },
      { value: "luxury",   label: "Luxury",       emoji: "✨" },
    ],
  },
];

const TRAVELER_TYPE: Record<string, string> = {
  culture:   "Cultural Explorer",
  nature:    "Nature Seeker",
  food:      "Foodie Traveller",
  adventure: "Adventure Seeker",
};

export const QuizPage: React.FC = () => {
  const { setProfile, setTravelDates, setBudget, setScreen, setRecommendations } = useQuiz();

  const [step, setStep]               = useState(0);
  const [answers, setAnswers]         = useState<Record<string, string>>({});
  const [travelStart, setTravelStart] = useState("");
  const [travelEnd, setTravelEnd]     = useState("");
  const [budgetVal, setBudgetVal]     = useState(2000);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const totalSteps   = QUESTIONS.length + 1; // questions + trip-details
  const isMetaStep   = step === QUESTIONS.length;
  const currentQ     = !isMetaStep ? QUESTIONS[step] : null;
  const progress     = ((step + 1) / totalSteps) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => setStep((s) => s + 1), 280);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const quizAnswers: QuizAnswer[] = Object.entries(answers).map(([question_id, answer]) => ({
      question_id,
      answer,
    }));

    const proceed = (profile: ReturnType<typeof buildFallback>) => {
      setProfile(profile);
      setTravelDates({ start: travelStart, end: travelEnd });
      setBudget(budgetVal);
      setRecommendations(null);
      setScreen("recommendations");
    };

    try {
      const profile = await submitQuiz(quizAnswers);
      proceed(profile);
    } catch {
      // Graceful fallback: synthesise a profile from answers without the backend
      proceed(buildFallback(answers, quizAnswers));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Step {Math.min(step + 1, totalSteps)} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-[#073a6e] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#5bc4a0] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentQ && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.22 }}
          >
            <h2 className="text-2xl font-bold text-white mb-7">{currentQ.text}</h2>
            <div className="grid grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const selected = answers[currentQ.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(currentQ.id, opt.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      selected
                        ? "border-[#5bc4a0] bg-[#5bc4a0]/10"
                        : "border-[#073a6e] bg-[#073a6e]/40 hover:border-[#5bc4a0]/40"
                    }`}
                  >
                    <div className="text-2xl mb-1.5 select-none">{opt.emoji}</div>
                    <div className="text-white font-medium text-sm">{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {isMetaStep && (
          <motion.div
            key="meta"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.22 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Trip details</h2>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Travel dates</label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={travelStart}
                  onChange={(e) => setTravelStart(e.target.value)}
                  className="flex-1 bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5bc4a0] text-sm"
                />
                <input
                  type="date"
                  value={travelEnd}
                  onChange={(e) => setTravelEnd(e.target.value)}
                  className="flex-1 bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5bc4a0] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Budget:{" "}
                <span className="text-[#5bc4a0] font-semibold">€{budgetVal.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={500}
                max={10000}
                step={100}
                value={budgetVal}
                onChange={(e) => setBudgetVal(Number(e.target.value))}
                className="w-full accent-[#5bc4a0]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>€500</span>
                <span>€10,000</span>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !travelStart || !travelEnd}
              className="w-full py-4 bg-[#5bc4a0] text-[#042c53] font-bold rounded-2xl hover:bg-[#4aab8d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Finding destinations…" : "Find my destinations →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step > 0 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="mt-6 flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          <ChevronLeft size={15} /> Back
        </button>
      )}
    </div>
  );
};

function buildFallback(
  answers: Record<string, string>,
  rawAnswers: QuizAnswer[]
) {
  return {
    traveler_type: TRAVELER_TYPE[answers.interests] ?? "Explorer",
    pace:          answers.pace ?? "medium",
    social:        answers.social ?? "solo",
    interests:     [answers.interests].filter(Boolean),
    avoid:         [] as string[],
    budget_style:  answers.budget_style ?? "moderate",
    raw_answers:   rawAnswers,
  };
}
