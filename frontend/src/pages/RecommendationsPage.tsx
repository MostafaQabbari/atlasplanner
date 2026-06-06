import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import { CountryCardComponent } from "../components/recommendations/CountryCardComponent";
import { ProfileBadge } from "../components/recommendations/ProfileBadge";
import { PlanLoading } from "../components/plan/PlanLoading";
import { getRecommendations, generatePlan } from "../services/api";

const SLOW_THRESHOLD_MS = 15000;

export const RecommendationsPage: React.FC = () => {
  const {
    profile,
    travelDates,
    budget,
    recommendations,
    setRecommendations,
    setSelectedCountry,
    setPlan,
    setScreen,
  } = useQuiz();

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // Plan loading state
  const [planLoading, setPlanLoading]     = useState(false);
  const [planError, setPlanError]         = useState<string | null>(null);
  const [slowMessage, setSlowMessage]     = useState(false);
  const [pendingCountry, setPendingCountry] = useState<{ country: string; city: string; matchScore: number } | null>(null);

  useEffect(() => {
    if (!profile || recommendations) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRecommendations({
          profile,
          travel_start: travelDates.start,
          travel_end:   travelDates.end,
          budget_eur:   budget,
          nationality:  profile.nationality,
        });
        setRecommendations(res.recommendations);
      } catch {
        setError("Couldn't load recommendations — please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [profile]);

  const handleSelect = async (country: string, city: string, matchScore: number) => {
    if (planLoading) return;
    setPendingCountry({ country, city, matchScore });
    setPlanLoading(true);
    setPlanError(null);
    setSlowMessage(false);

    const slowTimer = setTimeout(() => setSlowMessage(true), SLOW_THRESHOLD_MS);

    try {
      const result = await generatePlan({
        profile: profile!,
        country,
        city,
        travel_start: travelDates.start,
        travel_end:   travelDates.end,
        budget_eur:   budget,
      });

      setPlan(result);
      setSelectedCountry({ country, city, match_score: matchScore });
      setScreen("plan");
    } catch {
      setPlanError("Couldn't generate your plan — please try again.");
    } finally {
      clearTimeout(slowTimer);
      setPlanLoading(false);
    }
  };

  const handleRetry = () => {
    if (!pendingCountry) return;
    const { country, city, matchScore } = pendingCountry;
    handleSelect(country, city, matchScore);
  };

  if (!profile) {
    return (
      <div className="text-center p-8 text-gray-400">
        No profile found.{" "}
        <button onClick={() => setScreen("quiz")} className="text-[#5bc4a0] underline">
          Retake quiz
        </button>
      </div>
    );
  }

  // Show plan loading overlay
  if (planLoading && pendingCountry) {
    return (
      <div className="relative">
        <PlanLoading
          destination={`${pendingCountry.city}, ${pendingCountry.country}`}
          slowMessage={slowMessage}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Your Matches</h1>
        <p className="text-gray-400 text-sm mb-4">Based on your travel personality</p>
        <ProfileBadge profile={profile} />
      </motion.div>

      {loading && (
        <div className="text-center py-14">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#5bc4a0]/25 border-t-[#5bc4a0] rounded-full mx-auto mb-4"
          />
          <p className="text-[#5bc4a0] text-sm">Finding perfect destinations…</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => setScreen("quiz")} className="text-[#5bc4a0] underline text-sm">
            Go back
          </button>
        </div>
      )}

      <AnimatePresence>
        {planError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-red-900/30 border border-red-500/30 rounded-2xl p-5 text-center"
          >
            <p className="text-red-300 text-sm mb-3">{planError}</p>
            <button
              onClick={handleRetry}
              className="text-[#5bc4a0] text-sm font-semibold hover:underline"
            >
              Try again →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {recommendations && !loading && (
        <div className="space-y-4">
          {recommendations.map((card, i) => (
            <CountryCardComponent
              key={card.country}
              card={card}
              index={i}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
