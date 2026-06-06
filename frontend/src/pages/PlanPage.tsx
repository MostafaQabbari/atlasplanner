import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronDown,
  Lightbulb,
  X,
  Calendar,
  Euro,
  User,
} from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { DayCard } from "../components/plan/DayCard";
import { PlanLoading } from "../components/plan/PlanLoading";
import { generatePlan, saveTrip } from "../services/api";

const CUSTOMIZATION_OPTIONS = [
  "Add more food experiences",
  "Add more cultural sites",
  "Make pace slower (remove 1 activity/day)",
  "Make pace faster (add 1 activity/day)",
  "Focus on hidden gems only",
  "Add a day trip outside the city",
];

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

  const [saving, setSaving]               = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizations, setCustomizations] = useState<string[]>([]);
  const [regenerating, setRegenerating]   = useState(false);
  const [regenError, setRegenError]       = useState<string | null>(null);
  const [tipsExpanded, setTipsExpanded]   = useState(false);
  const [localLoading, setLocalLoading]   = useState(false);
  const [localError, setLocalError]       = useState<string | null>(null);

  // Fallback load if navigated directly (plan not pre-loaded)
  useEffect(() => {
    if (!profile || !selectedCountry || plan) return;

    const load = async () => {
      setLocalLoading(true);
      setLocalError(null);
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
        setLocalError("Couldn't generate your plan — please try again.");
      } finally {
        setLocalLoading(false);
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
        nationality: profile?.nationality,
        customizations,
      });
      setSaved(true);
    } catch {
      // ignore — user may not be signed in
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!profile || !selectedCountry) return;
    setRegenerating(true);
    setRegenError(null);
    try {
      const result = await generatePlan({
        profile,
        country:        selectedCountry.country,
        city:           selectedCountry.city,
        travel_start:   travelDates.start,
        travel_end:     travelDates.end,
        budget_eur:     budget,
        customizations,
      });
      setPlan(result);
      setCustomizeOpen(false);
      setSaved(false);
    } catch {
      setRegenError("Couldn't regenerate plan. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  const toggleCustomization = (opt: string) => {
    setCustomizations((prev) =>
      prev.includes(opt) ? prev.filter((c) => c !== opt) : [...prev, opt]
    );
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

  if (localLoading) {
    return (
      <PlanLoading
        destination={`${selectedCountry.city}, ${selectedCountry.country}`}
      />
    );
  }

  const startDate = travelDates.start ? new Date(travelDates.start) : null;
  const endDate   = travelDates.end   ? new Date(travelDates.end)   : null;
  const totalDays = startDate && endDate
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : plan?.days.length ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-28">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* Back button */}
        <button
          onClick={() => setScreen("recommendations")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6"
        >
          <ArrowLeft size={15} />
          Back to recommendations
        </button>

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="min-w-0">
            <h1
              className="text-3xl font-bold text-white truncate"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {selectedCountry.city}
            </h1>
            <p className="text-[#5bc4a0] text-lg font-medium">{selectedCountry.country}</p>
            <p className="text-gray-400 text-sm mt-1">
              {travelDates.start} → {travelDates.end}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {selectedCountry.match_score != null && (
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#5bc4a0]/20 text-[#5bc4a0] border border-[#5bc4a0]/30">
                {selectedCountry.match_score}% match
              </span>
            )}
            {plan && (
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="flex items-center gap-2 text-sm font-semibold transition-all"
                style={{
                  border: `1.5px solid ${saved ? "#5bc4a0" : "rgba(91,196,160,0.4)"}`,
                  borderRadius: 8,
                  padding: "7px 14px",
                  background: saved ? "rgba(91,196,160,0.1)" : "transparent",
                  color: saved ? "#5bc4a0" : "rgba(255,255,255,0.7)",
                  cursor: saving || saved ? "default" : "pointer",
                }}
              >
                {saved ? <Check size={14} /> : <Bookmark size={14} />}
                {saved ? "Saved ✓" : saving ? "Saving…" : "Save Trip"}
              </button>
            )}
          </div>
        </div>

        {/* TRIP SUMMARY BAR */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-xl p-4 text-center">
            <Calendar size={16} className="text-[#5bc4a0] mx-auto mb-1" />
            <p className="text-2xl font-bold text-white leading-tight">{totalDays}</p>
            <p className="text-gray-400 text-xs mt-0.5">Days</p>
          </div>
          <div className="bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-xl p-4 text-center">
            <Euro size={16} className="text-[#5bc4a0] mx-auto mb-1" />
            <p className="text-lg font-bold text-white leading-tight">
              {plan?.total_estimated_cost_eur != null
                ? `€${Math.round(plan.total_estimated_cost_eur).toLocaleString()}`
                : "—"}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">Est. Budget</p>
          </div>
          <div className="bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-xl p-4 text-center">
            <User size={16} className="text-[#5bc4a0] mx-auto mb-1" />
            <p className="text-sm font-bold text-[#5bc4a0] leading-tight line-clamp-2">{profile.traveler_type}</p>
            <p className="text-gray-400 text-xs mt-0.5">Style</p>
          </div>
        </div>

        {/* LOCAL TIPS */}
        {plan?.tips && plan.tips.length > 0 && (
          <div className="mb-6 bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-2xl overflow-hidden">
            <button
              onClick={() => setTipsExpanded((v) => !v)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={17} className="text-[#5bc4a0]" />
                <span className="font-semibold text-white text-sm">Local Tips</span>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-200 ${tipsExpanded ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {tipsExpanded && (
                <motion.div
                  key="tips"
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-2">
                    {plan.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-[#5bc4a0] flex-shrink-0 mt-0.5">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Error state */}
        {localError && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{localError}</p>
            <button
              onClick={() => setScreen("recommendations")}
              className="text-[#5bc4a0] underline text-sm"
            >
              Go back
            </button>
          </div>
        )}

        {/* DAY-BY-DAY ITINERARY */}
        {plan && (
          <div className="space-y-4">
            {plan.days.map((day, i) => (
              <DayCard key={i} day={day} dayNumber={i + 1} />
            ))}
          </div>
        )}
      </motion.div>

      {/* CUSTOMIZE FLOATING BUTTON */}
      {plan && (
        <button
          onClick={() => setCustomizeOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 font-bold py-3 px-5 rounded-full shadow-2xl transition-colors z-40"
          style={{ background: "#5bc4a0", color: "#042c53" }}
        >
          ✏️ Customize
        </button>
      )}

      {/* CUSTOMIZE SLIDE-IN PANEL */}
      <AnimatePresence>
        {customizeOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setCustomizeOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 h-full z-50 flex flex-col"
              style={{
                width: 320,
                background: "#042c53",
                borderLeft: "1px solid rgba(91,196,160,0.2)",
              }}
            >
              {/* Panel header */}
              <div
                className="flex items-center justify-between p-5"
                style={{ borderBottom: "1px solid rgba(91,196,160,0.15)" }}
              >
                <h2 className="text-white font-bold text-lg">Customize Plan</h2>
                <button
                  onClick={() => setCustomizeOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Checkboxes */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <p className="text-gray-400 text-xs mb-2">
                  Select adjustments, then regenerate your plan.
                </p>
                {CUSTOMIZATION_OPTIONS.map((opt) => {
                  const checked = customizations.includes(opt);
                  return (
                    <label
                      key={opt}
                      className="flex items-start gap-3 cursor-pointer group"
                      onClick={() => toggleCustomization(opt)}
                    >
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all"
                        style={{
                          borderColor: checked ? "#5bc4a0" : "rgba(91,196,160,0.35)",
                          background: checked ? "#5bc4a0" : "transparent",
                        }}
                      >
                        {checked && <Check size={12} style={{ color: "#042c53" }} />}
                      </span>
                      <span className="text-gray-200 text-sm leading-snug group-hover:text-white transition-colors">
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Panel footer */}
              <div
                className="p-5"
                style={{ borderTop: "1px solid rgba(91,196,160,0.15)" }}
              >
                {regenError && (
                  <p className="text-red-400 text-xs mb-3">{regenError}</p>
                )}
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating || customizations.length === 0}
                  className="w-full py-3 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#5bc4a0", color: "#042c53" }}
                >
                  {regenerating ? "Regenerating…" : "Regenerate plan"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
