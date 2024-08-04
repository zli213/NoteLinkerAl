import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import "./Editor.css";
import { Send, Bot } from "lucide-react";
import axios from "axios";
import { useAuth } from "../store/AuthContext";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  cardBoxId?: number;
  cardId?: number;
  onSend?: () => void;
}

const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  cardBoxId,
  cardId,
  onSend,
}) => {
  const { user, setIsLoading } = useAuth();
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<
    { tagId: number; tagName: string; cardTags: any[] }[]
  >([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (value && value.includes("#")) {
      setShowTagSelector(true);
      // Fetch tag suggestions from the API
      const tagReg = /#(\w+)/g;
      const matches = value.match(tagReg);
      if (matches) {
        const query = matches[matches.length - 1].slice(1);
        const requestUrl = `${apiUrl}/api/Tag/search?query=${query}`;
        const token = localStorage.getItem("token"); // Assuming you store your token in localStorage

        axios
          .get(requestUrl, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Authorization header
              "Content-Type": "application/json", // Include any other necessary headers
            },
          })
          .then((response) => {
            setTagSuggestions(response.data);
          })
          .catch((error) => {
            console.error("Error fetching tags:", error); // Add error logging
          });
      }
    } else {
      setShowTagSelector(false);
    }
  }, [value, apiUrl]);

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

      // Extract tags from content
      const tagReg = /#(\w+)/g;
      const tagMatches = value.match(tagReg) || [];
      const tags = tagMatches.map((tag) => tag.slice(1));

      // Create new tags if they don't exist
      const createTagPromises = tags.map(async (tag) => {
        const existingTag = tagSuggestions.find((t) => t.tagName === tag);
        if (!existingTag) {
          const response = await axios.post(
            `${apiUrl}/api/Tag`,
            { tagName: tag },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          return response.data;
        }
        return existingTag;
      });

      const createdTags = await Promise.all(createTagPromises);
      const tagIds = createdTags.map((tag) => tag.tagId);

      const cardData = {
        cardId: cardId || undefined, // Provide cardId if it exists
        content: value,
        userId: user?.id || "", // Ensure userId is not undefined
        cardBoxId: cardBoxId || null, // Provide a default value if cardBoxId is not provided
        createdAt: new Date().toISOString(),
        tags: tagIds,
      };

      // console.log("Sending card data:", cardData);
      if (cardId) {
        const response = await axios.put(
          `${apiUrl}/api/Cards/${cardId}`,
          cardData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Authorization header
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 204) {
          alert("Card updated successfully!");
          onChange(""); // Clear the editor after successful submission
          if (onSend) {
            onSend();
          }
        }
      } else {
        console.log("Creating card...");
        const response = await axios.post(`${apiUrl}/api/Cards`, cardData, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          alert("Card created successfully!");
          onChange(""); // Clear the editor after successful submission
          if (onSend) {
            onSend();
          }
        }
      }
    } catch (err) {
      let errorMessage = "Failed to create/update card. Please try again.";
      if (err instanceof Error) {
        errorMessage += ` Error: ${err.message}`;
      }
      console.error("Failed to create card:", err);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tagName: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        // Get the content before the cursor
        const textBeforeCursor = editor.getText(0, range.index);
        // Match the last word starting with #
        const match = textBeforeCursor.match(/#(\w*)$/);
        if (match) {
          const index = range.index - match[0].length;
          editor.deleteText(index, match[0].length);
          editor.insertText(index, `#${tagName} `);
          editor.setSelection(index + tagName.length + 2);
        }
      }
    }

    // Use setTimeout to clear tag suggestions after a short delay
    setTimeout(() => {
      setShowTagSelector(false);
      setTagSuggestions([]);
    }, 0);
  };

  useEffect(() => {
    if (showTagSelector && value) {
      const tagReg = /#(\w+)$/;
      const matches = value.match(tagReg);
      if (matches) {
        const query = matches[0].slice(1);
        const requestUrl = `${apiUrl}/api/Tag/search?query=${query}`;
        const token = localStorage.getItem("token");

        axios
          .get(requestUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            setTagSuggestions(response.data);
          })
          .catch((error) => {
            console.error("Error fetching tags:", error);
          });
      }
    }
  }, [showTagSelector, value, apiUrl]);

  const handleRewrite = async () => {
    // Construct the prompt with instructions
    const instructions = `
    Please rewrite the following note content to conform to the ReactQuill format. 
    - <b> for bold text
    - <i> for italic text
    - <u> for underlined text
    - <s> for strikethrough text
    - <blockquote> for block quotes
    - <ol> and <li> for ordered lists
    - <ul> and <li> for unordered lists
    - <p class="ql-indent-1"> for indented text
    - <a> for links
    - # for tags, which shoule be less than 5 tags in a note
    Please consider add some relevant tags to the note content. 
    If the original text is too long, summarize and shorten it(less than 200 words).
    Only return the rewritten content without any additional explanation.
    Do not include any enclosing \`\`\`html or \`\`\` tags around the result.

    Here is the current note content:
  `;
    const promptValue = instructions + "\n\n" + value;
    //  Get the return value of api/Card/openai/rewrite
    const response = await axios.post(`${apiUrl}/api/Cards/openai/rewrite`, {
      prompt: promptValue,
    });
    const rewrittenText = response.data.value.choices[0].message.content;
    onChange(rewrittenText);
  };

  // console.log("Token:", localStorage.getItem("token"));

  return (
    <div className="flex flex-col border border-gray-300 shadow-md rounded-lg w-full min-w-[350px]">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-28"
      />
      {showTagSelector && (
        <div className="flex flex-wrap gap-2 mt-2 p-2">
          {tagSuggestions.map((tag) => (
            <button
              key={tag.tagId}
              onClick={() => handleTagClick(tag.tagName)}
              className="bg-gray-200 border border-gray-400 rounded px-2 py-1 cursor-pointer transition-colors duration-300 hover:bg-gray-300"
            >
              {tag.tagName}
            </button>
          ))}
        </div>
      )}
      <div
        id="toolbar"
        className="flex flex-wrap items-center p-2 justify-around"
      >
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
        <button onClick={handleRewrite}>
          <Bot />
        </button>
        <button onClick={handleSend}>
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Editor;
