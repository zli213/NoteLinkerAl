import { Pencil, Hash, X, Ellipsis, FileX2 } from "lucide-react";
import { useState } from "react";
import DOMPurify from "dompurify";
import Editor from "./Editor"; // Make sure the path is correct
import axios from "axios";

interface CardProps {
  content: string;
  createdAt: string;
  tags?: string[];
  cardId?: number;
  onUpdate: (newContent: string) => void;
  onDelete: (cardId: number) => void;
}

const Card: React.FC<CardProps> = ({
  content,
  createdAt,
  tags = [],
  cardId,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleUpdate = () => {
    onUpdate(newContent);
    setIsEditing(false);
  };
  const handleDelete = async () => {
    if (cardId !== undefined) {
      try {
        const response = await axios.delete(`${apiUrl}/api/Cards/${cardId}`);
        if (response.status === 204) {
          alert("Card deleted successfully");
          onDelete(cardId); // Call onDelete prop to update the parent state
        }
      } catch (error) {
        console.error("Error deleting card:", error);
        alert("Failed to delete the card. Please try again.");
      }
    } else {
      console.error("Card ID is undefined");
      alert("Card ID is undefined. Cannot delete the card.");
    }
  };

  const highlightTags = (html: string) => {
    const tagReg = /(#\w+)/g;
    return html.replace(
      tagReg,
      (match) =>
        `<span class="bg-sky-50 text-sky-500 rounded-lg">${match}</span>`
    );
  };

  const sanitizedContent = DOMPurify.sanitize(highlightTags(content));

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="card bg-base-200 w-auto min-w-80 h-auto shadow-xl">
      <div className="card-body flex flex-col justify-between p-4">
        <div className="flex flex-row justify-between">
          <div className="text-gray-400 text-sm mb-2">{formattedDate}</div>
          <div className="card-actions justify-end">
            {isEditing ? (
              <>
                <button
                  className="btn btn-ghost btn-xs btn-circle hover:btn-sm"
                  onClick={toggleEditing}
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <details className="dropdown">
                <summary className="btn m-1">
                  <Ellipsis />
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-16 p-2 shadow">
                  <li>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={toggleEditing}
                    >
                      <Pencil />
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={handleDelete}
                    >
                      <FileX2 />
                    </button>
                  </li>
                </ul>
              </details>
            )}
          </div>
        </div>
        {isEditing ? (
          <Editor
            value={newContent}
            onChange={setNewContent}
            cardId={cardId}
            onSend={handleUpdate}
          />
        ) : (
          <div
            className="text-gray-700 mb-2"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}
        <div className="flex flex-row justify-between items-center mt-2">
          <div className="card-actions justify-start">
            {tags.map((tag, index) => (
              <div key={index} className="badge">
                <Hash size={12} />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
