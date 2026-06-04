import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Clock,
  MapPin,
  Euro,
  Utensils,
  Landmark,
  Leaf,
  Calendar,
  Gem,
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

interface Props {
  day: DayPlan;
  dayNumber: number;
}

export const DayCard: React.FC<Props> = ({ day, dayNumber }) => {
  const [open, setOpen] = useState(dayNumber === 1);

  return (
    <div className="bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[#5bc4a0] font-bold text-lg">Day {dayNumber}</span>
            {day.date && <span className="text-gray-400 text-sm">{day.date}</span>}
          </div>
          <p className="text-white font-medium mt-0.5">{day.theme}</p>
          {day.weather && <p className="text-gray-400 text-xs mt-0.5">☁ {day.weather}</p>}
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
                          <span className="text-[#5bc4a0] text-xs flex items-center gap-0.5 flex-shrink-0">
                            <Euro size={10} />{activity.estimated_cost_eur}
                          </span>
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
                    </div>
                  </div>
                );
              })}

              {day.events && day.events.length > 0 && (
                <div className="pt-3 border-t border-[#5bc4a0]/10">
                  <p className="text-xs text-[#5bc4a0] font-semibold mb-1.5">Local events nearby</p>
                  {day.events.map((e, i) => (
                    <p key={i} className="text-xs text-gray-400">• {e}</p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
