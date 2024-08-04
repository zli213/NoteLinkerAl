import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useTheme } from "./../../components/ThemeContext";

function App() {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen" data-theme={theme}>
      <div className="flex flex-col h-full justify-around">
        <Sidebar />
      </div>
      <div className="h-full w-full bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
