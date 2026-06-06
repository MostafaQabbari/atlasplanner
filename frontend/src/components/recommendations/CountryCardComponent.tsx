import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Wallet, CreditCard, MapPin, Gem } from "lucide-react";
import type { CountryCard } from "../../types";
import { MatchScoreRing } from "./MatchScoreRing";

interface Props {
  card: CountryCard;
  index: number;
  onSelect: (country: string, city: string, matchScore: number) => void;
}

const budgetMeta = {
  perfect:     { label: "Perfect fit",       className: "text-[#5bc4a0]"  },
  comfortable: { label: "Comfortable",        className: "text-blue-300"   },
  tight:       { label: "Tight budget",       className: "text-orange-300" },
};

export const CountryCardComponent: React.FC<Props> = ({ card, index, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const budget = budgetMeta[card.budget_fit] ?? budgetMeta.comfortable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09 }}
      className="bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-2xl overflow-hidden backdrop-blur-sm"
    >
      {/* Header row */}
      <div className="p-5 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-white truncate">{card.country}</h3>
          <p className="text-[#5bc4a0]/80 text-sm mt-1 leading-snug">{card.why_it_fits}</p>
        </div>
        <MatchScoreRing score={card.match_score} size={72} />
      </div>

      {/* Info chips */}
      <div className="px-5 pb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 text-gray-300">
          <Cloud size={13} className="text-blue-300" />
          {card.weather_summary}
        </span>
        <span className={`flex items-center gap-1.5 ${budget.className}`}>
          <Wallet size={13} />
          {budget.label}
        </span>
        <span className="flex items-center gap-1.5 text-gray-300">
          <CreditCard size={13} className="text-purple-300" />
          {card.currency}
        </span>
      </div>

      {/* Cities */}
      <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
        <MapPin size={13} className="text-[#5bc4a0]" />
        {card.best_cities.map((city) => (
          <span
            key={city}
            className="text-sm text-gray-200 bg-[#042c53]/60 px-2.5 py-0.5 rounded-full"
          >
            {city}
          </span>
        ))}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-4 space-y-3">
          <div className="flex items-start gap-2 bg-[#5bc4a0]/10 border border-[#5bc4a0]/20 rounded-xl p-3">
            <Gem size={15} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 text-sm">{card.wildcard_fact}</p>
          </div>
          <p className="text-sm text-gray-400">
            <span className="text-gray-200 font-medium">Visa: </span>
            {card.visa_info}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 py-2.5 text-sm text-gray-300 border border-gray-600 rounded-xl hover:border-[#5bc4a0]/50 transition-colors"
        >
          {expanded ? "Less" : "More info"}
        </button>
        <button
          onClick={() => onSelect(card.country, card.best_cities[0], card.match_score)}
          className="flex-1 py-2.5 text-sm font-semibold bg-[#5bc4a0] text-[#042c53] rounded-xl hover:bg-[#4aab8d] transition-colors"
        >
          Plan this trip →
        </button>
      </div>
    </motion.div>
  );
};
