import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Clock,
  MapPin,
  Utensils,
  Landmark,
  Leaf,
  Calendar,
  Gem,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import type { DayPlan } from "../../types";
import { activityConfig, type ActivityType } from "./activityConfig";

const iconMap: Record<string, LucideIcon> = {
  Utensils,
  Landmark,
  Leaf,
  Calendar,
  Gem,
};

const GRADIENTS = [
  "linear-gradient(135deg, #1a3a5c, #0a6e5c)",
  "linear-gradient(135deg, #3a1a5c, #6e0a4a)",
  "linear-gradient(135deg, #1a4a1a, #2a6e2a)",
  "linear-gradient(135deg, #4a3a1a, #6e5a0a)",
  "linear-gradient(135deg, #1a2a4a, #0a3a6e)",
];

interface Props {
  day: DayPlan;
  dayNumber: number;
  city?: string;
}

export const DayCard: React.FC<Props> = ({ day, dayNumber, city = "" }) => {
  const [open, setOpen] = useState(dayNumber === 1);

  const gradient = GRADIENTS[(dayNumber - 1) % GRADIENTS.length];

  return (
    <div className="bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-2xl overflow-hidden">
      {/* Day photo banner — always 140px when open */}
      {open && (
        <div style={{ height: 140, overflow: "hidden", position: "relative", borderRadius: "16px 16px 0 0" }}>
          {day.photo_url ? (
            <>
              <img
                src={day.photo_url}
                alt={day.theme}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 30%, rgba(7,58,110,0.85))",
              }} />
            </>
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 600, textAlign: "center", padding: "0 16px" }}>
                {day.theme}
              </span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[#5bc4a0] font-bold text-lg">Day {dayNumber}</span>
            {day.date && <span className="text-gray-400 text-sm">{day.date}</span>}
            {day.weather && (
              <span style={{
                background: "rgba(91,196,160,0.12)",
                border: "1px solid rgba(91,196,160,0.25)",
                borderRadius: 999, padding: "2px 8px",
                fontSize: 11, color: "#5bc4a0",
              }}>
                {day.weather}
              </span>
            )}
          </div>
          <p className="text-white font-medium mt-0.5">{day.theme}</p>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {day.activities.map((activity, i) => {
                const cfg = activityConfig[activity.type as ActivityType] ?? activityConfig.culture;
                const Icon = iconMap[cfg.iconName] ?? Leaf;
                const mapsQuery = activity.google_maps_query
                  || `${activity.title} ${activity.location} ${city}`;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: cfg.color + "25" }}
                      >
                        <Icon size={14} style={{ color: cfg.color }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white font-medium text-sm leading-snug">{activity.title}</h4>
                        {activity.estimated_cost_eur != null && (
                          activity.estimated_cost_eur === 0 ? (
                            <span style={{
                              background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                              borderRadius: 999, padding: "2px 8px", fontSize: 11,
                              color: "#22c55e", flexShrink: 0,
                            }}>
                              Free
                            </span>
                          ) : (
                            <span style={{
                              background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)",
                              borderRadius: 999, padding: "2px 8px", fontSize: 11,
                              color: "#fbbf24", flexShrink: 0,
                            }}>
                              ~€{activity.estimated_cost_eur}
                            </span>
                          )
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {activity.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={10} /> {activity.location}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{activity.description}</p>

                      {activity.opening_hours && (
                        <span style={{
                          fontSize: 11, color: "rgba(255,255,255,0.3)",
                          display: "flex", alignItems: "center", gap: 4, marginTop: 4,
                        }}>
                          🕐 {activity.opening_hours}
                        </span>
                      )}
                      {activity.opening_warning && (
                        <div style={{
                          fontSize: 12, color: "#ef9f27",
                          background: "rgba(239,159,39,0.08)",
                          border: "1px solid rgba(239,159,39,0.2)",
                          borderRadius: 6, padding: "5px 10px", marginTop: 6,
                          display: "flex", alignItems: "center", gap: 6,
                        }}>
                          ⚠️ {activity.opening_warning}
                        </div>
                      )}

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          marginTop: 6, fontSize: 11, color: "#5bc4a0",
                          textDecoration: "none",
                          background: "rgba(91,196,160,0.08)",
                          border: "1px solid rgba(91,196,160,0.2)",
                          borderRadius: 6, padding: "3px 8px",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = "rgba(91,196,160,0.16)")}
                        onMouseOut={e => (e.currentTarget.style.background = "rgba(91,196,160,0.08)")}
                      >
                        <ExternalLink size={9} /> 📍 View on Maps
                      </a>
                    </div>
                  </div>
                );
              })}

              {day.events && day.events.length > 0 && (
                <div style={{
                  background: "rgba(127,119,221,0.07)",
                  border: "1px solid rgba(127,119,221,0.15)",
                  borderRadius: 10, padding: 14, marginTop: 10,
                }}>
                  <p style={{
                    fontSize: 11, color: "rgba(175,169,236,0.8)",
                    letterSpacing: "0.08em", marginBottom: 10, fontWeight: 600,
                  }}>
                    🎭 EVENTS HAPPENING DURING YOUR VISIT
                  </p>
                  {day.events.map((ev, i) => {
                    const [label, url] = ev.split("||");
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", gap: 12,
                        padding: "8px 0",
                        borderBottom: i < day.events!.length - 1
                          ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", flex: 1 }}>
                          🎟️ {label}
                        </span>
                        {url && url.startsWith("http") && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: 11, color: "#afa9ec", flexShrink: 0,
                              border: "1px solid rgba(175,169,236,0.3)",
                              borderRadius: 6, padding: "4px 10px",
                              textDecoration: "none", transition: "all 0.15s",
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = "rgba(175,169,236,0.15)";
                              e.currentTarget.style.borderColor = "rgba(175,169,236,0.6)";
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.borderColor = "rgba(175,169,236,0.3)";
                            }}
                          >
                            Get tickets →
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
