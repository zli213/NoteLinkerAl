import React, { useEffect } from "react";
import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
const TrashPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);
  return <div>TrashPage</div>;
};

export default TrashPage;
