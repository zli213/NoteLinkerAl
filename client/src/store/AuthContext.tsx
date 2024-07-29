import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  userName: string;
  email: string;
  accountType: string;
  avatarUrl: string;
  roles: string[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateAuth: () => void;
  logout: () => void;
  getToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  const getToken = async (): Promise<string | undefined> => {
    const token = localStorage.getItem("token");
    return token ? token : undefined;
  };

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(`${apiUrl}/api/account/currentUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      setError("Failed to fetch user info. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = await getToken();
      if (token) {
        await fetchUser(token);
      } else {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const updateAuth = () => {
    setIsLoggedIn((prev) => !prev);
  };

  const contextValue: AuthContextType = {
    isLoggedIn,
    user,
    setUser,
    setIsLoggedIn,
    isLoading,
    setIsLoading,
    updateAuth,
    logout: () => {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggedIn(false);
    },
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {error && <div>{error}</div>}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };
