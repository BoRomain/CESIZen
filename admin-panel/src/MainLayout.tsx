import Sidebar from "./components/sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-8 max-w-[1300px] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
