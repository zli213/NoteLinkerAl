import { useEffect } from "react";
import CardStack from "../../components/CardStack";
import TimeLine from "../../components/TimeLine";
import Editor from "../../components/Editor";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Inbox() {
  const { isLoggedIn, setIsLoading, setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
  useEffect(() => {
    const initAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("token", token);
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${apiUrl}/api/account/currentUser`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const user = response.data;
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Failed to fetch user info:", err);
          navigate("/login");
        } finally {
          setIsLoading(false);
        }
      } else if (!isLoggedIn) {
        navigate("/");
      }
    };

    initAuth();
  }, [setIsLoggedIn, setUser, setIsLoading, navigate, isLoggedIn, apiUrl]);

  return (
    <div className="flex flex-col justify-around items-center h-screen flex-grow">
      <TimeLine />
      <div className="mb-8">
        {/* Card Box */}
        <div className="bg-orange-300 rounded-3xl p-6 pt-10 shadow-lg w-[400px] h-[350px]">
          {/* Dialog Box */}
          <div className="flex justify-center">
            <CardStack />
          </div>
        </div>
      </div>
      <Editor />
    </div>
  );
}
