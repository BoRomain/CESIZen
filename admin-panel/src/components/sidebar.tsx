import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  User,
  Menu,
  X,
  BookOpen,
  Activity,
  ArrowLeftIcon,
  LogOut,
} from "lucide-react";
import logo2 from "../svg/CESIZen logo2.svg";
import { useUser } from "../contexts/UserProviter";
import Cookies from "js-cookie";
import axios from "../utils/axios";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { user } = useUser();

  const menuItems = [
    {
      path: "/main",
      name: "Tableau de bord",
      icon: <LayoutDashboard size={20} />,
    },
    { path: "/main/users", name: "Utilisateurs", icon: <User size={20} /> },
    { path: "/main/infos", name: "Informations", icon: <BookOpen size={20} /> },
    {
      path: "/main/activities",
      name: "Activités",
      icon: <Activity size={20} />,
    },
  ];

  function handleLogout() {
    axios.post("/utilisateur/logout").then(() => {
      localStorage.removeItem("accessToken");
      window.location.reload();
    });
  }

  return (
    <div
      className={`flex flex-col overflow-hidden shadow-2xl border-r-6 border-primary rounded-r-4xl h-screen bg-background_box text-text transition-all duration-300 ${isOpen ? "w-64" : "w-[70px]"}`}
    >
      <div className="relative flex items-center justify-between p-4 mb-5">
        <img src={logo2} style={{ width: "150px" }} />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 absolute top-4 right-4 rounded-lg hover:bg-slate-200 transition-colors"
        >
          {isOpen ? <ArrowLeftIcon size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/main"}
            className={({ isActive }) => `
              flex items-center p-3 rounded-xl transition-all duration-200
              ${isActive ? "bg-primary text-background_container" : "text-text hover:bg-slate-300"}
            `}
          >
            <div className="min-w-[24px]">{item.icon}</div>
            {isOpen && (
              <span className="ml-4 font-bold whitespace-nowrap">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="flex flex-col ml-2">
        <div className={`flex flex-row p-3 ${!isOpen && "hidden"}`}>
          <User size={20} />
          <span className="whitespace-nowrap ml-2">
            {user?.nom} {user?.prenom}
          </span>
        </div>
        <button
          className={`flex items-center w-fit p-3 mb-5 rounded-xl transition-all duration-200
              text-danger hover:opacity-60`}
          onClick={handleLogout}
        >
          <div className="min-w-[24px]">
            <LogOut size={20} />
          </div>
          {isOpen && (
            <span className="ml-4 font-bold whitespace-nowrap">
              Se déconnecter
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
