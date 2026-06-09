import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, LogOut, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);

  const handleLogout = () => {
    logout();
    setToast(true);
    setTimeout(() => {
      setToast(false);
      navigate("/");
    }, 2000);
  };

  const displayName = user?.name
    ? user.name.length > 14
      ? user.name.slice(0, 14) + "…"
      : user.name
    : "";

  return (
    <>
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(4,44,83,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(91,196,160,0.12)",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            color: "#5bc4a0", fontWeight: 700, fontSize: 18,
            background: "none", border: "none", cursor: "pointer",
          }}
        >
          <Globe size={19} />
          AtlasPlanner
        </button>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isAuthenticated ? (
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
          ) : (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.75)", fontSize: 14,
                  cursor: "pointer", padding: "6px 10px", borderRadius: 8,
                  transition: "color 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.color = "#fff")}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </button>

              <button
                onClick={() => navigate("/profile")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.75)", fontSize: 14,
                  cursor: "pointer", padding: "6px 10px", borderRadius: 8,
                  transition: "color 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.color = "#fff")}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              >
                <User size={15} />
                Profile
              </button>

              {displayName && (
                <span style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 13,
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {displayName}
                </span>
              )}

              <button
                onClick={handleLogout}
                onMouseOver={() => setHoverLogout(true)}
                onMouseOut={() => setHoverLogout(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none",
                  border: `1.5px solid ${hoverLogout ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8,
                  color: hoverLogout ? "#ef4444" : "rgba(255,255,255,0.5)",
                  padding: "6px 12px",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <LogOut size={13} />
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Goodbye toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#073a6e", color: "#fff", padding: "12px 24px",
          borderRadius: 12, zIndex: 9999,
          border: "1px solid rgba(91,196,160,0.3)",
          fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          Goodbye 👋
        </div>
      )}
    </>
  );
};

export default NavBar;
