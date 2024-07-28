import { useNavigate } from "react-router-dom";
// src/components/Logout.js
import { useAuth } from "../store/AuthContext";

const Logout = () => {
  const { setUser, setIsLoggedIn, updateAuth, setIsLoading } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
      updateAuth();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
    navigate("/");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
