import { useState, useEffect } from "react";
import Card from "./Card";
import DOMPurify from "dompurify";

interface Card {
  cardId: number;
  content: string;
  userId: string;
  cardBoxId: number | null;
  createdAt: string;
  tags: string[];
}

interface CardStackProps {
  initialCards: Card[];
}

const CardStack: React.FC<CardStackProps> = ({ initialCards }) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [dismissedCard, setDismissedCard] = useState<Card | null>(null);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const handleCardClick = (card: Card) => {
    setDismissedCard(card);

    setTimeout(() => {
      setCards((prevCards) =>
        prevCards.filter((c) => c.cardId !== card.cardId)
      );
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
            {/* <div
              className="card-body"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(card.content),
              }}
            /> */}
            <Card
              content={card.content}
              createdAt={card.createdAt}
              tags={card.tags}
              onUpdate={() => {}}
            />
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
