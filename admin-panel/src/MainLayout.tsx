import Sidebar from "./components/sidebar";
import { useUser } from "./contexts/UserProviter";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const { user } = useUser();
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex-1 m-8 mt-12 max-w-[1300px]">
        <Outlet />
      </div>
    </div>
  );
}
