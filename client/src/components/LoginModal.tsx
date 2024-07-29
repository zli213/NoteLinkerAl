import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/images/logo.svg";
import { useAuth } from "../store/AuthContext";

const LoginModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setIsLoggedIn, updateAuth, isLoading, setIsLoading } =
    useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [debugInfo, setDebugInfo] = useState("");
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      console.log("Token found in URL parameters:", token);
      localStorage.setItem("token", token);
      console.log(
        "Token stored in localStorage:",
        localStorage.getItem("token")
      );

      axios
        .get(`${apiUrl}/api/account/currentUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data;
          setUser(userData);
          localStorage.setItem("token", token);
          setIsLoggedIn(true);
          updateAuth();
          navigate("/inbox");
        })
        .catch((error) => {
          setError("Failed to fetch user info. Please try again.");
          console.error("Error fetching user info:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.log("No token found in URL parameters.");
    }
  }, [
    location.search,
    setUser,
    setIsLoggedIn,
    updateAuth,
    apiUrl,
    navigate,
    setIsLoading,
  ]);

  const handleEmailLogin = async (e: { preventDefault: () => void }) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/account/login`, {
        email,
        password,
      });

      setDebugInfo(
        `Response received: ${JSON.stringify(response.data, null, 2)}`
      );

      if (response.data && response.data.token) {
        const token = response.data.token;
        console.log("Token received from login response:", token);
        localStorage.setItem("token", token);
        console.log(
          "Token stored in localStorage:",
          localStorage.getItem("token")
        );

        const userResponse = await axios.get(
          `${apiUrl}/api/account/currentUser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = userResponse.data;
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("token", token);
        updateAuth();
        navigate("/inbox");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Invalid email or password");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExternalLogin = async (provider: string) => {
    setIsLoading(true);
    setError("");
    try {
      window.location.href = `${apiUrl}/api/account/external-login?provider=${provider}`;
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

        <div className="mt-4">
          <pre>{debugInfo}</pre>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
