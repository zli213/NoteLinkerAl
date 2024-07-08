import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen w-full bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
