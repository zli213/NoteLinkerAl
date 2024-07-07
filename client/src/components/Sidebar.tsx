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

const Sidebar = () => {
  const { theme } = useTheme();
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
        {/* <button className=" w-full bg-blue-500 text-white py-2 px-4 rounded hover:text-gray-900 p-2 transition-colors duration-150 ease-in-out hover:bg-blue-600">
          Sign In
        </button> */}
        <CustomModal name={"Sign in"} />
      </div>
      <div className="mb-4">
        <button
          className={`btn w-full py-2 px-4 rounded ${
            theme === "dark"
              ? "bg-slate-700 text-white hover:bg-slate-800"
              : "bg-zinc-200 text-black  hover:bg-zinc-300"
          }`}
        >
          + New Thread
        </button>
      </div>

      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <a
              href="#"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <Home className="mr-2" size={20} />
              Home
            </a>
          </li>
          {/* Add inbox */}
          <li className="mb-2">
            <a
              href="#"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <Inbox className="mr-2" size={20} />
              Inbox
            </a>
          </li>
          {/* Add notes */}
          <li className="mb-2">
            <a
              href="#"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <StickyNote className="mr-2" size={20} />
              Notes
            </a>
          </li>
          <li className="mb-2">
            <a
              href="#"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <NotebookTabs className="mr-2" size={20} />
              Notebooks
            </a>
          </li>
          <li className="mb-2">
            <a
              href="#"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <Trash2 className="mr-2" size={20} />
              Trash
            </a>
          </li>
          <li className="mb-2">
            <a
              href="#"
              className={`flex items-center p-2 rounded ${
                theme === "dark"
                  ? "text-gray-100 hover:text-gray-200 hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <Clock className="mr-2" size={20} />
              History
            </a>
          </li>
          {/* Add more menu items as needed */}
        </ul>
      </nav>

      {/* <div className="mt-auto">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Upgrade to Pro</h3>
          <p className="text-sm text-gray-600 mb-2">
            Unlimited access to top models like GPT-4o and other advanced
            features.
          </p>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">
            Learn More
          </button>
        </div>
      </div> */}

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
    </div>
  );
};

export default Sidebar;
