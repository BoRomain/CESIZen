import { useState, useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserProviter"; // Vérifie l'orthographe de "Provider" ;)
import axios from "../utils/axios";
import type User from "../class/User";

interface Props {
  children: ReactNode;
}

let currentUserRequest: Promise<User> | null = null;

const fetchCurrentUser = async (): Promise<User> => {
  if (!currentUserRequest) {
    currentUserRequest = axios
      .get("/utilisateur/get-user")
      .then((res) => res.data as User)
      .finally(() => {
        currentUserRequest = null;
      });
  }

  return currentUserRequest;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    let isActive = true;

    if (user) {
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    fetchCurrentUser()
      .then((userData) => {
        if (isActive) {
          setUser(userData);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [user, setUser]);

  if (isLoading) {
    return <div></div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
