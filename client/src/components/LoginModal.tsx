import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/images/logo.svg";
import { useAuth } from "../store/AuthContext";

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setIsLoggedIn, setIsLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  useEffect(() => {
    const handleCallback = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const error = params.get("error");
      if (error) {
        console.error("External login error:", error);
        setIsLoading(false);
        setError("External login failed. Please try again.");
        return;
      }

      if (token) {
        localStorage.setItem("token", token);
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
          localStorage.setItem("user", JSON.stringify(user)); // Store user info in local storage
          setUser(user);
          setIsLoggedIn(true);
          navigate("/inbox");
        } catch (err) {
          console.error("Failed to fetch user info:", err);
        }
      }

      setIsLoading(false);
    };

    if (
      window.location.search.includes("token") ||
      window.location.search.includes("error")
    ) {
      handleCallback();
    }
  }, [setIsLoading, setUser, setIsLoggedIn, apiUrl, navigate]);

  const handleEmailLogin = async (e: { preventDefault: () => void }) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/account/login`, {
        email,
        password,
      });
      if (response.status !== 200) {
        throw new Error("Login failed");
      } else {
        const user = response.data;
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setIsLoggedIn(true);
        navigate("/inbox");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExternalLogin = async (provider: string) => {
    setIsLoading(true);
    setError("");
    try {
      window.location.href = `${apiUrl}/api/account/external-login?provider=${provider}&returnUrl=${window.location.origin}/login`;
    } catch (error) {
      console.error("Failed to initiate external login:", error);
      setError("Failed to initiate login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="logo" className="w-16 h-16 mr-1" />
          <h2 className="text-2xl font-bold mb-2">Login to NoteLinkerAI</h2>
          <p className="text-gray-600 text-center">
            AI-powered notes app for everyone
          </p>
        </div>

        <button
          onClick={() => handleExternalLogin("Google")}
          className="btn bg-blue-500 w-full text-gray-100 py-2 px-4 rounded-md mb-3 flex items-center justify-center"
        >
          <img
            src="https://banner2.cleanpng.com/20180423/gkw/kisspng-google-logo-logo-logo-5ade7dc753b015.9317679115245306313428.jpg"
            alt="Google logo"
            className="mr-2 w-5"
          />
          Continue with Google
        </button>

        <button
          onClick={() => handleExternalLogin("Microsoft")}
          className="btn bg-blue-500 w-full text-gray-100 py-2 px-4 rounded-md mb-6 flex items-center justify-center"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png"
            alt="Microsoft logo"
            className="mr-2 w-5"
          />
          Continue with Microsoft
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-md py-2 px-4 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md py-2 px-4 mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center"
          >
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
