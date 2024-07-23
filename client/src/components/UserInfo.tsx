import { useState } from "react";
import { ListMinus } from "lucide-react";
import ProfilePage from "./ProfilePage"; // Adjust the import path as needed
import { useAuth } from "../store/AuthContext";
import Logout from "./Logout";

const UserInfo = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  return (
    <>
      {isLoggedIn && user && (
        <div className="flex flex-row justify-between items-center">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img
                src={
                  user.avatarUrl || "https://api.dicebear.com/9.x/shapes/svg"
                }
                alt="User Avatar"
              />
            </div>
          </div>
          <div className="user-info">
            <div className="user-name text-xs">{user.userName}</div>
            <div className="user-email text-xs">{user.email}</div>
          </div>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 btn-ghost btn-xs"
            >
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
                <Logout />
              </li>
            </ul>
          </div>
        </div>
      )}

      {isProfileOpen && <ProfilePage onClose={closeProfile} />}
    </>
  );
};

export default UserInfo;
