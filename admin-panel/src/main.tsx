import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainLayout from "./MainLayout.tsx";
import "./styles/index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserProviter.tsx";
import { ProtectedRoute } from "./contexts/ProtectedRoute.tsx";
import AuthLayout from "./AuthLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthLayout />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
);
