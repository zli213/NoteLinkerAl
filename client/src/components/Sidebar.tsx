import {
  Home,
  Clock,
  Inbox,
  StickyNote,
  NotebookTabs,
  Trash2,
  Vibrate,
  Globe,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeContext";
import WebHead from "./WebHead";
import CustomModal from "./CustomModal";
import UserInfo from "./UserInfo";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useAuth } from "../store/AuthContext";
import { useState } from "react";

const Sidebar = () => {
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  return (
    <div
      className={`w-64 h-screen p-4 flex flex-col shadow-sm ${
        theme === "dark" ? "shadow-slate-400" : "shadow-black"
      }`}
    >
      <div className="mb-8">
        <WebHead />
      </div>
      <UserInfo />
      <div className="mb-4">
        <button
          className={`btn w-full py-2 px-4 rounded ${
            theme === "dark"
              ? "bg-slate-700 text-white hover:bg-slate-800"
              : "bg-zinc-200 text-black  hover:bg-zinc-300"
          }`}
          onClick={handleProtectedClick}
        >
          + New Thread
        </button>
      </div>

      <nav className="flex-grow">
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
          {/* <li className="mb-2">
            <NavLink
              to="/notebooks"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
              onClick={handleProtectedClick}
            >
              <NotebookTabs className="mr-2" size={20} />
              Notebooks
            </NavLink>
          </li> */}
          <li className="mb-2">
            <NavLink
              to="/trash"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
              onClick={handleProtectedClick}
            >
              <Trash2 className="mr-2" size={20} />
              Trash
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/history"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
              onClick={handleProtectedClick}
            >
              <Clock className="mr-2" size={20} />
              History
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
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

      {showLoginModal && (
        <CustomModal name="Sign in" onClose={() => setShowLoginModal(false)}>
          <LoginModal />
        </CustomModal>
      )}
    </div>
  );
};

export default Sidebar;
