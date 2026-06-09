import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import { CountryCardComponent } from "../components/recommendations/CountryCardComponent";
import { ProfileBadge } from "../components/recommendations/ProfileBadge";
import { PlanLoading } from "../components/plan/PlanLoading";
import { getRecommendations, generatePlan } from "../services/api";

const SLOW_THRESHOLD_MS = 15000;
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const RecommendationsPage: React.FC = () => {
  const {
    profile,
    travelDates,
    budget,
    originCity,
    recommendations,
    setRecommendations,
    setSelectedCountry,
    setPlan,
    setScreen,
  } = useQuiz();

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [ready, setReady]           = useState(!!recommendations); // skip form if already loaded
  const [pref1, setPref1]           = useState("");
  const [pref2, setPref2]           = useState("");
  const [countryPhotos, setCountryPhotos] = useState<Record<string, string>>({});

  // Plan loading state
  const [planLoading, setPlanLoading]     = useState(false);
  const [planError, setPlanError]         = useState<string | null>(null);
  const [slowMessage, setSlowMessage]     = useState(false);
  const [pendingCountry, setPendingCountry] = useState<{ country: string; city: string; matchScore: number } | null>(null);

  // Fetch Unsplash photos for each country card
  useEffect(() => {
    if (!recommendations || !UNSPLASH_KEY) return;
    recommendations.forEach(async (card) => {
      if (countryPhotos[card.country]) return;
      try {
        const resp = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(card.country + " travel landscape")}&per_page=1`,
          { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
        );
        if (resp.ok) {
          const data = await resp.json();
          if (data.results?.[0]) {
            setCountryPhotos(prev => ({
              ...prev,
              [card.country]: data.results[0].urls.regular,
            }));
          }
        }
      } catch {}
    });
  }, [recommendations]);

  const fetchRecommendations = async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    const preferred = [pref1, pref2].filter(Boolean);
    try {
      const res = await getRecommendations({
        profile,
        travel_start: travelDates.start,
        travel_end:   travelDates.end,
        budget_eur:   budget,
        nationality:  profile.nationality,
        origin_city:  originCity || "",
        preferred_countries: preferred,
      });
      setRecommendations(res.recommendations);
    } catch {
      setError("Couldn't load recommendations — please check your connection.");
    } finally {
      setLoading(false);
    }
  };

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

      // Save profile to localStorage for ProfilePage
      try {
        localStorage.setItem("atlas_profile", JSON.stringify(profile));
      } catch {}

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

      {/* Preferred countries form (shown when not yet fetched) */}
      {!ready && !recommendations && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-[#073a6e]/40 border border-[#5bc4a0]/20 rounded-2xl p-6"
        >
          <p className="text-white font-semibold mb-1">Do you have any countries in mind?</p>
          <p className="text-gray-400 text-xs mb-4">Optional — Claude will factor these in but still recommend the best fit.</p>
          <div className="flex gap-3 mb-5">
            <input
              type="text"
              value={pref1}
              onChange={e => setPref1(e.target.value)}
              placeholder="Country 1 (optional)"
              className="flex-1 bg-[#042c53]/60 border border-[#5bc4a0]/20 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#5bc4a0] text-sm"
            />
            <input
              type="text"
              value={pref2}
              onChange={e => setPref2(e.target.value)}
              placeholder="Country 2 (optional)"
              className="flex-1 bg-[#042c53]/60 border border-[#5bc4a0]/20 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#5bc4a0] text-sm"
            />
          </div>
          <button
            onClick={() => { setReady(true); fetchRecommendations(); }}
            className="w-full py-3.5 bg-[#5bc4a0] text-[#042c53] font-bold rounded-xl hover:bg-[#4aab8d] transition-colors text-sm"
          >
            Find my destinations →
          </button>
        </motion.div>
      )}

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
            <div key={card.country}>
              {/* Unsplash banner */}
              {countryPhotos[card.country] && (
                <div style={{
                  height: 160, borderRadius: "16px 16px 0 0", overflow: "hidden",
                  position: "relative", marginBottom: -16,
                }}>
                  <img
                    src={countryPhotos[card.country]}
                    alt={card.country}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent 40%, rgba(7,58,110,0.6))",
                  }} />
                </div>
              )}
              <CountryCardComponent
                card={card}
                index={i}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
