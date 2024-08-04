import { useTheme } from "../../components/ThemeContext";
import backgroundPic from "../../../../client/public/images/DALL·E Aug 04 Promotional Image.webp";
import { useState } from "react";
import LoginModal from "../../components/LoginModal";

const HomePage = () => {
  const { theme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <div
      className={`container h-screen mx-auto p-4 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className="hero h-full relative"
        style={{
          backgroundImage: `url(${backgroundPic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-neutral-content text-center relative z-10">
          <div className="max-w-xl bg-black bg-opacity-50 p-6 rounded-lg">
            <h1 className="text-4xl font-bold mt-2 text-center text-white shadow-lg">
              This{" "}
              <span className="text-pink-400 text-5xl">technical demo</span>{" "}
              showcases how to use the React and .Net
            </h1>
            <h1 className="text-3xl font-bold my-4 text-center text-white shadow-lg">
              by creating{" "}
              <span className="text-emerald-400 text-4xl">
                a note taking app
              </span>
              , powered by AI
            </h1>
            <button
              className="btn btn-primary"
              onClick={() => setShowLoginModal(true)}
            >
              Get Started
            </button>
            {showLoginModal && <LoginModal />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
