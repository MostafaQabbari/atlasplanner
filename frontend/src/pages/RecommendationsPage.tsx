import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import { CountryCardComponent } from "../components/recommendations/CountryCardComponent";
import { ProfileBadge } from "../components/recommendations/ProfileBadge";
import { getRecommendations } from "../services/api";

export const RecommendationsPage: React.FC = () => {
  const {
    profile,
    travelDates,
    budget,
    recommendations,
    setRecommendations,
    setSelectedCountry,
    setScreen,
  } = useQuiz();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

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

  const handleSelect = (country: string, city: string) => {
    setSelectedCountry({ country, city });
    setScreen("plan");
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
