import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Map from "./components/Map";
import { isAuthorizedState } from "./states/isAuth";

function App() {
  const navigate = useNavigate();
  const [isAuthorized] = useRecoilState(isAuthorizedState);

  useEffect(() => {
    if (!isAuthorized) navigate("/login");
  }, [isAuthorized]);

  return (
    <>
      <Map></Map>
    </>
  );
}

export default App;
