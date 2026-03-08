import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainLayout from "./MainLayout.tsx";
import "./styles/index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserProviter.tsx";
import { ProtectedRoute } from "./contexts/ProtectedRoute.tsx";
import AuthLayout from "./AuthLayout.tsx";
import UsersList from "./routes/usersList.tsx";
import Dashboard from "./routes/Dashboard.tsx";
import InfosList from "./routes/infosList.tsx";
import ActivitiesList from "./routes/activitiesList.tsx";

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
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="infos" element={<InfosList />} />
            <Route path="activities" element={<ActivitiesList />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
);
