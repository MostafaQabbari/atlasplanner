import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useQuiz } from "../context/QuizContext";
import { getUserTrips } from "../services/api";
import type { TravelPlan } from "../types";

interface Trip {
  id: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  matchScore: number;
  savedAt: string;
  planJson?: string;
}

function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function scoreColor(score: number): string {
  if (score >= 90) return "#5bc4a0";
  if (score >= 75) return "#60a5fa";
  return "#fbbf24";
}

function countryFlag(country: string): string {
  const map: Record<string, string> = {
    Japan: "🇯🇵", France: "🇫🇷", Italy: "🇮🇹", Spain: "🇪🇸", Thailand: "🇹🇭",
    Portugal: "🇵🇹", Greece: "🇬🇷", Germany: "🇩🇪", Netherlands: "🇳🇱", UK: "🇬🇧",
    USA: "🇺🇸", Mexico: "🇲🇽", Brazil: "🇧🇷", Australia: "🇦🇺", Indonesia: "🇮🇩",
    Vietnam: "🇻🇳", Morocco: "🇲🇦", Turkey: "🇹🇷", Croatia: "🇭🇷", Iceland: "🇮🇸",
    Egypt: "🇪🇬", India: "🇮🇳", China: "🇨🇳", Argentina: "🇦🇷", Colombia: "🇨🇴",
    Peru: "🇵🇪", Chile: "🇨🇱", Czech: "🇨🇿", Hungary: "🇭🇺", Poland: "🇵🇱",
    Sweden: "🇸🇪", Norway: "🇳🇴", Finland: "🇫🇮", Denmark: "🇩🇰", Belgium: "🇧🇪",
    Switzerland: "🇨🇭", Austria: "🇦🇹", "New Zealand": "🇳🇿", Canada: "🇨🇦",
    Singapore: "🇸🇬", Malaysia: "🇲🇾", Philippines: "🇵🇭", "South Korea": "🇰🇷",
    Taiwan: "🇹🇼", "Sri Lanka": "🇱🇰", Nepal: "🇳🇵", Jordan: "🇯🇴",
  };
  return map[country] ?? "🌍";
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setPlan, setSelectedCountry, setTravelDates, setProfile, setScreen } = useQuiz();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserTrips()
      .then(data => setTrips(Array.isArray(data) ? data : []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const handleViewPlan = (trip: Trip) => {
    if (!trip.planJson) return;
    try {
      const plan = JSON.parse(trip.planJson) as TravelPlan;
      setPlan(plan);
      setSelectedCountry({ country: trip.country, city: trip.city, match_score: trip.matchScore });
      setTravelDates({ start: trip.startDate, end: trip.endDate });
      setProfile({
        traveler_type: "Explorer",
        pace: "moderate",
        social: "solo",
        interests: [],
        avoid: [],
        budget_style: "moderate",
        nationality: "Unknown",
        raw_answers: [],
      });
      setScreen("plan");
      navigate("/quiz");
    } catch {}
  };

  return (
    <div className="min-h-screen" style={{ background: "#042c53", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1
            className="text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700 }}
          >
            Your trips{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15 }}>
            All your saved travel plans in one place.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", paddingTop: 80 }}>
            Loading your trips…
          </div>
        ) : trips.length === 0 ? (
          <div
            style={{
              textAlign: "center", paddingTop: 80,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            }}
          >
            <span style={{ fontSize: 56 }}>🌐</span>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>
              No saved trips yet. Plan your first adventure →
            </p>
            <button
              onClick={() => navigate("/quiz")}
              style={{
                background: "#5bc4a0", color: "#042c53", border: "none",
                borderRadius: 10, padding: "12px 28px",
                fontWeight: 700, fontSize: 15, cursor: "pointer",
              }}
            >
              Plan your first trip →
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {trips.map((trip) => (
              <div
                key={trip.id}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16, padding: "24px",
                  display: "flex", flexDirection: "column", gap: 12,
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 28 }}>{countryFlag(trip.country)}</span>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 20, fontWeight: 700, color: "#fff",
                    }}
                  >
                    {trip.city}, {trip.country}
                  </h2>
                </div>

                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                  {formatDateRange(trip.startDate, trip.endDate)}
                </p>

                {trip.matchScore != null && (
                  <span
                    style={{
                      display: "inline-block", padding: "4px 12px",
                      borderRadius: 999, fontSize: 12, fontWeight: 700,
                      background: `${scoreColor(trip.matchScore)}22`,
                      color: scoreColor(trip.matchScore), width: "fit-content",
                    }}
                  >
                    {trip.matchScore}% match
                  </span>
                )}

                {trip.savedAt && (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
                    Saved {timeAgo(trip.savedAt)}
                  </p>
                )}

                <button
                  onClick={() => handleViewPlan(trip)}
                  style={{
                    marginTop: "auto",
                    background: "transparent",
                    border: "1.5px solid rgba(91,196,160,0.4)",
                    borderRadius: 8, color: "#5bc4a0",
                    padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = "rgba(91,196,160,0.08)")}
                  onMouseOut={e => (e.currentTarget.style.background = "transparent")}
                >
                  View plan →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/quiz")}
        title="Plan a new trip"
        style={{
          position: "fixed", bottom: 32, right: 32,
          width: 56, height: 56, borderRadius: "50%",
          background: "#5bc4a0", color: "#042c53", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(91,196,160,0.4)", zIndex: 100,
        }}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default DashboardPage;
