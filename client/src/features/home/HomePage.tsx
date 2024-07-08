import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Outlet />
    </div>
  );
};

export default HomePage;
