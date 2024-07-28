// AuthProvider.tsx
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

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [haveChange, setHaveChange] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Added error state
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  const updateAuth = () => {
    setHaveChange((prev) => !prev);
  };

  const getToken = async (): Promise<string | undefined> => {
    // Logic to get the token
    // This is just a placeholder logic
    const token = localStorage.getItem("token");
    return token ? token : undefined;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }

    if (token) {
      localStorage.setItem("token", token);

      // Fetch user info from the API using the token
      axios
        .get(`${apiUrl}/api/account/currentUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data;
          setUser(userData);
          setIsLoggedIn(true);
          setIsLoading(false);
        })
        .catch((_error) => {
          setError("Failed to fetch user info. Please try again.");
          setIsLoading(false);
        });
    } else {
      setError("Login failed. Please try again.");
      setIsLoading(false);
    }
  }, [isLoggedIn, haveChange]);

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
      {error && <div>{error}</div>} {/* Display error if any */}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
