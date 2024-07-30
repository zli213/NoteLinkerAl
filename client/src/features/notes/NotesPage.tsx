import { useEffect } from "react";
import Card from "../../components/Card";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
export default function NotesPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-4xl font-bold mb-8 ml-8 mt-3">Notes</h1>
      <div className="flex-grow overflow-y-auto px-8 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(18)].map((_, index) => (
            <Card key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
