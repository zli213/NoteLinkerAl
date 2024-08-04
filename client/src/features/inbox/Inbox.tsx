import { useEffect, useState } from "react";
import CardStack from "../../components/CardStack";
import TimeLine from "../../components/TimeLine";
import Editor from "../../components/Editor";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Card {
  cardId: number;
  content: string;
  userId: string;
  cardBoxId: number | null;
  createdAt: string;
  tags: string[];
  // Add other properties of Card if necessary
}

export default function Inbox() {
  const { isLoggedIn, setIsLoading, user, setUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
  const [cards, setCards] = useState<Card[]>([]);
  const [newCardContent, setNewCardContent] = useState("");
  useEffect(() => {
    const fetchUserAndCards = async (token: string | null) => {
      if (token) {
        localStorage.setItem("token", token);
        setIsLoading(true);
        try {
          const userResponse = await axios.get(
            `${apiUrl}/api/account/currentUser`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const user = userResponse.data;
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Failed to fetch user info:", err);
          navigate("/login");
          return;
        } finally {
          setIsLoading(false);
        }
      }

      if (user) {
        try {
          const cardsResponse = await axios.get(`${apiUrl}/api/Cards`);
          const allCards: Card[] = cardsResponse.data;
          const inboxCards = allCards.filter(
            (card: Card) => card.cardBoxId === null && card.userId === user.id
          );
          setCards(inboxCards);
        } catch (err) {
          console.error("Failed to fetch cards:", err);
        }
      } else {
        navigate("/");
      }
    };
    setNewCardContent("");
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    fetchUserAndCards(token);
  }, [
    setIsLoggedIn,
    setUser,
    setIsLoading,
    navigate,
    isLoggedIn,
    apiUrl,
    user,
  ]);

  return (
    <div className="flex flex-col justify-around items-center h-screen flex-grow">
      <TimeLine />
      <div className="mb-8">
        {/* Card Box */}
        <div className="bg-orange-300 rounded-3xl p-6 pt-10 shadow-lg w-[500px] h-[350px]">
          {/* Dialog Box */}
          <div className="flex justify-center">
            <CardStack initialCards={cards} />
          </div>
        </div>
      </div>
      <div className="w-2/3">
        <Editor value={newCardContent} onChange={setNewCardContent} />
      </div>
    </div>
  );
}
