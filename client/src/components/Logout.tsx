import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const Logout = () => {
  const { setIsLoading, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      logout();
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
