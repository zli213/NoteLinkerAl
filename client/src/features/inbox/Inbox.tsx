import CardStack from "../../components/CardStack";
import TimeLine from "../../components/TimeLine";
import Editor from "../../components/Editor";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Inbox() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  if (!isLoggedIn) {
    navigate("/");
  }
  return (
    <div className="flex flex-col justify-around items-center h-screen flex-grow">
      <TimeLine />
      <div className="mb-8">
        {/* Card Box */}
        <div className="bg-orange-300 rounded-3xl p-6 pt-10 shadow-lg w-[400px] h-[350px]">
          {/* Dialog Box */}
          <div className="flex justify-center">
            <CardStack />
          </div>
        </div>
      </div>
      <Editor />
    </div>
  );
}
