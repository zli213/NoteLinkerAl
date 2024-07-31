import React, { useState, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.css";
import { Send } from "lucide-react";
import axios from "axios";
import { useAuth } from "../store/AuthContext";

interface EditorProps {
  cardBoxId?: number;
}

const Editor: React.FC<EditorProps> = ({ cardBoxId }) => {
  const [value, setValue] = useState<string>("");
  const { user, setIsLoading } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
  console.log("user:", user);
  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar",
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const handleSend = async () => {
    if (!value.trim()) {
      alert("Content cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a card");
        setIsLoading(false);
        return;
      }

      const cardData = {
        content: value,
        userId: user?.id || "", // Ensure userId is not undefined
        cardBoxId: cardBoxId ?? 0, // Provide a default value if cardBoxId is not provided
        createdAt: new Date().toISOString(),
      };

      console.log("Sending card data:", cardData);

      const response = await axios.post(`${apiUrl}/api/Cards`, cardData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("Card created successfully!");
        setValue("");
      }
    } catch (err) {
      let errorMessage = "Failed to create card. Please try again.";
      if (err instanceof Error) {
        errorMessage += ` Error: ${err.message}`;
      }
      console.error("Failed to create card:", err);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
      />
      <div id="toolbar" className="toolbar">
        <div>
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
          <button className="ql-blockquote"></button>
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-indent" value="-1"></button>
          <button className="ql-indent" value="+1"></button>
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-clean"></button>
        </div>
        <button className="btn btn-xs" onClick={handleSend}>
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Editor;
