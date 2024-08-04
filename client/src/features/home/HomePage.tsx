import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";
import { useTheme } from "../../components/ThemeContext";

const HomePage = () => {
  // const authContext = useContext(AuthContext);
  // const { getToken } = authContext || { getToken: null };
  // useEffect(() => {
  //   const initAuth = async () => {
  //     const token = await getToken?.();
  //     if (token) {
  //       console.log("Token found in AuthContext:", token);
  //     } else {
  //       console.log("No token found in AuthContext.");
  //     }
  //   };
  //   initAuth();
  // }, [getToken]);
  const { theme } = useTheme();
  return (
    <div
      className={`container h-screen mx-auto p-4 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold">Home Page</h1>
      <p>Welcome to the homepage!</p>
    </div>
  );
};

export default HomePage;
