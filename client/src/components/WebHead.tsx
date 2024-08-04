import { ArrowLeftToLine } from "lucide-react";
import logo from "../../../client/public/images/logo.svg";
import { useTheme } from "./ThemeContext";

interface WebHeadProps {
  toggleSidebar: () => void;
}

const WebHead = ({ toggleSidebar }: WebHeadProps) => {
  const { theme } = useTheme();
  return (
    <div
      className={`flex items-center justify-between ${
        theme === "dark" ? "shadow-slate-400" : "shadow-black"
      }`}
    >
      <div className="flex items-center">
        <img src={logo} alt="logo" className="w-6 h-6 mr-1" />
        <h1 className="text-2xl font-bold">NoteLinkerAl</h1>
      </div>
      <button
        className="btn btn-circle btn-sm btn-link"
        onClick={toggleSidebar}
      >
        <ArrowLeftToLine
          size={24}
          color={theme === "dark" ? "white" : "black"}
        />
      </button>
    </div>
  );
};

export default WebHead;
