import { useState, useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserProviter"; // Vérifie l'orthographe de "Provider" ;)
import axios from "../utils/axios";
import type User from "../class/User";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      axios
        .get("/utilisateur/get-user")
        .then((res) => {
          const userData = res.data as User;
          setUser(userData);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user, setUser]);

  if (isLoading) {
    return <div></div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
