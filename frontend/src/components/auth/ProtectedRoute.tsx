import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  // Still reading token from localStorage — wait before redirecting
  if (token === null && localStorage.getItem("atlas_token")) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#042c53",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#5bc4a0", fontSize: 15 }}>Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;