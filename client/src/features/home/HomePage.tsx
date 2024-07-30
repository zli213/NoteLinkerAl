import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";

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

  return (
    <div>
      <h1>Home Page</h1>
      <Outlet />
    </div>
  );
};

export default HomePage;
