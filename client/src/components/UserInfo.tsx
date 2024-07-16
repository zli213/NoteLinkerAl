import { useEffect, useState } from "react";
import { ListMinus } from "lucide-react";
import ProfilePage from "./ProfilePage"; // Adjust the import path as needed
import axios from "axios";

const UserInfo = () => {
  console.log("localStorage", localStorage);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  const [user, setUser] = useState<any>({
    id: "",
    userName: "",
    email: "",
    accountType: "",
    avatarUrl: "",
    roles: [],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      setError(error);
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
          localStorage.setItem("userId", userData.id);
          localStorage.setItem("userName", userData.userName);
          localStorage.setItem("email", userData.email);
          localStorage.setItem("accountType", userData.accountType);
          localStorage.setItem("avatarUrl", userData.avatarUrl);
          localStorage.setItem("roles", JSON.stringify(userData.roles));
          // navigate("/inbox");
        })
        .catch((_error) => {
          setError("Failed to fetch user info. Please try again.");
        });
    } else {
      setError("Login failed. Please try again.");
    }
  }, [location]);

  console.log("localStorage", localStorage);
  console.log("user", user);

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("accountType");
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("roles");

    window.location.href = "/notes";
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="avatar">
          <div className="w-10 h-10 rounded-full">
            <img
              src="https://api.dicebear.com/9.x/shapes/svg"
              alt="User Avatar"
            />
          </div>
        </div>
        <div className="user-info">
          <div className="user-name text-xs">{user.userName}</div>
          <div className="user-email text-xs">{user.email}</div>
        </div>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1 btn-ghost btn-xs">
            <ListMinus />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <a onClick={openProfile}>Account Profile</a>
            </li>
            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {isProfileOpen && <ProfilePage onClose={closeProfile} />}
    </>
  );
};

export default UserInfo;
