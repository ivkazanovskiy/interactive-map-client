import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

export default function Home() {
  let auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.signin(() => navigate("/campaign"));
  }, []);

  return <div>This is a home page</div>;
}
