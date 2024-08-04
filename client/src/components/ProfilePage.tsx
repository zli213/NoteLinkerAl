import { useState } from "react";
import { useTheme } from "./ThemeContext";

interface ProfilePageProps {
  onClose: () => void;
}

const ProfilePage = ({ onClose }: ProfilePageProps) => {
  const { theme } = useTheme();
  const [username, setUsername] = useState("John Doe");
  const [avatar, setAvatar] = useState(
    "https://api.dicebear.com/9.x/shapes/svg"
  );

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg shadow-xl max-w-md w-full p-8 relative ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-full z-10"
        >
          X
        </button>
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Profile Page</h2>
          <p
            className={`text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage your profile details
          </p>
        </div>

        <div className="w-full mb-4">
          <label
            className={`block text-sm font-bold mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className={`w-full border rounded-md py-2 px-4 mb-3 ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>

        <div className="w-full mb-6">
          <label
            className={`block text-sm font-bold mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
            htmlFor="avatar"
          >
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className={`w-full text-gray-700 py-2 px-4 mb-3 ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>

        <button className="btn bg-blue-500 w-full text-gray-100 py-2 px-4 rounded-md flex items-center justify-center">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
