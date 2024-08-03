import { Pencil, Hash, Check, X } from "lucide-react";
import { useState } from "react";
import DOMPurify from "dompurify";

interface CardProps {
  content: string;
  createdAt: string;
  tags?: string[];
  onUpdate: (newContent: string) => void;
}

const Card: React.FC<CardProps> = ({
  content,
  createdAt,
  tags = [],
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

  return (
    <div className="card bg-base-200 w-96 h-96 shadow-xl">
      <div className="card-body">
        <p className="text-gray-400 text-sm">{createdAt}</p>
        {isEditing ? (
          <textarea
            className="textarea textarea-bordered w-full"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={5}
          />
        ) : (
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}
        <div className="flex flex-row justify-between items-center">
          <div className="card-actions justify-start">
            {tags.map((tag, index) => (
              <div key={index} className="badge">
                <Hash size={12} />
                {tag}
              </div>
            ))}
          </div>
          <div className="card-actions justify-end">
            {isEditing ? (
              <>
                <button
                  className="btn btn-ghost btn-xs btn-circle hover:btn-sm"
                  onClick={handleUpdate}
                >
                  <Check size={20} />
                </button>
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
      </div>
    </div>
  );
};

export default Card;
