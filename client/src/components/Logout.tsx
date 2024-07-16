import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("accountType");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("roles");

    navigate("/inbox");
  }, [navigate]);

  return null;
};

export default Logout;
