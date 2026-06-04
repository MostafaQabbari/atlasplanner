import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { DayCard } from "../components/plan/DayCard";
import { PlanSummary } from "../components/plan/PlanSummary";
import { PlanLoading } from "../components/plan/PlanLoading";
import { generatePlan } from "../services/api";

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
        <button
          onClick={() => setScreen("recommendations")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={15} />
          Back to recommendations
        </button>

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
