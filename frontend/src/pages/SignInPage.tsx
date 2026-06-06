import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Starfield: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 60 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white opacity-40"
        style={{
          width: Math.random() * 2 + 1 + "px",
          height: Math.random() * 2 + 1 + "px",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
        }}
      />
    ))}
  </div>
);

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.07)",
    border: "1.5px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "14px 16px",
    color: "#fff",
    fontSize: 15,
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/quiz");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#042c53" }}>
      <Starfield />

      <div
        className="relative z-10 w-full"
        style={{ maxWidth: 400 }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "40px 36px",
          }}
        >
          <h1
            className="text-3xl text-white mb-2 text-center"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            Welcome back
          </h1>
          <p className="text-center mb-8" style={{ color: "#5bc4a0", fontSize: 14 }}>
            Sign in to your AtlasPlanner account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />

            {error && (
              <p style={{ color: "#f87171", fontSize: 13, textAlign: "center" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#5bc4a0",
                color: "#042c53",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#5bc4a0", textDecoration: "none", fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;