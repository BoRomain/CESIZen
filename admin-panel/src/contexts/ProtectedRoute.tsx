// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useUser } from "./UserProviter";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user } = useUser();

  if (user?.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
