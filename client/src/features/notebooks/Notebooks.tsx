import { useEffect, useState } from "react";
import samplePdf from "../../../public/Tell Me About Yourself Worksheet.pdf";
import { UploadFile } from "../../components/UploadFIle";
import Chat from "../../components/Chat";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";

const Notebooks = () => {
  const [showDocument, setShowDocument] = useState(true);
  const [showSupportingContent, setShowSupportingContent] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleDocumentClick = () => {
    setShowDocument(true);
    setShowSupportingContent(false);
  };

  const handleSupportingContentClick = () => {
    setShowDocument(false);
    setShowSupportingContent(true);
  };

  return (
    <div
      className={`flex flex-row ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex flex-col w-3/4">
        <div role="tablist" className="tabs tabs-boxed">
          <button role="tab" className="tab" onClick={handleDocumentClick}>
            Document
          </button>
          <button
            role="tab"
            className="tab tab-active"
            onClick={handleSupportingContentClick}
          >
            Supporting content
          </button>
        </div>
        {showDocument && (
          <iframe title="pdf" src={samplePdf} className="w-full h-full" />
        )}
      </div>
      <div
        className="bg-local bg-cover bg-center h-screen w-full flex flex-col items-center justify-around"
        style={{ backgroundImage: "url(/images/background.jpg)" }}
      >
        <UploadFile />
        <Chat />
      </div>
    </div>
  );
};

export default Notebooks;
