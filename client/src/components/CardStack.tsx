// CardStack.jsx
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
      {cards.map((card, index) => (
        <div
          key={index}
          className={`card bg-base-200 w-96 h-60 text-center shadow-md ${
            dismissedCard === card ? "rotate-and-disappear" : ""
          }`}
          onClick={() => handleCardClick(card)}
        >
          <div className="card-body">{card}</div>
        </div>
      ))}
    </div>
  );
};

export default CardStack;
