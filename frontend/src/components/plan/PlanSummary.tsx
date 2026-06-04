import React from "react";
import { Euro, Lightbulb } from "lucide-react";
import type { TravelPlan } from "../../types";

interface Props {
  plan: TravelPlan;
}

export const PlanSummary: React.FC<Props> = ({ plan }) => (
  <div className="space-y-4">
    {plan.total_estimated_cost_eur != null && (
      <div className="bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-[#5bc4a0] mb-1">
          <Euro size={17} />
          <span className="font-semibold text-sm uppercase tracking-wide">Estimated total</span>
        </div>
        <p className="text-3xl font-black text-white">
          €{plan.total_estimated_cost_eur.toLocaleString()}
        </p>
      </div>
    )}

    {plan.tips.length > 0 && (
      <div className="bg-[#073a6e]/60 border border-[#5bc4a0]/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={17} className="text-[#f59e0b]" />
          <span className="font-semibold text-white text-sm uppercase tracking-wide">Travel tips</span>
        </div>
        <ul className="space-y-2">
          {plan.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
              <span className="text-[#5bc4a0] font-bold mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
