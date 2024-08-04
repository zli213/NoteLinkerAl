import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure to install axios: npm install axios

interface Card {
  cardId: number;
  content: string;
  userId: string;
  cardBoxId: number | null;
  createdAt: string;
  tags: string[];
}

export default function NotesPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      fetchUserCards();
    }
  }, [isLoggedIn, navigate]);

  const fetchUserCards = async () => {
    try {
      const cardsResponse = await axios.get(`${apiUrl}/api/Cards`);
      const allCards: Card[] = cardsResponse.data;
      const inboxCards = allCards.filter(
        (card: Card) => card.userId === user?.id
      );
      setCards(inboxCards);
    } catch (error) {
      console.error("Failed to fetch user cards:", error);
    }
  };

  const handleDeleteCard = (cardId: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.cardId !== cardId));
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-4xl font-bold mb-8 ml-8 mt-3">Notes</h1>
      <div className="flex-grow overflow-y-auto px-8 pb-8 justify-center">
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-1 sm:gap-2 lg:gap-3">
          {cards.map((card) => (
            <Card
              key={card.cardId}
              content={card.content}
              createdAt={card.createdAt}
              tags={card.tags}
              cardId={card.cardId}
              onUpdate={(newContent) => {
                // Update the card content in the state
                setCards((prevCards) =>
                  prevCards.map((c) =>
                    c.cardId === card.cardId ? { ...c, content: newContent } : c
                  )
                );
              }}
              onDelete={handleDeleteCard} // Pass the delete handler as a prop
            />
          ))}
        </div>
      </div>
    </div>
  );
}
