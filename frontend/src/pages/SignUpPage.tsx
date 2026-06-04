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

function passwordStrength(pw: string): { label: string; color: string } {
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const score = (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSymbol ? 1 : 0);
  if (pw.length < 6) return { label: "Weak", color: "#f87171" };
  if (pw.length >= 12 && score >= 2) return { label: "Strong", color: "#5bc4a0" };
  if (pw.length >= 8 && score >= 1) return { label: "Good", color: "#fbbf24" };
  return { label: "Weak", color: "#f87171" };
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = password ? passwordStrength(password) : null;

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
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/quiz");
    } catch {
      setError("Could not create account. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#042c53" }}>
      <Starfield />

      <div className="relative z-10 w-full" style={{ maxWidth: 400 }}>
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
            Start your journey
          </h1>
          <p className="text-center mb-8" style={{ color: "#5bc4a0", fontSize: 14 }}>
            Create your free AtlasPlanner account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              {strength && (
                <p style={{ fontSize: 12, marginTop: 6, color: strength.color, fontWeight: 600 }}>
                  Password strength: {strength.label}
                </p>
              )}
            </div>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Already have an account?{" "}
            <Link to="/signin" style={{ color: "#5bc4a0", textDecoration: "none", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
