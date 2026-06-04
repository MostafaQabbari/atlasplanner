import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Bookmark, Check } from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { DayCard } from "../components/plan/DayCard";
import { PlanSummary } from "../components/plan/PlanSummary";
import { PlanLoading } from "../components/plan/PlanLoading";
import { generatePlan, saveTrip } from "../services/api";

export const PlanPage: React.FC = () => {
  const {
    profile,
    travelDates,
    budget,
    selectedCountry,
    plan,
    setPlan,
    setScreen,
  } = useQuiz();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    if (!profile || !selectedCountry || plan) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await generatePlan({
          profile,
          country:      selectedCountry.country,
          city:         selectedCountry.city,
          travel_start: travelDates.start,
          travel_end:   travelDates.end,
          budget_eur:   budget,
        });
        setPlan(result);
      } catch {
        setError("Couldn't generate your plan — please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedCountry]);

  const handleSave = async () => {
    if (!plan || !selectedCountry || saving || saved) return;
    setSaving(true);
    try {
      await saveTrip({
        country:    selectedCountry.country,
        city:       selectedCountry.city,
        startDate:  travelDates.start,
        endDate:    travelDates.end,
        planJson:   JSON.stringify(plan),
        matchScore: selectedCountry.match_score,
      });
      setSaved(true);
    } catch {
      // silently ignore — user is not signed in or request failed
    } finally {
      setSaving(false);
    }
  };

  if (!profile || !selectedCountry) {
    return (
      <div className="text-center p-8 text-gray-400">
        Missing trip info.{" "}
        <button onClick={() => setScreen("recommendations")} className="text-[#5bc4a0] underline">
          Go back
        </button>
      </div>
    );
  }

  if (loading) return <PlanLoading />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Top row: back + save */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setScreen("recommendations")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={15} />
            Back to recommendations
          </button>

          {plan && (
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{
                border: `1.5px solid ${saved ? "#5bc4a0" : "rgba(91,196,160,0.5)"}`,
                borderRadius: 8,
                padding: "7px 14px",
                background: "transparent",
                color: saved ? "#5bc4a0" : "rgba(255,255,255,0.7)",
                cursor: saving || saved ? "default" : "pointer",
              }}
            >
              {saved ? <Check size={14} /> : <Bookmark size={14} />}
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save this trip"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <MapPin size={22} className="text-[#5bc4a0] flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              {selectedCountry.city}, {selectedCountry.country}
            </h1>
            <p className="text-gray-400 text-sm">
              {travelDates.start} → {travelDates.end}
            </p>
          </div>
        </div>

        {error && (
          <div className="text-center py-10">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => setScreen("recommendations")}
              className="text-[#5bc4a0] underline text-sm"
            >
              Go back
            </button>
          </div>
        )}

        {plan && (
          <div className="space-y-4">
            <PlanSummary plan={plan} />
            {plan.days.map((day, i) => (
              <DayCard key={i} day={day} dayNumber={i + 1} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
