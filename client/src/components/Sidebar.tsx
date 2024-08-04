import {
  Home,
  Inbox,
  StickyNote,
  Vibrate,
  Globe,
  ArrowRightToLine,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import WebHead from "./WebHead";
import CustomModal from "./CustomModal";
import UserInfo from "./UserInfo";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useAuth } from "../store/AuthContext";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="relative">
      {showSidebar ? (
        <div
          className={`w-64 h-screen p-4 flex flex-col shadow-sm ${
            theme === "dark"
              ? "shadow-slate-400 bg-gray-900 text-white"
              : "shadow-black bg-white text-gray-900"
          }`}
        >
          <div className="mb-8">
            <WebHead toggleSidebar={toggleSidebar} />
          </div>
          <UserInfo />
          <nav className="flex-grow mt-2">
            <ul>
              {!isLoggedIn && (
                <li className="mb-2">
                  <NavLink
                    to="/"
                    className={`flex items-center p-2 rounded ${
                      theme === "dark"
                        ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <Home className="mr-2" size={20} />
                    Home
                  </NavLink>
                </li>
              )}
              <li className="mb-2">
                <NavLink
                  to="/inbox"
                  className={`flex items-center p-2 rounded ${
                    theme === "dark"
                      ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                  onClick={handleProtectedClick}
                >
                  <Inbox className="mr-2" size={20} />
                  Inbox
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink
                  to="/notes"
                  className={`flex items-center p-2 rounded ${
                    theme === "dark"
                      ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                  onClick={handleProtectedClick}
                >
                  <StickyNote className="mr-2" size={20} />
                  Notes
                </NavLink>
              </li>
            </ul>
          </nav>
          {showLoginModal && (
            <CustomModal
              name="Sign in"
              onClose={() => setShowLoginModal(false)}
            >
              <LoginModal />
            </CustomModal>
          )}
          <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
            <button className="flex items-center justify-center p-2 hover:bg-gray-200 rounded">
              <Vibrate size={16} className="mr-1" />
              <span className="text-xs">Feedback</span>
            </button>
            <div className="flex items-center">
              <ThemeToggle />
              <div className="dropdown dropdown-top dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-ghost">
                  <Globe size={16} />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a>English</a>
                  </li>
                  <li>
                    <a>Chinese</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="absolute top-2 btn btn-circle btn-sm btn-link"
          onClick={toggleSidebar}
        >
          <ArrowRightToLine size={24} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
