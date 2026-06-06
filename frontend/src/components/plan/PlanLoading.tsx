import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Analyzing your travel DNA...",
  "Checking local events & weather...",
  "Crafting your day-by-day itinerary...",
  "Finding hidden gems...",
  "Almost ready...",
];

interface Props {
  destination?: string;
  slowMessage?: boolean;
}

export const PlanLoading: React.FC<Props> = ({ destination, slowMessage }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
      {destination && (
        <p className="text-white font-semibold text-lg text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          Planning your trip to {destination}
        </p>
      )}

      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-4 border-[#5bc4a0]/25 border-t-[#5bc4a0]"
        />
        <div className="absolute inset-0 flex items-center justify-center text-4xl select-none">
          🌍
        </div>
      </div>

      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="text-[#5bc4a0] text-lg font-medium text-center max-w-xs"
      >
        {MESSAGES[idx]}
      </motion.p>

      {slowMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-sm text-center max-w-xs"
        >
          This is taking longer than usual… Claude is working on a detailed itinerary for you.
        </motion.p>
      )}
    </div>
  );
};
