import { Pencil, Hash } from "lucide-react";
import { useState } from "react";
const Card = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  return (
    <div className="card bg-base-200 w-96 shadow-xl -z-40">
      {/* <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        />
      </figure> */}
      <div className="card-body">
        <p className="text-gray-400 text-sm">2024-05-17 10:11:40 </p>
        <p className="text-gray-700 line-clamp-4">
          The word originates from the original Greek ἀδάμας (meaning
          indomitable). Adamantium is a dark, shiny gray, similar in appearance
          to <span className="underline">high-grade steel</span> or titanium. It
          is almost impossible to destroy or fracture in this state, and when
          molded to a sharp edge, it can penetrate most lesser materials with
          minimal force.
        </p>
        <div className="flex flex-row justify-between items-center">
          <div className="card-actions justify-start">
            <div className="badge">
              <Hash size={12} />
              Fashion
            </div>
            <div className="badge">
              <Hash size={12} />
              Products
            </div>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-ghost btn-xs btn-circle hover:btn-sm">
              <Pencil size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
