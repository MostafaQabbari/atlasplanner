import React, { useState, useRef, useEffect } from "react";
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
  {
    id: "duration",
    text: "How long is your trip?",
    options: [
      { value: "weekend", label: "Weekend (3-5 days)", emoji: "🏃" },
      { value: "week",    label: "One week",           emoji: "✈️" },
      { value: "twoweek", label: "Two weeks",          emoji: "🗺️" },
      { value: "month",   label: "A month or more",    emoji: "🌍" },
    ],
  },
  {
    id: "accommodation",
    text: "Where do you like to sleep?",
    options: [
      { value: "hostel",  label: "Hostel & meet people",   emoji: "🏩" },
      { value: "airbnb",  label: "Local apartment/Airbnb", emoji: "🏠" },
      { value: "hotel",   label: "Comfortable hotel",      emoji: "🏨" },
      { value: "luxury",  label: "Luxury & spa",           emoji: "🛎️" },
    ],
  },
  {
    id: "language_comfort",
    text: "How do you feel about language barriers?",
    options: [
      { value: "love_it",   label: "Love it, part of adventure", emoji: "🗣️" },
      { value: "english_signs", label: "Fine if signs are in English", emoji: "📍" },
      { value: "prefer_english", label: "Prefer English-speaking",   emoji: "🇬🇧" },
      { value: "need_familiar", label: "Need familiar language",     emoji: "🏠" },
    ],
  },
  {
    id: "scenery",
    text: "What scenery excites you most?",
    options: [
      { value: "mountains", label: "Mountains & hiking",   emoji: "🏔️" },
      { value: "beaches",   label: "Beaches & ocean",      emoji: "🏖️" },
      { value: "cities",    label: "Cities & architecture", emoji: "🌆" },
      { value: "villages",  label: "Villages & countryside", emoji: "🌿" },
    ],
  },
  {
    id: "safety_priority",
    text: "How do you weigh safety vs adventure?",
    options: [
      { value: "anywhere",  label: "I go anywhere",              emoji: "🪂" },
      { value: "cautious",  label: "Open but slightly cautious", emoji: "🗺️" },
      { value: "safe_spots", label: "Prefer well-known safe spots", emoji: "🛡️" },
      { value: "safety_first", label: "Safety is my top priority", emoji: "🔒" },
    ],
  },
];

const NATIONALITIES = [
  { flag: "🇪🇬", label: "Egyptian" },
  { flag: "🇩🇪", label: "German" },
  { flag: "🇺🇸", label: "American" },
  { flag: "🇬🇧", label: "British" },
  { flag: "🇫🇷", label: "French" },
  { flag: "🇮🇹", label: "Italian" },
  { flag: "🇪🇸", label: "Spanish" },
  { flag: "🇹🇷", label: "Turkish" },
  { flag: "🇮🇳", label: "Indian" },
  { flag: "🇨🇳", label: "Chinese" },
  { flag: "🇧🇷", label: "Brazilian" },
  { flag: "🇷🇺", label: "Russian" },
  { flag: "🇿🇦", label: "South African" },
  { flag: "🇲🇦", label: "Moroccan" },
  { flag: "🇯🇴", label: "Jordanian" },
  { flag: "🇱🇧", label: "Lebanese" },
  { flag: "🇸🇦", label: "Saudi Arabian" },
  { flag: "🇦🇪", label: "Emirati" },
  { flag: "🇵🇰", label: "Pakistani" },
  { flag: "🇳🇬", label: "Nigerian" },
  { flag: "🇮🇩", label: "Indonesian" },
  { flag: "🇯🇵", label: "Japanese" },
  { flag: "🇰🇷", label: "Korean" },
  { flag: "🇦🇺", label: "Australian" },
  { flag: "🇨🇦", label: "Canadian" },
  { flag: "🇲🇽", label: "Mexican" },
  { flag: "🇦🇷", label: "Argentine" },
  { flag: "🇵🇱", label: "Polish" },
  { flag: "🇳🇱", label: "Dutch" },
  { flag: "🇸🇪", label: "Swedish" },
  { flag: "🇨🇭", label: "Swiss" },
  { flag: "🇦🇹", label: "Austrian" },
  { flag: "🇧🇪", label: "Belgian" },
  { flag: "🇵🇹", label: "Portuguese" },
  { flag: "🇬🇷", label: "Greek" },
  { flag: "🇨🇿", label: "Czech" },
  { flag: "🇭🇺", label: "Hungarian" },
  { flag: "🇷🇴", label: "Romanian" },
  { flag: "🇵🇭", label: "Filipino" },
  { flag: "🇻🇳", label: "Vietnamese" },
  { flag: "🇹🇭", label: "Thai" },
  { flag: "🇲🇾", label: "Malaysian" },
  { flag: "🇸🇬", label: "Singaporean" },
  { flag: "🇧🇩", label: "Bangladeshi" },
  { flag: "🇰🇪", label: "Kenyan" },
  { flag: "🇬🇭", label: "Ghanaian" },
  { flag: "🇩🇿", label: "Algerian" },
  { flag: "🇹🇳", label: "Tunisian" },
  { flag: "🇳🇴", label: "Norwegian" },
];

const TRAVELER_TYPE: Record<string, string> = {
  culture:   "Cultural Explorer",
  nature:    "Nature Seeker",
  food:      "Foodie Traveller",
  adventure: "Adventure Seeker",
};

export const QuizPage: React.FC = () => {
  const {
    setProfile, setTravelDates, setBudget, setScreen, setRecommendations,
    nationality, setNationality,
  } = useQuiz();

  // step 0 = nationality, step 1..QUESTIONS.length = questions, step QUESTIONS.length+1 = trip details
  const [step, setStep]               = useState(0);
  const [answers, setAnswers]         = useState<Record<string, string>>({});
  const [travelStart, setTravelStart] = useState("");
  const [travelEnd, setTravelEnd]     = useState("");
  const [budgetVal, setBudgetVal]     = useState(2000);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Nationality step state
  const [natInput, setNatInput]       = useState(nationality);
  const [showDropdown, setShowDropdown] = useState(false);
  const natRef = useRef<HTMLDivElement>(null);

  const totalSteps = QUESTIONS.length + 2; // nationality + questions + trip details
  const isNationalityStep = step === 0;
  const isMetaStep        = step === QUESTIONS.length + 1;
  const currentQ          = (!isNationalityStep && !isMetaStep) ? QUESTIONS[step - 1] : null;
  const progress          = ((step + 1) / totalSteps) * 100;

  const filteredNats = NATIONALITIES.filter((n) =>
    n.label.toLowerCase().includes(natInput.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (natRef.current && !natRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNationalitySelect = (label: string) => {
    setNationality(label);
    setNatInput(label);
    setShowDropdown(false);
    setTimeout(() => setStep(1), 200);
  };

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

    const buildProfile = (base: ReturnType<typeof buildFallback>) => ({
      ...base,
      nationality: nationality || "Unknown",
    });

    const proceed = (base: ReturnType<typeof buildFallback>) => {
      setProfile(buildProfile(base));
      setTravelDates({ start: travelStart, end: travelEnd });
      setBudget(budgetVal);
      setRecommendations(null);
      setScreen("recommendations");
    };

    try {
      const profile = await submitQuiz(quizAnswers);
      proceed({
        ...profile,
        nationality:      nationality || "Unknown",
        duration:         answers.duration,
        accommodation:    answers.accommodation,
        language_comfort: answers.language_comfort,
        scenery:          answers.scenery,
        safety_priority:  answers.safety_priority,
      } as ReturnType<typeof buildFallback>);
    } catch {
      proceed(buildFallback(answers, quizAnswers, nationality));
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
        {/* Step 0: Nationality */}
        {isNationalityStep && (
          <motion.div
            key="nationality"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.22 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">What's your nationality?</h2>
            <p className="text-gray-400 text-sm mb-6">We'll factor in visa requirements and travel advisories for your passport.</p>

            <div ref={natRef} className="relative">
              <input
                type="text"
                value={natInput}
                onChange={(e) => { setNatInput(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search nationality…"
                className="w-full bg-[#073a6e]/60 border border-[#5bc4a0]/30 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#5bc4a0] text-sm"
              />

              {showDropdown && filteredNats.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#042c53] border border-[#5bc4a0]/20 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto shadow-xl">
                  {filteredNats.map((n) => (
                    <button
                      key={n.label}
                      onClick={() => handleNationalitySelect(n.label)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-[#073a6e] transition-colors"
                    >
                      <span className="text-xl">{n.flag}</span>
                      <span>{n.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {nationality && (
              <button
                onClick={() => setStep(1)}
                className="mt-5 w-full py-3.5 bg-[#5bc4a0] text-[#042c53] font-bold rounded-xl hover:bg-[#4aab8d] transition-colors text-sm"
              >
                Continue →
              </button>
            )}
          </motion.div>
        )}

        {/* Question steps */}
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

        {/* Trip details step */}
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
  rawAnswers: QuizAnswer[],
  nationality: string,
) {
  return {
    traveler_type:    TRAVELER_TYPE[answers.interests] ?? "Explorer",
    pace:             answers.pace ?? "medium",
    social:           answers.social ?? "solo",
    interests:        [answers.interests].filter(Boolean),
    avoid:            [] as string[],
    budget_style:     answers.budget_style ?? "moderate",
    nationality:      nationality || "Unknown",
    duration:         answers.duration,
    accommodation:    answers.accommodation,
    language_comfort: answers.language_comfort,
    scenery:          answers.scenery,
    safety_priority:  answers.safety_priority,
    raw_answers:      rawAnswers,
  };
}
