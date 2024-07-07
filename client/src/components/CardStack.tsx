import { useState } from "react";
import "./CardStack.css"; // 导入自定义 CSS

const CardStack = () => {
  const [cards, setCards] = useState(["A", "B", "C"]);
  const [dismissedCard, setDismissedCard] = useState<string | null>(null);

  const handleCardClick = (card: string) => {
    setDismissedCard(card);

    setTimeout(() => {
      setCards((prevCards) => prevCards.filter((c) => c !== card));
      setDismissedCard(null);
    }, 600);
  };

  return (
    <div className="stack space-y-4">
      {cards.length > 0 ? (
        cards.map((card, index) => (
          <div
            key={index}
            className={`card bg-base-200 w-96 h-60 text-center shadow-md ${
              dismissedCard === card ? "rotate-and-disappear" : ""
            }`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-body">{card}</div>
            {/* Edit and Sort Buttons */}
            <div className="flex justify-center mt-4">
              <button className="bg-blue-400 text-white px-4 py-1 rounded-l-full text-sm">
                Edit
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-1 rounded-r-full text-sm">
                Sort
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-cards-message w-96 h-60 text-center font-bold">
          No new cards, how about write one?
        </div>
      )}
    </div>
  );
};

export default CardStack;
