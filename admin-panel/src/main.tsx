import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainLayout from "./MainLayout.tsx";
import "./styles/index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserProviter.tsx";
import { ProtectedRoute } from "./contexts/ProtectedRoute.tsx";
import AuthLayout from "./AuthLayout.tsx";
import UsersList from "./routes/usersList.tsx";
import Dashboard from "./routes/Dashboard.tsx";
import InfosList from "./routes/infosList.tsx";
import ActivitiesList from "./routes/activitiesList.tsx";
import CreateUser from "./routes/createUser.tsx";
import ModifyUser from "./routes/modifyUser.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
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
            <Route path="users/add" element={<CreateUser />} />
            <Route path="users/edit/:id" element={<ModifyUser />} />
            <Route path="infos" element={<InfosList />} />
            <Route path="activities" element={<ActivitiesList />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
);
