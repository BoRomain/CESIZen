// components/ProtectedRoute.tsx
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "./UserProviter";
import type { ReactNode } from "react";
import axios from "../utils/axios";
import type User from "../class/User";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const nativate = useNavigate();
  const { user, setUser } = useUser();

  if (!user) {
    axios.get("/utilisateur/get-user").then((res) => {
      const userData = res.data as User;
      if (userData.role !== "admin") {
        return nativate("/auth");
      }
      setUser(res.data);
    });
  }

  return <>{children}</>;
};
