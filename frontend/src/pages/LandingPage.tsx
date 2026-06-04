import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#042c53" }}>
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(4,44,83,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(91,196,160,0.12)",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex items-center gap-2" style={{ color: "#5bc4a0", fontWeight: 700, fontSize: 18 }}>
          <Globe size={18} />
          AtlasPlanner
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/signin")}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(91,196,160,0.4)",
              borderRadius: 8,
              color: "#5bc4a0",
              padding: "6px 18px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/signup")}
            style={{
              background: "#5bc4a0",
              border: "none",
              borderRadius: 8,
              color: "#042c53",
              padding: "6px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55 }}
        >
          <div className="text-7xl mb-5 select-none">🌍</div>
          <h1
            className="text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}
          >
            AtlasPlanner
          </h1>
          <p className="mb-3" style={{ color: "#5bc4a0", fontSize: 20, fontWeight: 300 }}>
            Your AI travel companion
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 400, lineHeight: 1.6 }}>
            Answer a few questions and get perfectly matched destinations with a
            personalised day-by-day itinerary.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          onClick={() => navigate("/quiz")}
          style={{
            padding: "16px 40px",
            background: "#5bc4a0",
            color: "#042c53",
            fontWeight: 700,
            fontSize: 17,
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(91,196,160,0.25)",
          }}
        >
          Start planning →
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPage;
