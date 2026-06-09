import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getUserTrips } from "../services/api";

interface SavedProfile {
  traveler_type?: string;
  pace?: string;
  interests?: string[];
  budget_style?: string;
}

interface Trip {
  country: string;
}

function memberSince(token: string | null): string {
  if (!token) return "Unknown";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const date = new Date(payload.iat * 1000);
    return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  } catch {
    return "Unknown";
  }
}

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const INTEREST_ICONS: Record<string, string> = {
  food: "🍽️", culture: "🏛️", nature: "🌿", adventure: "🪂",
  history: "📜", art: "🎨", beaches: "🏖️", mountains: "⛰️",
};

const PACE_LABELS: Record<string, { label: string; pct: number }> = {
  slow: { label: "Slow & deep", pct: 33 },
  moderate: { label: "Balanced", pct: 60 },
  fast: { label: "See it all", pct: 90 },
};

const ProfilePage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(!!localStorage.getItem("atlas_token"));

  useEffect(() => {
    const raw = localStorage.getItem("atlas_profile");
    if (raw) {
      try { setSavedProfile(JSON.parse(raw)); } catch {}
    }
    getUserTrips()
      .then(data => setTrips(Array.isArray(data) ? data : []))
      .catch(() => setTrips([]));
  }, []);

  const uniqueCountries = [...new Set(trips.map(t => t.country))];
  const favoriteCountry = uniqueCountries[0] ?? "—";

  const handleClearHistory = () => {
    localStorage.removeItem("atlas_profile");
    setSavedProfile(null);
    setTrips([]);
    setConfirmClear(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const pace = savedProfile?.pace ? PACE_LABELS[savedProfile.pace] : null;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px" }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          color: "rgba(255,255,255,0.4)", background: "none", border: "none",
          cursor: "pointer", fontSize: 14, marginBottom: 32,
        }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* ── 1. Profile Header ── */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 28, marginBottom: 20,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #5bc4a0, #378add)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700, color: "#042c53",
        }}>
          {user?.name ? initials(user.name) : "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4,
          }}>
            {user?.name ?? "Traveler"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 4 }}>
            {user?.email}
          </p>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
            Member since {memberSince(token)}
          </p>
        </div>
      </div>

      {/* ── 2. Travel Personality ── */}
      {savedProfile && (
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: 24, marginBottom: 20,
        }}>
          <h3 style={{ color: "#5bc4a0", fontSize: 12, letterSpacing: "0.1em", marginBottom: 16 }}>
            TRAVEL PERSONALITY
          </h3>
          {savedProfile.traveler_type && (
            <div style={{
              display: "inline-block", background: "rgba(91,196,160,0.15)",
              border: "1px solid rgba(91,196,160,0.3)", borderRadius: 999,
              padding: "6px 16px", color: "#5bc4a0", fontSize: 14, fontWeight: 600,
              marginBottom: 16,
            }}>
              {savedProfile.traveler_type}
            </div>
          )}

          {pace && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Pace</span>
                <span style={{ color: "#fff", fontSize: 13 }}>{pace.label}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                <div style={{
                  height: "100%", width: `${pace.pct}%`,
                  background: "linear-gradient(90deg, #5bc4a0, #378add)", borderRadius: 3,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          )}

          {savedProfile.interests && savedProfile.interests.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {savedProfile.interests.map(i => (
                <span key={i} style={{
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 999, padding: "4px 12px", fontSize: 13, color: "rgba(255,255,255,0.7)",
                }}>
                  {INTEREST_ICONS[i] ?? "✈️"} {i.charAt(0).toUpperCase() + i.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 3. Trip Stats ── */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 24, marginBottom: 20,
      }}>
        <h3 style={{ color: "#5bc4a0", fontSize: 12, letterSpacing: "0.1em", marginBottom: 16 }}>
          TRIP STATS
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Trips saved", value: trips.length },
            { label: "Countries", value: uniqueCountries.length },
            { label: "Top destination", value: favoriteCountry },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1,
              }}>
                {stat.value}
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Settings ── */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 24,
      }}>
        <h3 style={{ color: "#5bc4a0", fontSize: 12, letterSpacing: "0.1em", marginBottom: 16 }}>
          SETTINGS
        </h3>

        {/* Keep me logged in toggle */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 20,
        }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Keep me logged in</span>
          <button
            onClick={() => {
              const next = !keepLoggedIn;
              setKeepLoggedIn(next);
              const tok = localStorage.getItem("atlas_token") || sessionStorage.getItem("atlas_token");
              if (tok) {
                if (next) {
                  localStorage.setItem("atlas_token", tok);
                  sessionStorage.removeItem("atlas_token");
                } else {
                  sessionStorage.setItem("atlas_token", tok);
                  localStorage.removeItem("atlas_token");
                }
              }
            }}
            style={{
              width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
              background: keepLoggedIn ? "#5bc4a0" : "rgba(255,255,255,0.15)",
              position: "relative", transition: "background 0.2s",
            }}
          >
            <span style={{
              position: "absolute", top: 2,
              left: keepLoggedIn ? 22 : 2,
              width: 20, height: 20, borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
            }} />
          </button>
        </div>

        {/* Clear travel history */}
        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "rgba(255,255,255,0.5)",
              padding: "10px 16px", fontSize: 14, cursor: "pointer",
              width: "100%", marginBottom: 12, transition: "border-color 0.2s",
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)")}
            onMouseOut={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <Trash2 size={14} /> Clear travel history
          </button>
        ) : (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, padding: 14, marginBottom: 12,
          }}>
            <p style={{ color: "#fca5a5", fontSize: 13, marginBottom: 10 }}>
              This will clear your saved personality profile. Are you sure?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleClearHistory}
                style={{
                  background: "#ef4444", border: "none", borderRadius: 8,
                  color: "#fff", padding: "7px 14px", fontSize: 13, cursor: "pointer",
                }}
              >
                Yes, clear
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                style={{
                  background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8,
                  color: "rgba(255,255,255,0.6)", padding: "7px 14px", fontSize: 13, cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "none", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, color: "#ef4444",
            padding: "10px 16px", fontSize: 14, cursor: "pointer",
            width: "100%", transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = "none";
          }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
