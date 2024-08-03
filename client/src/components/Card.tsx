import { Pencil, Hash, X } from "lucide-react";
import { useState } from "react";
import DOMPurify from "dompurify";
import Editor from "./Editor"; // Make sure the path is correct

interface CardProps {
  content: string;
  createdAt: string;
  tags?: string[];
  cardId?: number;
  onUpdate: (newContent: string) => void;
}

const Card: React.FC<CardProps> = ({
  content,
  createdAt,
  tags = [],
  cardId,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleUpdate = () => {
    onUpdate(newContent);
    setIsEditing(false);
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
              <button
                className="btn btn-ghost btn-xs btn-circle hover:btn-sm"
                onClick={toggleEditing}
              >
                <Pencil size={20} />
              </button>
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
