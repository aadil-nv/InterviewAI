import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated && restricted) return <Navigate to="/home" />;
  return <>{children}</>;
};

export default PublicRoute;
